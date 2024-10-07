import { WebflowClient } from "webflow-api";


export default defineEventHandler( (event) => {
  const authorizeUrl = WebflowClient.authorizeURL({
    scope: ["sites:read", "authorized_user:read"],
    clientId: process.env.WEBFLOW_CLIENT_ID as string
  });

  // Use sendRedirect to perform the redirection
  return sendRedirect(event, authorizeUrl);
});