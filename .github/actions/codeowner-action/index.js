const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios");

const token = `token ${core.getInput("access-token")}`;

const JSON_ACCEPT_HEADER = {
  "Accept": "application/vnd.github.v3+json",
  "Authorization": token
};

const getPullRequestFiles = (url) => {
  console.log("Getting new schema files");
  return axios.get(url + "/files?per_page=50", {
    headers: JSON_ACCEPT_HEADER
  });
};

const payload = github.context.payload;
console.log(`Event payload: ${JSON.stringify(payload, undefined, 2)}`);

console.log(getPullRequestFiles(payload.pull_request.url));




