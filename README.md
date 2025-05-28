# 🚀 CodeHire

CodeHire is a developer-focused platform that helps candidates evaluate the **efficiency of their code** — tailored specifically to the expectations of top tech companies during technical interviews.

Whether you're applying to FAANG, startups, or service-based companies, CodeHire gives you a performance breakdown and scoring of your code to boost your chances of getting hired.

---

## 🔍 Features

- ✅ Paste & evaluate your code directly in the browser
- 📊 Get an **efficiency percentage score** (based on time/space complexity, structure, and best practices)
- 🧠 Tailored scoring based on **specific company standards** (Google, Amazon, Infosys, etc.)
- 🧾 Language efficiency comparisons (C++, Java, Python, JS, etc.)
- 🔐 Secure code execution with proper isolation
- 🌐 Clean, minimal UI for fast and distraction-free evaluation

---

## 🛠️ Tech Stack

| Layer         | Technology                        |
|--------------|------------------------------------|
| **Frontend**  | React.js + Tailwind CSS             |
| **Backend**   | Node.js / Express  |
| **AI Logic**  | OpenAI GPT + Custom Code Analyzers + Groq AI |
| **Database**  | MongoDB / Firebase (PostgreSQL)                |
| **Auth**      | Supabase / Google OAuth            |
| **Hosting**   | Vercel                             |

---

## 💡 How It Works

1. User pastes code in the editor
2. CodeHire analyzes:
   - Time and Space Complexity
   - Loop nesting, recursion, call depth
   - Memory usage
   - Best practices & language-specific efficiency
3. Returns an **efficiency score** based on:
   - Cleanliness
   - Optimization
   - Target company’s coding benchmarks

---


🌐 Live Deployment
Hosted on: https://v0-code-evaluation-platform.vercel.app/

🤝 Contributing
Contributions, suggestions, and feedback are welcome!
If you'd like to add new company scoring logic or features, open a PR or create an issue.

📜 License
This project is licensed under the MIT License.

🙌 Acknowledgements
    1. GroqAI

    2. Vercel

    3. Supabase

    4. GitHub

    5. Neon

## 🚀 Getting Started Locally

```bash
git clone https://github.com/aish-2306/codehire.git
cd codehire
npm install
cp .env.example .env.local  # Add your own environment keys here
npm run dev
