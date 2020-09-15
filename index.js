#!/usr/bin/env node

const core = require("@actions/core");
const { context, GitHub } = require("@actions/github");

async function run() {
    const trigger = core.getInput("trigger", { required: true });

    const { GITHUB_TOKEN } = process.env;

    const body = context.payload.review.body
    core.setOutput('comment_body', body);

    const { owner, repo } = context.repo;

    if (!body.startsWith(trigger)) {
        core.setOutput("triggered", "false");
        return;
    }

    core.setOutput("triggered", "true");

    const client = new GitHub(GITHUB_TOKEN);
    await client.issues.createComment({
        owner,
        repo,
        issue_number: context.payload.pull_request.number,
        body: 'Build has started!'
      });
}

run().catch(err => {
    console.error(err);
    core.setFailed("Unexpected error");
});
