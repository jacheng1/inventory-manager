const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateRecipe(ingredients) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a professional chef specializing in creating recipes from available ingredients. Your task is to suggest a recipe based on the provided ingredients to the best of your ability, with emphasis towards taste and popularity.",
      },
      {
        role: "user",
        content: `Create a recipe using either some or all of these components: ${ingredients.join(", ")},

                Return only the recipe in the following JSON structure:
                {
                  "title": "[Recipe Name]",
                  "difficulty": "[Difficulty Level]",
                  "prepTime": "[Preparation Time]",
                  "cookTime": "[Cooking Time]",
                  "servings": "[Number of servings]",
                  "ingredients": [
                    "[Ingredient 1]",
                    "[Ingredient 2]",
                    "...",
                    "[Ingredient N]"
                  ],
                  "instructions": [
                    "[Step 1]",
                    "[Step 2]",
                    "...",
                    "[Step N]"
                  ],
                  "notes": "[Any miscellaneous tips, variations, or serving suggestions]"
                }

                Ensure the recipe is creative, uses the given components efficiently, and provides clear instructions. If there are staple items not listed in the ingredients (such as salt, pepper, cooking oil, etc.), assume that they are available and include them in the recipe.`,
      },
    ],
    model: "llama3-8b-8192",
  });

  const suggestion = chatCompletion.choices[0]?.message?.content || "";

  console.log("Raw suggestion:", suggestion);

  try {
    const parsedSuggestion = JSON.parse(suggestion); // Convert the string to JSON

    return parsedSuggestion;
  } catch (error) {
    console.error("Failed to parse the recipe JSON:", error);

    return null;
  }
}
