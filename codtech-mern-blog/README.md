# 📝 CODTECH Realtime MERN Blog

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-stack, realtime blog application built for the **COD-Tech IT Internship Program**. It features secure JWT authentication, dynamic routing, and complete CRUD functionality for blog posts, all wrapped in a clean, modern user interface.

---

## 👨‍💻 Intern Information
- **Intern ID:** CITS3982
- **Name:** Sumeet Kailash Chauhan
- **Internship Domain:** React.js Web Development
- **Organisation:** CODTECH IT Solutions Pvt. Ltd.
- **Duration:** 6 Weeks (06 June 2026 – 18 July 2026)

---

## ✨ Features

### 🔐 Authentication & Security
- **Secure Registration & Login:** JWT-based authentication system.
- **Password Hashing:** Passwords are securely hashed using `bcryptjs` before being stored in MongoDB.
- **Protected Routes:** Certain features (like creating or editing posts) are strictly protected and require a valid JWT token.

### 📝 Blog Management (CRUD)
- **Public Feed:** Any visitor can read the global feed of all published blog posts.
- **Create Posts:** Authenticated users can write and publish new articles.
- **Edit & Delete Ownership:** Hover over a post you created to reveal hidden Edit and Delete actions. The backend strictly ensures users can only modify their *own* content.

### 🎨 Modern UI/UX
- **Responsive Design:** Built mobile-first using Tailwind CSS.
- **Dynamic Navbar:** Navigation intelligently adapts based on whether the user is logged in as a guest or an author.
- **Micro-Interactions:** Smooth hover states, transition effects, and glassmorphic UI elements for a premium feel.

---

## 🛠️ Technologies Used

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), React Router v6 |
| **Styling** | Tailwind CSS v4, Lucide React (Icons) |
| **Backend API**| Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication**| JSON Web Tokens (JWT), bcryptjs |
| **HTTP Client** | Axios |

---

## 🚀 Installation Steps

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas cluster (or local MongoDB)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/SumeetChauhan27/CODTECH.git
cd CODTECH/codtech-mern-blog
```

### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.

---

## 📸 Screenshots

- **Homepage (Public Feed):** A clean, modern feed of all blog posts.
![Homepage](screenshots/homepage.png)

- **User Authentication:** Secure and beautiful login/register forms.
![Login Page](screenshots/login.png)

- **Create/Edit Post:** Distraction-free writing environment.
![Write Post](screenshots/create_post.png)

*(Note: Actual screenshots are available in the `screenshots` directory).*

---

## 🗺️ Future Improvements
- 💬 **Comment System:** Allow authenticated users to leave comments on blog posts.
- 🖼️ **Image Uploads:** Integrate Cloudinary or Firebase Storage to support cover images for posts.
- 🔍 **Search & Categories:** Implement full-text search and category tags to organize content better.
- 📄 **Pagination:** Add infinite scroll or standard pagination to the blog feed for better performance.
- 👤 **User Profiles:** Create dedicated profile pages showcasing all posts by a specific author.

---
**Crafted with ❤️ by Sumeet Chauhan for CODTECH IT Solutions.**
