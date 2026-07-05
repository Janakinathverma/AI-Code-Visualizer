import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, code, mermaidSyntax, language } = await request.json();
    if (!title || !code || !mermaidSyntax || !language) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    await connectToDatabase();
    const project = await Project.create({ userId, title, code, mermaidSyntax, language });

    return NextResponse.json({ success: true, project }, { status: 200 });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}
