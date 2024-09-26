import { NextResponse } from 'next/server';
import { generateRecipe } from "./groq";

export async function POST(req) {
  try {
    const { ingredients } = await req.json();

    const recipe = await generateRecipe(ingredients);

    return NextResponse.json({ recipe });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }
}
