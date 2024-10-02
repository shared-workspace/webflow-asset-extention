import jwt from "jsonwebtoken";
import { getHeader, H3Event } from 'h3';

// Placeholder JWT utility functions
export default {
    createSessionToken(user: string) {
        return jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "1h" });
    },

    async authenticateToken(event: H3Event) {
        const authHeader = getHeader(event, "authorization");
        if (!authHeader) {
            throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            return typeof decoded === "string" ? decoded : decoded.accessToken;
        } catch (error) {
            throw createError({ statusCode: 403, statusMessage: "Forbidden" });
        }
    },
};
