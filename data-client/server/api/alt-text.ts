import OpenAI from "openai";
import { deserialize, unsign } from "~~/utils/cookie";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export default defineEventHandler(async (event) => {
    const headers = getHeaders(event);
    const authorization = headers.authorization;
    if (!authorization) return "unauthorised request";
    const token = authorization?.replace("Bearer ", "");
    if (!token) return "unauthorised request";
    const config = useRuntimeConfig();
    const value = unsign(token, config.cookieSecret);
    const { expires } = deserialize(value) as { expires?: string; };
    if (!expires || parseInt(expires) < Date.now()) return "unauthorised request";
    const src = getQuery(event).src as string;
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "In 10 words or less, tell me what's in this image.",
                        },
                        { type: "image_url", image_url: { url: src, detail: "low" } },
                    ],
                },
            ],
            max_tokens: 25,
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error(`Error processing image at URL ${src}:`, error);
        return null;
    }
});