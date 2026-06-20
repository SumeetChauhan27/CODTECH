# 💬 ChatFlow - Real-Time Chat Application

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white)

A highly interactive, premium real-time chat application built for the **COD-Tech IT Internship Program** (Task 3). It features instant messaging, secure private rooms with an invite code system, granular read receipts, and real-time emoji reactions, all wrapped in a sleek, glassmorphic UI.

---

## 👨‍💻 Intern Information
- **Intern ID:** CITS3982
- **Name:** Sumeet Kailash Chauhan
- **Internship Domain:** React.js Web Development
- **Organisation:** CODTECH IT Solutions Pvt. Ltd.
- **Duration:** 6 Weeks (06 June 2026 – 18 July 2026)

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Google & Email Login:** Secure authentication using Firebase Auth.
- **Protected Routes:** Unauthorized users are redirected to the login page.

### 🏠 Real-Time Rooms & Communities
- **Global & Private Rooms:** Create public spaces or secure private rooms.
- **Invite Code System:** Private rooms generate a 10-digit alphanumeric code. Users must enter this code to join.
- **Creator Controls:** The room creator can delete the room for everyone.

### 💬 Messaging Experience
- **Real-Time Sync:** Instant message delivery using Firebase Firestore `onSnapshot`.
- **WhatsApp-Style Read Receipts:** A single gray tick for sent, double gray tick for delivered, and **double blue tick** when everyone in the room has read the message.
- **Message Info Modal:** Right-click a message to see exactly *who* read it and at what *time*.
- **Emoji Reactions:** Quick-react to any message with emojis.
- **Context Menus:** Right-click messages to Copy, Star, Pin (creator only), or Delete (your own messages).

### 🎨 Premium Glassmorphic UI
- **Modern Aesthetics:** Tailored styling using Tailwind CSS v4.
- **Micro-Animations:** Smooth page transitions, hovering effects, and bouncy badges using Framer Motion.
- **Responsive Layout:** Works seamlessly across desktops and tablets.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19, Vite |
| **Styling** | Tailwind CSS v4, Lucide React (Icons) |
| **Animations**| Framer Motion |
| **Backend & DB**| Firebase Auth, Firebase Firestore |
| **Routing** | React Router v7 |
| **State Management** | React Context API (`AuthContext`) |

---

## 📂 Folder Structure

```text
codtech-realtime-chat-app/
├── public/              # Static assets
├── screenshots/         # App screenshots
├── src/
│   ├── assets/          # Internal images and SVG icons
│   ├── components/
│   │   ├── chat/
│   │   │   ├── MessageInput.jsx  # Chat input with emoji picker
│   │   │   └── MessageList.jsx   # Renders messages, context menus, read receipts
│   │   └── layout/
│   │       ├── Navbar.jsx        # Top navigation and user profile
│   │       └── Sidebar.jsx       # Room navigation and creation
│   ├── context/
│   │   └── AuthContext.jsx       # Global Firebase authentication state
│   ├── pages/
│   │   ├── ChatPage.jsx          # Main application layout and state
│   │   └── LoginPage.jsx         # Authentication entry point
│   ├── routes/
│   │   └── ProtectedRoute.jsx    # Route guard for authenticated users
│   ├── services/
│   │   └── firebase.js           # Firebase app initialization and exports
│   ├── App.jsx                   # Router configuration
│   ├── index.css                 # Global Tailwind directives
│   └── main.jsx                  # Application entry point
├── .env.example         # Template for Firebase configuration
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies and scripts
├── README.md            # Project documentation
└── vite.config.js       # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SumeetChauhan27/CODTECH.git
   cd CODTECH/codtech-realtime-chat-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy the `.env.example` file to a new file named `.env` and fill in your Firebase project credentials.
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:5173`

---

## 📸 Screenshots

<div align="center">
  <img src="screenshots/loginPAGE.png" alt="ChatFlow Login Interface" width="600" />
  <br />
  <br />
  <img src="screenshots/image.png" alt="ChatFlow Main Interface" width="600" />
  <br />
  <br />
  <img src="screenshots/image2.png" alt="ChatFlow Features" width="600" />
</div>

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

---
**Crafted with ❤️ by Sumeet Chauhan for CODTECH IT Solutions.**
