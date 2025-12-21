# Campus Resource Booking System (MERN)

A full-stack MERN application that allows students and faculty to book campus resources such as labs, rooms, and halls, with admin-level analytics and management.

## 🚀 Features

### Authentication
- User signup & login using JWT
- Persistent login across refresh
- Role-based access (User / Admin)

### Resource Management (Admin)
- Create and delete campus resources
- View all resources

### Booking System (User)
- Book available resources with date & time
- View own bookings
- Cancel or update bookings

### Analytics (Admin)
- Usage analytics per resource
- Top booked resources using MongoDB aggregation

## 🛠 Tech Stack

- Frontend: React (Vite)
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Authentication: JWT
- Deployment: Vercel (Frontend), Render (Backend)

## 🌍 Live Demo

- Frontend: 
- Backend API: 

## ⚙️ Local Setup

### Backend
```bash
cd server
npm install
npm run dev
```
Create .env inside server/:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret 

Frontend
cd client
npm install
npm run dev

🔐 Admin Access

Admin users are created by manually updating the user role in the database (industry-standard practice).

Built as part of a MERN stack learning project.