import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (request: Request) => {
    const body = await request.json();
    const { dish, region = "Indian" } = body;

    const prompt = `
        
Provide a detailed recipe for the Indian regional dish "${dish}" from ${region} cuisine.

Return the response as COMPLETE valid JSON. Do NOT cut off in the middle. Include:
- A short introduction
- List of ingredients with quantity
- Step-by-step instructions

Ensure ingredients are locally available. Instructions should be beginner-friendly.

Wrap the response in JSON format as:
{
  "name": "Dish Name",
  "introduction": "...",
  "ingredients": [ { "item": "...", "quantity": "..." } ],
  "steps": [ "Step 1", "Step 2", ... ],
}

Respond only with valid JSON. Ensure the response is not cut off.
        `;

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
            temperature: 0.5,
        });

        const reply = chatCompletion.choices[0]?.message?.content || "No response generated.";
        const parsed = JSON.parse(reply);

        return new Response(JSON.stringify({ message: "Success", data: parsed }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("OpenAI API error:", error);
        return new Response(JSON.stringify({ message: "Failed" }), {
            headers: { "Content-Type": "application/json" },
        });
    }
}
