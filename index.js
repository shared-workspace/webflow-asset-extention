import OpenAI from "openai";
const openai = new OpenAI();

async function generateAltText(imgUrl) {
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

async function generateAltTexts(imgUrls) {
    const altTextPromises = imgUrls.map(url => generateAltText(url));
    const altTexts = await Promise.all(altTextPromises);
    return altTexts;
}

// placeholder images
const imageUrls = [];

Array(50).fill().forEach((_, i) => {
    imageUrls.push(`https://via.placeholder.com/400?text=Image+${i + 1}`);
});

generateAltTexts(imageUrls).then(altTexts => {
    console.log(altTexts);
});