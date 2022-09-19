const fs = require("fs");


const changeTimestamp = async () => {
  const data = await fs.readFile("test-file.txt", "utf8");
  const result = data.replace(/option \(xero\.schema_file_last_modified\) = \d+;/, `option (xero.schema_file_last_modified) = ${Math.floor(Date.now() / 1000)};`);
  await fs.writeFile("test-file.txt", result, "utf8");
};

console.log("starting action");

changeTimestamp();

