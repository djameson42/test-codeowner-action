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

const getPullRequestReviews = (url) => {
  console.log("Getting pull request reviews");
  return axios.get(url + "/reviews", {
    headers: JSON_ACCEPT_HEADER
  });
};

const payload = github.context.payload;
console.log(`Event payload: ${JSON.stringify(payload, undefined, 2)}`);

(async () => {
  console.log("starting action");
  const pullRequestReviews = (await getPullRequestReviews(payload.pull_request.url)).data;

  for (const review in pullRequestReviews) {
    if (review.state === "APPROVED") {
      console.log(`PR has been APPROVED by ${review.user.login}`);
    }
  }

  //console.log(pullRequestReviews);
  console.log("ending action");
})();




