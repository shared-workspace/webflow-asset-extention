import { WebflowClient } from "webflow-api";

export default defineEventHandler((event) => {
  const authorizeUrl = WebflowClient.authorizeURL({
    scope: ["sites:read", "authorized_user:read"],
    clientId: process.env.WEBFLOW_CLIENT_ID!,
  });
  sendRedirect(event, authorizeUrl);
});
