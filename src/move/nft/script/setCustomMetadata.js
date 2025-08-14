require("dotenv").config();
const { Transaction } = require("@iota/iota-sdk/transactions");
const { IotaClient, getFullnodeUrl } = require("@iota/iota-sdk/client");
const { Ed25519Keypair } = require("@iota/iota-sdk/keypairs/ed25519");
const { readData } = require("./readData");

// Convert the attribute list to 2 separate lists
// one for trait_type and one for value
function convertAttributeList(attributeList) {
  let trait_type_list = [];
  let value_list = [];

  for (const attr of attributeList) {
    trait_type_list.push(attr.trait_type);
    value_list.push(attr.value);
  }

  return {
    trait_type_list,
    value_list,
  };
}

// Same as above but for a list of attribute lists
function convertAttributeListList(attributeListList) {
  let trait_type_list_list = [];
  let value_list_list = [];

  for (const attributeList of attributeListList) {
    const { trait_type_list, value_list } = convertAttributeList(attributeList);
    trait_type_list_list.push(trait_type_list);
    value_list_list.push(value_list);
  }

  return {
    trait_type_list_list,
    value_list_list,
  };
}

// Set custom metadata for a list of NFTs from a data folder
async function setCustomMetadata() {
  const {
    NETWORK,
    DATA_FOLDER,
    ADMIN_CAP_OWNER_ACCOUNT_MNEMONIC,
    ADMIN_CAP_OWNER_ACCOUNT_PRIV_KEY,
    MOVE_PACKAGE_ID,
    MOVE_MODULE,
    MOVE_FUNCTION_ARG_CUSTOM_METADATA_REGISTRY_ID,
    MOVE_FUNCTION_ARG_ADMIN_CAP_ID,
  } = process.env;

  let keypair;
  if (ADMIN_CAP_OWNER_ACCOUNT_MNEMONIC) {
    keypair = Ed25519Keypair.deriveKeypair(ADMIN_CAP_OWNER_ACCOUNT_MNEMONIC);
  } else if (ADMIN_CAP_OWNER_ACCOUNT_PRIV_KEY) {
    keypair = Ed25519Keypair.fromSecretKey(ADMIN_CAP_OWNER_ACCOUNT_PRIV_KEY);
  } else {
    throw new Error(
      "Neither ADMIN_CAP_OWNER_ACCOUNT_MNEMONIC nor ADMIN_CAP_OWNER_ACCOUNT_PRIV_KEY not set",
    );
  }

  let { token_id_list, dna_list, attribute_list_list } =
    await readData(DATA_FOLDER);

  const { trait_type_list_list, value_list_list } =
    convertAttributeListList(attribute_list_list);

  const txb = new Transaction();
  txb.setSender(keypair.toIotaAddress());
  console.log("Sender:", keypair.toIotaAddress());

  const [attr_list_list] = txb.moveCall({
    target: `${MOVE_PACKAGE_ID}::${MOVE_MODULE}::make_attr_list_list`,
    arguments: [
      txb.pure.vector("vector<string>", trait_type_list_list),
      txb.pure.vector("vector<string>", value_list_list),
    ],
  });

  // Set the moveCall to the target Move module function
  txb.moveCall({
    target: `${MOVE_PACKAGE_ID}::${MOVE_MODULE}::add_custom_metadata_many`,
    arguments: [
      txb.object(MOVE_FUNCTION_ARG_CUSTOM_METADATA_REGISTRY_ID),
      txb.object(MOVE_FUNCTION_ARG_ADMIN_CAP_ID),
      txb.pure.vector("u64", token_id_list),
      txb.pure.vector("string", dna_list),
      attr_list_list,
    ],
  });

  // const client = new IotaClient({ url: getFullnodeUrl(NETWORK) });
  const client = new IotaClient({ url: NETWORK === 'mainnet' ? 'https://api.mainnet.iota.cafe' : 'https://api.testnet.iota.cafe'});

  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: txb,
  });

  console.log("Result:", result);
}

setCustomMetadata().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
