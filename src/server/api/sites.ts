import { WebflowClient } from "webflow-api";
import jwt from "@/utils/jwt.js";

export default defineEventHandler(async (event) => {
  try {
    const accessToken = await jwt.authenticateToken(event);

    // Initialize Webflow Client and make request to sites endpoint
    const webflow = new WebflowClient({ accessToken });
    const data = await webflow.sites.list();

    // Send the retrieved data back to the client
    return { data };
  } catch (error) {
    console.error("Error handling authenticated request:", error);
    sendError(event, createError({ statusCode: 500, statusMessage: "Internal server error" }));
  }
});
