# CODTECH Realtime MERN Blog

A full-stack blog application built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS v4. Developed for CODTECH IT SOLUTIONS.

## Features
- **User Authentication:** Secure JWT-based login and registration using `bcryptjs`.
- **Blog Feed:** A public feed displaying all blog posts elegantly.
- **Post Management:** Logged-in users can securely Create, Edit, and Delete their own posts.
- **Responsive UI:** A modern, clean, and responsive design featuring hover-states, ghost buttons, and glassmorphism hints.

## Tech Stack
- **Frontend:** React (Vite), React Router v6, Tailwind CSS, Axios, Lucide React
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT)

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Configure Environment Variables:
   - Create a `.env` file in the `server` directory.
   - Add your MongoDB connection string and a secret JWT key:
     ```env
     PORT=5000
     MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/codtech-mern-blog?retryWrites=true&w=majority
     JWT_SECRET=your_super_secret_key
     ```
4. Start the backend server: `npm run dev`
   - The server will run on `http://localhost:5000`

### 2. Frontend Setup
1. Open a new terminal and navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. Open your browser and navigate to the URL provided (usually `http://localhost:5173`).

## Usage Guide
- **Visitors:** Can browse and read all blog posts on the homepage without needing an account.
- **Authors:** Must **Sign Up** and **Log In** to access the "Write" button in the navigation bar.
- **Editing & Deleting:** When viewing the homepage while logged in, simply **hover your mouse over your own posts**. Hidden Edit and Delete buttons will smoothly fade into view in the top right corner of the post card.
