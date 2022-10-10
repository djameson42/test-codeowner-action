const fs = require("fs").promises;
const github = require("@actions/github");
const githubClient = require("./github.js");


const changeTimestamp = async () => {
  const data = await fs.readFile("test-file.txt", "utf8");
  const result = data.replace(/option \(xero\.schema_file_last_modified\) = \d+;/, `option (xero.schema_file_last_modified) = ${Math.floor(Date.now() / 1000)};`);
  await fs.writeFile("test-file.txt", result, "utf8");
};

const payload = github.context.payload;

(async () => {
  console.log("starting action");
  try {
    const pullRequestReviews = (await githubClient.getPullRequestReviews(payload.pull_request.url)).data;
    console.log(`rewies: ${pullRequestReviews}`);

    let approvingReviewers = [];
    for (const review of pullRequestReviews) {
      if (review.state === "APPROVED") {
        console.log(`PR has been APPROVED by ${review.user.login}`);
        approvingReviewers.push(review.user.login);
      }
    }

    if (approvingReviewers.length > 0 && !approvingReviewers.includes("my-test-bot")) {
      changeTimestamp();
    }
  } catch(e) {
    console.log(e);
    throw e;
  }
  //console.log(pullRequestReviews);
  console.log("ending action");
})();
