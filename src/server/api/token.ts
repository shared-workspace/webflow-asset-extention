import axios from "axios";
import jwt from "@/utils/jwt.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = body.idToken;

    // Resolve Session token by making a Request to Webflow API
    const options = {
        method: "POST",
        url: "https://api.webflow.com/beta/token/resolve",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: `Bearer ${process.env.APP_TOKEN}`,
        },
        data: {
            idToken: token,
        },
    };
    const request = await axios.request(options);
    const user = request.data;

    // Generate a Session Token
    const sessionToken = jwt.createSessionToken(user);

    // Respond to user with session token
    return { sessionToken };
});
