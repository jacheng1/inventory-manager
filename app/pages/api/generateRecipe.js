import { generateRecipe } from "./groq";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { ingredients } = req.body;

    try {
      const recipe = await generateRecipe(ingredients);

      res.status(200).json({ recipe });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate recipe" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
