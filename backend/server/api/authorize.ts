import { WebflowClient } from "webflow-api";

export default defineEventHandler((event) => { // Cannot find name 'defineEventHandler'.
  const authorizeUrl = WebflowClient.authorizeURL({
    scope: ["sites:read", "authorized_user:read"],
    clientId: process.env.CLIENT_ID!,
  });
  sendRedirect(event, authorizeUrl); // Cannot find name 'sendRedirect'.
});
