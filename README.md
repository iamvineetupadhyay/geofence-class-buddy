# 📌 AttendMate – Smart Geofencing Attendance & Classroom Management

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://pragyasetu-attendmate.vercel.app/)
[![Built With](https://img.shields.io/badge/Built_with-Firebase-blue?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)](LICENSE)

> 🚀 **AttendMate** is a contact-free, geofencing-based attendance system designed for **Smart India Hackathon 2025 (SIH25011)** under the *Smart Education* theme.  
It automates classroom attendance, prevents proxies, and enhances student engagement with gamification & real-time dashboards.  

---

## 📖 Problem Statement

**SIH 2025 Problem ID:** `SIH25011`  
**Title:** *Smart Curriculum Activity & Attendance App*  
**Team:** PragyaSetu  

Manual attendance wastes precious classroom time, is error-prone, and allows proxy marking.  
👉 AttendMate solves this with **geofencing + time validation**, ensuring fairness, saving time, and boosting engagement.

---

## ✨ Key Features

- 📍 **Geofencing Attendance** – Automatic check-in when students enter classroom radius.  
- ⏱ **Time Validation** – Ensures attendance is only marked during scheduled class hours.  
- 📊 **Dashboards** – Student, Teacher & Admin views with real-time updates.  
- 🎮 **Gamification** – Badges, streaks, and leaderboards to motivate students.  
- 🔔 **Notifications** – Instant alerts for attendance, announcements, and updates.  
- 📶 **Offline Mode** – Attendance works even with poor connectivity (Firestore caching).  
- 🔒 **Security** – Explicit user consent & compliance with IT Act/GDPR.  

---

## 🖼️ Screenshots (Prototype)

| Login & Signup | Student Dashboard | Teacher Dashboard | Admin Dashboard |
|----------------|------------------|------------------|----------------|
| ![Login](./assets/screens/login.png) | ![Student](./assets/screens/student.png) | ![Teacher](./assets/screens/teacher.png) | ![Admin](./assets/screens/admin.png) |

*(Add your own prototype images/screenshots here)*  

---

## ⚙️ Tech Stack

- **Frontend:** React.js / Next.js  
- **Backend & DB:** Firebase (Auth, Firestore, Realtime DB, Cloud Functions)  
- **Services:** GPS Geofencing, Notifications  
- **Hosting:** Vercel + Firebase Hosting  
- **Development:** Agile cycle – Setup → Core Features → Integrations → Testing → Deployment  

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/AttendMate.git
cd AttendMate
