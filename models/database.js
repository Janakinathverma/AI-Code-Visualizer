import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk User ID
  title: { type: String, default: "Untitled Flowchart" },
  code: { type: String, required: true },
  mermaidSyntax: { type: String, required: true },
  language: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);