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

const getPullRequestReviews = (url) => {
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

const getLatestCommitAuthor = async (url) => {
  const data = (await getLatestCommit(url)).data;
  console.log(`Latest commit author is ${data.author}`);
}

const approvePR = (pullRequest) => {
  console.log("Approving PR");
  return ghPRRequest(pullRequest.url, "APPROVE", token);
};

const payload = github.context.payload;
console.log(`Event payload: ${JSON.stringify(payload, undefined, 2)}`);

(async () => {
  console.log("starting action");
  try {
    await getLatestCommitAuthor(`${payload.repository.url}/commits/${payload.pull_request.head.ref}`);
    const pullRequestReviews = (await getPullRequestReviews(payload.pull_request.url)).data;

    let approvingReviewers = [];
    for (const review of pullRequestReviews) {
      if (review.state === "APPROVED") {
        console.log(`PR has been APPROVED by ${review.user.login}`);
        approvingReviewers.push(review.user.login);
      }
    }

    if (approvingReviewers.length > 0 && !approvingReviewers.includes("my-test-bot")) {
      console.log("PR has not been approved by BOT, approving");
      await approvePR(payload.pull_request);
    }
  } catch(e) {
    console.log(e);
    throw e;
  }

  //console.log(pullRequestReviews);
  console.log("ending action");
})();




