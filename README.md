# 📝 Realtime Collaborative Editor

A modern, responsive collaborative text editor where multiple users can edit the same document in real time.  
Built with **Node.js**, **WebSocket**, and a stylish frontend UI.

---

## 🚀 Features

- **Real-time editing** – see updates from all connected users instantly.
- **Multiple rooms** – collaborate in separate spaces.
- **User presence list** – see who’s currently online.
- **Responsive design** – works well on desktop and tablet.
- **Modern UI** – gradient backgrounds, glassmorphism, and smooth layout.

---

## 📂 Project Structure

repo-root/
│
├── server/ # Backend WebSocket server
│ ├── server.js
│ ├── package.json
│ └── .env # Environment variables (PORT, etc.)
│
├── public/ # Frontend static files
│ ├── index.html
│ ├── styles.css
│ └── script.js
│
└── README.md


## ⚙️ Installation & Setup

1️⃣ **Clone the repository**

git clone https://github.com/your-username/collaborative-editor.git
cd collaborative-editor
2️⃣ Install backend dependencies

cd server
npm install
npm install dotenv
3️⃣ Create .env file in /server

PORT=3000
4️⃣ Run the server

node server.js
5️⃣ Open the frontend

Open public/index.html in your browser
(or use a local server like Live Server in VS Code)

🖌️ Styling
The UI uses:

Glassmorphism for header & sidebar

Gradient backgrounds for a modern look

Rounded panels with shadows for the editor

You can modify styles.css to change theme colors.

📸 Preview

🛠️ Tech Stack
Frontend: HTML, CSS, JavaScript

Backend: Node.js, WebSocket

Others: dotenv for environment variables
