const github = require("@actions/github");
const githubClient = require("../common/github.js")

const payload = github.context.payload;
//console.log(`Event payload: ${JSON.stringify(payload, undefined, 2)}`);

(async () => {
  console.log("starting action");
  try {
    const committer = await githubClient.getLatestCommitter(`${payload.repository.url}/commits/${payload.pull_request.head.ref}`);

    const pullRequestReviews = (await githubClient.getPullRequestReviews(payload.pull_request.url)).data;
    console.log(`rewies: ${pullRequestReviews}`);

    let approvingReviewers = [];
    for (const review of pullRequestReviews) {
      if (review.state === "APPROVED") {
        console.log(`PR has been APPROVED by ${review.user.login}`);
        approvingReviewers.push(review.user.login);
      }
    }

    if (committer == "my-test-bot" && !approvingReviewers.includes("my-test-bot")) {
      await githubClient.approvePR(payload.pull_request);
      return;
    }


    if (approvingReviewers.length > 0 && !approvingReviewers.includes("my-test-bot")) {
      console.log("PR has not been approved by BOT, approving");
      await githubClient.approvePR(payload.pull_request);
    }
  } catch(e) {
    console.log(e);
    throw e;
  }

  //console.log(pullRequestReviews);
  console.log("ending action");
})();




