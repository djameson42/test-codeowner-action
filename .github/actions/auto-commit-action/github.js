const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios");

const token = `token ${core.getInput("access-token")}`;

const JSON_ACCEPT_HEADER = {
  "Accept": "application/vnd.github.v3+json",
  "Authorization": token
};

const RAW_ACCEPT_HEADER = {
  "Accept": "application/vnd.github.v3.raw",
  "Authorization": token
};

module.exports.getPullRequestReviews = (url) => {
  console.log("Getting pull request reviews");
  return axios.get(url + "/reviews", {
    headers: JSON_ACCEPT_HEADER
  });
};

const ghPRRequest = (url, event, token, comments) => {
  return axios.post(url + "/reviews", {
    "event": event,
    "comments": comments
  }, 
  {
    headers: RAW_ACCEPT_HEADER
  });
};

const getLatestCommit = (url) => {
  return axios.get(url, {
    headers: JSON_ACCEPT_HEADER
  });
}

const getLatestCommitter = async (url) => {
  const data = (await getLatestCommit(url)).data;
  return data.committer.login;
}

const approvePR = (pullRequest) => {
  console.log("Approving PR");
  return ghPRRequest(pullRequest.url, "APPROVE", token);
};
