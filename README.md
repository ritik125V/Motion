📝 Mini Notes App (Full Stack)

🚀 Overview

This is a full-stack Notes application built as part of an internship assignment.
The app allows users to create, read, update, delete, and search notes with a smooth and responsive UI.

In addition to the required features, I implemented authentication, guest sessions, and Redis caching to improve performance and usability.

---

🌐 Live Demo

🔗 https://motion-topaz-two.vercel.app/

---

📦 Tech Stack

- Frontend: Next.js , framer , tailwindcss
- Backend: Node.js, Express
- Database: MongoDB
- Caching: Redis

---

✨ Features

📌 Core Features (Assignment Requirements)

- Create notes (title + description)
- View all notes with created date
- Update existing notes
- Delete notes
- Search notes by title
- Loading states for all async actions

---

-> Additional Features

🔐 Authentication System

- Secure user login/signup
- Protected routes for authenticated users

👤 Guest Login

- Temporary guest session without signup
- Data stored in DB
- Automatically expires after 1 hour

⚡ Redis Caching

- Implemented Redis for caching API responses
- Reduced API response time significantly
- Improves scalability and performance

---

🧠 Architecture Highlights

- RESTful API design
- Separate backend and frontend
- Efficient state management
- Optimized database queries
- Caching layer with Redis

---

📁 Folder Structure

/frontend     → Frontend (React / Next.js)
/backend     → Backend (Node + Express)


---

⚙️ Setup Instructions

1. Clone Repository

git clone https://github.com/ritik125V/Motion.git
cd Motion

2. Install Dependencies

npm install

3. Setup Environment Variables

Create a ".env" file:

MONGO_URI=your_mongodb_uri
REDIS_URL=your_redis_url
JWT_SECRET=your_secret

4. Run App

npm run dev

---

📊 Performance Improvements

- Redis caching reduces redundant DB calls
- Faster API response time
- Better user experience under load

---

📌 Assignment Reference

This project fulfills all requirements from the internship assignment:

---

🙌 Author

Ritik Verma
