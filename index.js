#!/usr/bin/env node

const core = require("@actions/core");
const { context, GitHub } = require("@actions/github");

async function run() {
    const trigger = core.getInput("trigger", { required: true });

    const reaction = core.getInput("reaction");
    const { GITHUB_TOKEN } = process.env;
    if (reaction && !GITHUB_TOKEN) {
        core.setFailed('If "reaction" is supplied, GITHUB_TOKEN is required');
        return;
    }

    const body = context.payload.review.body
    core.setOutput('comment_body', body);

    const { owner, repo } = context.repo;

    if (!body.startsWith(trigger)) {
        core.setOutput("triggered", "false");
        return;
    }

    core.setOutput("triggered", "true");

    if (!reaction) {
        return;
    }
/*
    const client = new GitHub(GITHUB_TOKEN);
    if (context.eventName === "issue_comment") {
        await client.reactions.createForIssueComment({
            owner,
            repo,
            comment_id: context.payload.review.id,
            content: reaction
        });
    } else {
        await client.reactions.createForIssue({
            owner,
            repo,
            issue_number: context.payload.pull_request.number,
            content: reaction
        });
    }
*/
}

run().catch(err => {
    console.error(err);
    core.setFailed("Unexpected error");
});