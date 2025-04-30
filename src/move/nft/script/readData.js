const fs = require("fs").promises;
const path = require("path");

async function readData(folderPath) {
  try {
    let token_id_list = [];
    let dna_list = [];
    let attributes_list = [];

    const files = await fs.readdir(folderPath);
    const jsonFiles = files.filter((file) => path.extname(file) === ".json");

    await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(folderPath, file);
        let data = await fs.readFile(filePath, "utf8");
        data = JSON.parse(data);

        token_id_list.push(file.replace(".json", ""));
        dna_list.push(data.dna);
        attributes_list.push(data.attributes);
      }),
    );

    const result = {
      token_id_list,
      dna_list,
      attributes_list,
    };

    console.log("readData - Result:", result);

    return result;
  } catch (err) {
    console.error("readData - Error:", err);
    return null;
  }
}

module.exports = { readData };
