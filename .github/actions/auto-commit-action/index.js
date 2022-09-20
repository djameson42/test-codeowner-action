const fs = require("fs").promises;


const changeTimestamp = async () => {
  const data = await fs.readFile("test-file.txt", "utf8");
  const result = data.replace(/option \(xero\.schema_file_last_modified\) = \d+;/, `option (xero.schema_file_last_modified) = ${Math.floor(Date.now() / 1000)};`);
  await fs.writeFile("test-file.txt", result, "utf8");
};

console.log("starting action");


const getLatestCommit = (url) => {
  return axios.get(url, {
    headers: JSON_ACCEPT_HEADER
  });
}

const getLatestCommitter = async (url) => {
  const data = (await getLatestCommit(url)).data;
  return data.committer.login;
}

(async () => {
  const committer = await getLatestCommitter(`${payload.repository.url}/commits/${payload.pull_request.head.ref}`);

  if (committer != "my-test-bot") {
    changeTimestamp();
  }
})();
