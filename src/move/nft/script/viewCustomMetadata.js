require("dotenv").config();
const { Transaction } = require("@iota/iota-sdk/transactions");
const { IotaClient, getFullnodeUrl } = require("@iota/iota-sdk/client");
const { bcs } = require("@iota/bcs");

const Attribute = bcs.struct("Attribute", {
  trait_type: bcs.string(),
  value: bcs.string(),
});

const CustomMetadata = bcs.struct("CustomMetadata", {
  attributes: bcs.vector(Attribute),
  dna: bcs.string(),
});

// Set custom metadata for a list of NFTs from a data folder
async function viewCustomMetadata() {
  const {
    NETWORK,
    MOVE_PACKAGE_ID,
    MOVE_MODULE,
    MOVE_FUNCTION_ARG_CUSTOM_METADATA_REGISTRY_ID,
    TOKEN_ID,
  } = process.env;

  const txb = new Transaction();

  txb.moveCall({
    target: `${MOVE_PACKAGE_ID}::${MOVE_MODULE}::get_custom_metadata`,
    arguments: [
      txb.object(MOVE_FUNCTION_ARG_CUSTOM_METADATA_REGISTRY_ID),
      txb.pure.u64(TOKEN_ID),
    ],
  });

  const client = new IotaClient({ url: getFullnodeUrl(NETWORK) });

  const result = await client.devInspectTransactionBlock({
    // Set a dummy sender address
    sender:
      "0x7777777777777777777777777777777777777777777777777777777777777777",
    transactionBlock: txb,
  });

  const returnVal = result.results?.[0]?.returnValues?.[0];
  if (!returnVal) {
    throw new Error("No return value found");
  }

  const [bcsBytes, returnType] = returnVal;

  const customMetadata = CustomMetadata.parse(Uint8Array.from(bcsBytes));

  console.log("tokenId:", TOKEN_ID);
  console.log("returnType:", returnType);
  console.log("customMetadata:", customMetadata);
}

viewCustomMetadata().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
