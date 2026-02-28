
# 🎓 Campus Resource Booking System (MERN)

A full-stack MERN application that allows students and faculty to book campus resources such as labs, rooms, and halls.  
Includes admin-level approval workflows, analytics, and cloud-based image management.

---

## 🚀 Features

### 🔐 Authentication & Role Management

- JWT-based login & signup
- Persistent login using localStorage
- Role selection during registration (User / Admin) for demo purposes
- Role-based route protection using backend middleware
- Admin-only routes secured using `protect` and `adminOnly` middleware

> Note: In a production environment, admin roles would be assigned securely and not publicly selectable during registration.

---

### 🏢 Resource Management (Admin)
- Create resources with image upload (Cloudinary)
- Delete resources
- View all resources
- Manage resource availability status

---

### 📅 Booking System (User)
- Book resources with date & time
- Multi-stage booking lifecycle:
  - ⏳ Pending (awaiting admin approval)
  - ✅ Approved
  - ❌ Rejected
  - ✔ Completed
  - ✔ Confirmed
- View booking history (timeline UI)
- Cancel booking request

---

### 🛡 Booking Approval Workflow (Admin)
- Approve or reject booking requests
- Update booking status
- Monitor booking lifecycle

---

### 📊 Analytics Dashboard (Admin)
- Resource usage insights
- Top booked resources
- MongoDB aggregation-based analytics

---

### 🖼 Image Management
- Integrated Cloudinary for secure image uploads
- Images stored as cloud URLs in database
- Optimized image delivery

---

## 🛠 Tech Stack

**Frontend**
- React (Vite)
- React Router
- Context API
- React Slick (Carousel)

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication

**Cloud Services**
- Cloudinary (Image Storage)

**Deployment**
- Frontend: Vercel
- Backend: Render

---

## 🌍 Live Demo

- Frontend: 
- Backend API:

---

## ⚙️ Local Setup

### 1️⃣ Backend

```bash
cd server
npm install
npm run dev


Create .env inside server/:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret























