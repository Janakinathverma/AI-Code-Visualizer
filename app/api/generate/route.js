import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Code and language required" }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional software architect. Convert the provided code into valid Mermaid.js flowchart syntax. Start with 'graph TD'. Provide ONLY the raw syntax without any markdown formatting or explanations."
        },
        {
          role: "user",
          content: `Convert this ${language} code:\n\n${code}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, // High precision for syntax
    });

    const mermaidSyntax = chatCompletion.choices[0]?.message?.content || "";
    
    // Safety clean
    const cleaned = mermaidSyntax
      .replace(/^```mermaid\n?/i, "")
      .replace(/^```\n?/i, "")
      .replace(/```$/i, "")
      .trim();

    return NextResponse.json({ mermaidSyntax: cleaned });

  } catch (error) {
    console.error("Groq API Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Groq failed to process" },
      { status: 500 }
    );
  }
}