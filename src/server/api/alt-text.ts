import OpenAI from "openai";
const openai = new OpenAI(
    {apiKey: "sk-proj-AlvVpoYqbnQRb0NFduEAT3BlbkFJBR7Cz9datw34LMWv8o1W"}
);

export default defineEventHandler(async (event) => {
    const url = getQuery(event).url as string;
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
                        { type: "image_url", image_url: { url, detail: "low" } },
                    ],
                },
            ],
            max_tokens: 25,
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error(`Error processing image at URL ${url}:`, error);
        return null;
    }
});