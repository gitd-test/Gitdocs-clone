import { createNodeMiddleware, Webhooks } from "@octokit/webhooks";

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET || "",
});

webhooks.on("push", async ({ id, payload }) => {
  console.log(`Received a push event for ${payload.repository.name}`);
  // Handle the push event here
});

export default createNodeMiddleware(webhooks);
