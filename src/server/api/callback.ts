import { WebflowClient } from "webflow-api";
import db from "@/utils/database";

export default defineEventHandler(async (event) => {
  const code = getQuery(event).code as string;

  // Get Access Token
  const accessToken = await WebflowClient.getAccessToken({
    clientId: process.env.WEBFLOW_CLIENT_ID!,
    clientSecret: process.env.WEBFLOW_CLIENT_SECRET!,
    code: code,
  });

  // Instantiate the Webflow Client
  const webflow = new WebflowClient({ accessToken });

  // Get Authorization Details
  const user = await webflow.token.authorizedBy();
  (user as any).accessToken = accessToken; // add access token to user object

  // Save User Details to DB
  db.insertAuthorization(user);
});
