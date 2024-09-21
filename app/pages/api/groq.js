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
                
                Please format your response in Material-UI components with the following structure:

                <Box>
                    <Typography variant="h6">[Recipe Name]</Typography>

                    <Box>
                        <Typography variant="h6">Difficulty level: [Difficulty Level]</Typography>
                        <Typography variant="h6">Preparation time: [Preparation Time]</Typography>
                        <Typography variant="h6">Cooking time: [Cooking Time]</Typography>
                        <Typography variant="h6">Number of servings: [Number of servings]</Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6">Ingredients</Typography>
                        <Typography variant="h6">
                            [List each ingredient with quantity]
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6">Instructions</Typography>
                        <Typography variant="h6">
                            [List each step of the cooking process]
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6">Chef's Notes</Typography>
                        <Typography variant="h6">
                            [Any miscellaneous tips, variations, or serving suggestions]
                        </Typography>
                    </Box>
                </Box>

                Ensure the recipe is creative, uses the given components efficiently, and provides clear instructions. If there are staple items not listed in the ingredients (such as salt, pepper, cooking oil, etc.), assume that they are available and include them in the recipe.`,
      },
    ],
    model: "llama3-8b-8192",
  });

  return chatCompletion.choices[0]?.message?.content || "";
}
