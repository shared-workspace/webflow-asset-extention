import OpenAI from "openai";
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export default defineEventHandler(async (event) => {
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