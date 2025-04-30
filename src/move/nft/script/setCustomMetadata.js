require("dotenv").config();
const { Transaction } = require("@iota/iota-sdk/transactions");
const { IotaClient, getFullnodeUrl } = require("@iota/iota-sdk/client");
const { Ed25519Keypair } = require("@iota/iota-sdk/keypairs/ed25519");
const { readData } = require("./readData");
const { bcs } = require("@iota/bcs");

const Attribute = bcs.struct("Attribute", {
  trait_type: bcs.string(),
  value: bcs.string(),
});

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

async function setCustomMetadata() {
  const {
    NETWORK,
    DATA_FOLDER,
    ADMIN_CAP_OWNER_ACCOUNT_MNEMONIC,
    ADMIN_CAP_OWNER_ACCOUNT_PRIV_KEY,
    MOVE_PACKAGE_ID,
    MOVE_MODULE,
    MOVE_MODULE_FUNCTION,
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

  let { token_id_list, dna_list, attributes_list } =
    await readData(DATA_FOLDER);

  attributes_list = [
    { trait_type: "some_trait_1", value: "some_value_1" },
    { trait_type: "another_trait_1", value: "another_value_1" },
  ];

  const { trait_type_list, value_list } = convertAttributeList(attributes_list);
  ``;

  const txb = new Transaction();
  txb.setSender(keypair.toIotaAddress());
  console.log("sender:", keypair.toIotaAddress());

  const [attr_list] = txb.moveCall({
    target: `${MOVE_PACKAGE_ID}::${MOVE_MODULE}::make_attr_list`,
    arguments: [
      txb.pure.vector("string", trait_type_list),
      txb.pure.vector("string", value_list),
    ],
  });

  // Set the moveCall to the target Move module function
  txb.moveCall({
    target: `${MOVE_PACKAGE_ID}::${MOVE_MODULE}::${MOVE_MODULE_FUNCTION}`,
    arguments: [
      txb.object(MOVE_FUNCTION_ARG_CUSTOM_METADATA_REGISTRY_ID),
      txb.object(MOVE_FUNCTION_ARG_ADMIN_CAP_ID),
      txb.pure.u64(1),
      txb.pure.string("dna_1"), // DNA list
      attr_list,
    ],
  });

  const client = new IotaClient({ url: getFullnodeUrl(NETWORK) });

  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: txb,
  });

  console.log("Result:", result);
}

module.exports = { setCustomMetadata };
