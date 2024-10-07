import { WebflowClient } from "webflow-api";

export default defineEventHandler(async (event) => {
  const code = getQuery(event).code as string
  // Get Access Token
  const accessToken = await WebflowClient.getAccessToken({
    clientId: process.env.WEBFLOW_CLIENT_ID as string,
    clientSecret: process.env.WEBFLOW_CLIENT_SECRET as string,
    code: code,
  });

  // Instantiate the Webflow Client
  const webflow = new WebflowClient({ accessToken });

  webflow.sites.list().then(sites => sites.sites?.forEach(site => useStorage("webflow").setItem(site.id, accessToken)));

  return sendRedirect(event, '/auth-complete');
})