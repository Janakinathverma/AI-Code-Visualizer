# AI Code Visualizer 🚀

An enterprise-grade, full-stack AI-driven orchestration tool engineered to perform static code analysis and dynamically generate structural architectural diagrams. Powered by Next.js and Groq Cloud, the system abstracts complex multi-language algorithmic logic into human-readable, interactive Mermaid.js flowcharts.

## 🏗️ System Architecture & Core Stack
The application is architected with a strict separation of concerns utilizing the **Next.js App Router** paradigm to eliminate server-side blocking and ensure fluid rendering:

* **Frontend Tier:** Built with **Next.js 14/15 (React)** and **Tailwind CSS** for a modular, high-fidelity UI layout. Integrates advanced developer-facing client wrappers.
* **AI Inference Engine:** Leverages **Groq Cloud API** running the state-of-the-art **Llama 3.3 (70B Versatile)** model for ultra-low latency contextual processing.
* **Database & Security Layer:** Integrated with **MongoDB Atlas** via a persistent Mongoose connection framework, secured end-to-end with **Clerk Authentication**.

---

## 🛠️ Engineering Challenges & Deep Optimizations

### 1. Client-Side Hydration & Bundler Stability (Monaco Editor & Turbopack)
* **Challenge:** Integrating a professional-grade syntax editor (Monaco/CodeMirror) within a Server-Side Rendered (SSR) environment like Next.js triggered immediate `window is not defined` runtime errors. Furthermore, compiling these massive bundles under **Turbopack** led to environment hydration failures.
* **Solution:** Abstracted the entire editor module using **Dynamic Imports (`next/dynamic`)** with `ssr: false` configuration, ensuring complete isolation from the server pre-rendering phase and stabilizing development server builds.

### 2. Multi-Model Failover & API Quota Management
* **Challenge:** Initial testing using standard OpenAI and Gemini models frequently encountered restrictive rate limits (HTTP 429 Too Many Requests) and API authentication anomalies (HTTP 401 Unauthorized), stalling real-time execution.
* **Solution:** Refactored the core route backend into a model-agnostic controller and integrated **Groq Cloud**. This transition achieved near-instantaneous (sub-second) model inference speeds at zero operational costs.

### 3. LLM Syntax Contamination & Deterministic Cleansing
* **Challenge:** Large Language Models (LLMs) inherently append conversational metadata, prose, or markdown wrappers (e.g., ` ```mermaid `) to outputs, which instantly crashes the frontend Mermaid.js rendering engine.
* **Solution:** Implemented a robust server-side structural abstraction layer utilizing optimized regular expressions (`regex`) to systematically strip away all markdown fences and deliver 100% deterministic, raw syntax to the visualization pipeline.

---

## ⚙️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Janakinathverma/AI-Code-Visualizer.git
   cd AI-Code-Visualizer

   Configure Environment Variables:
Create a .env.local file in the root directory:

Code snippet
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=your_mongodb_atlas_uri_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
Install Dependencies & Launch:

Bash
npm install
npm run dev
