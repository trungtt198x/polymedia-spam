const { setCustomMetadata } = require("./setCustomMetadata");

setCustomMetadata().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
