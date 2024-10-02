import OpenAI from "openai";
const openai = new OpenAI();

async function generateAltText(imgUrl: string) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "In 20 words or less, tell me what's in this image.",
                    },
                    { type: "image_url", image_url: { url: imgUrl, detail: "low" } },
                ],
            },
        ],
        max_tokens: 25,
    });

    return completion.choices[0].message;
}

async function generateAltTexts(imgUrls: string[]) {
    const altTextPromises = imgUrls.map(url => generateAltText(url));
    const altTexts = await Promise.all(altTextPromises);
    return altTexts;
}

const imageUrls = [
    "https://www.shutterstock.com/shutterstock/photos/2202122409/display_1500/stock-vector-modern-flat-design-of-webm-file-icon-for-web-2202122409.jpg",
    // Add more image URLs here
];

generateAltTexts(imageUrls).then(altTexts => {
    console.log(altTexts);
});