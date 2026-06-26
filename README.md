# 🏥 MediCare Connect

### Hospital Appointment & Healthcare Management System

A modern full-stack healthcare platform connecting patients with doctors through a centralized online system. Patients can book appointments, make payments, and manage medical records. Doctors can manage schedules and consultations. Administrators oversee the entire ecosystem.

---

## 🌐 Live Site

🔗 [Live Site Link](#) ← your live URL here

---

## 📁 GitHub Repositories

| Repo | Link |
|------|------|
| Client (Frontend) | [GitHub Client Repo](#) |
| Server (Backend) | [GitHub Server Repo](#) |

---

## ✨ Features

### 👤 Patient
- Register & Login (Email/Password + Google)
- Search & filter doctors by name, specialization, fee, rating
- Book appointments with available time slots
- Pay consultation fees via Stripe
- View appointment history (cancel & reschedule)
- Write, edit & delete reviews
- View payment history

### 🩺 Doctor
- Professional profile management
- Manage available days & time slots
- Accept, reject & complete appointment requests
- Create & update prescriptions
- Dashboard with patient statistics

### 🛡️ Admin
- Verify & reject doctor registrations
- Manage all users (suspend/delete)
- Monitor all appointments
- View payment records
- Analytics dashboard with Recharts

---

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
|------------|-------|
| Next.js 15 (App Router) | Framework |
| Tailwind CSS | Styling |
| HeroUI v3 | UI Components |
| Framer Motion | Animations |
| Recharts | Analytics charts |
| Stripe.js | Payment UI |
| next-themes | Dark/Light toggle |

### Backend
| Technology | Usage |
|------------|-------|
| Node.js + Express.js | Server |
| MongoDB Atlas | Database |
| JWT (via Better Auth) | Authentication |
| Stripe | Payment processing |
| cookie-parser | Cookie handling |

### Authentication
| Technology | Usage |
|------------|-------|
| Better Auth | Auth system |
| JWT Tokens | Session management |
| Role-based access | Patient / Doctor / Admin |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Stripe account

### Clone the repositories

```bash
# Client
git clone <client-repo-url>
cd medicare-client
npm install

# Server
git clone <server-repo-url>
cd medicare-server
npm install
```

### Client `.env.local`

```env
NEXT_PUBLIC_AUTH_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URL=your-mongodb-url
DATABASE_NAME=medicare_connect
```

### Server `.env`

```env
MONGODB_URL=your-mongodb-url
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### Run locally

```bash
# Server
cd medicare-server
nodemon index.js

# Client
cd medicare-client
npm run dev
```

---

## 🔐 JWT Token Verification (Challenge 3)

### How it works

```
1. User logs in via Better Auth
2. Better Auth creates a session & stores JWT in an HTTP-only cookie
3. Client sends requests with credentials: "include"
4. Server middleware reads the cookie and calls Better Auth's session endpoint
5. If session is valid → request proceeds
6. If invalid → 401 Unauthorized returned
```

### Middleware Implementation

**`middleware/verifyToken.js`**

```js
const verifyToken = async (req, res, next) => {
  try {
    const response = await fetch(
      `${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
      {
        headers: { cookie: req.headers.cookie || "" },
      }
    );
    const session = await response.json();
    if (!session?.user) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    req.user = session.user;
    next();
  } catch (err) {
    res.status(401).send({ message: "Unauthorized" });
  }
};
```

**`middleware/verifyRole.js`**

```js
const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user?.role)) {
      return res.status(403).send({ message: "Forbidden" });
    }
    next();
  };
};
```

### Protected Routes

| Route | Protection |
|-------|------------|
| `POST /api/appointments` | `verifyToken` — logged in users only |
| `GET /api/appointments/patient/:id` | `verifyToken` — patients only |
| `PATCH /api/appointments/:id/status` | `verifyToken` — doctors only |
| `GET /api/admin/users` | `verifyToken` + `verifyRole("admin")` |
| `DELETE /api/admin/users/:id` | `verifyToken` + `verifyRole("admin")` |
| `PATCH /api/admin/doctors/:id/verify` | `verifyToken` + `verifyRole("admin")` |
| `GET /api/payments/patient/:id` | `verifyToken` |
| `POST /api/payments/create-intent` | `verifyToken` |

### Role-Based Authorization

```
Patient  → can book appointments, make payments, write reviews
Doctor   → can manage schedule, accept/reject appointments
Admin    → can verify doctors, manage users, view all data
```

---

## 💳 Payment Flow (Stripe)

```
1. Patient books appointment
2. Redirected to /payment/[appointmentId]
3. Stripe PaymentIntent created on server
4. Patient enters card details (test: 4242 4242 4242 4242)
5. Payment confirmed → appointmentStatus: "confirmed", paymentStatus: "paid"
6. Transaction ID saved to database
```

---

## 📊 Database Collections

| Collection | Purpose |
|------------|---------|
| `user` | All users (patient, doctor, admin) |
| `doctor` | Doctor profiles & availability |
| `appointments` | Appointment bookings |
| `reviews` | Patient reviews |
| `payments` | Payment records (via appointments) |

---

## 📱 Pages

### Public Pages
- `/` — Home (Featured Doctors, Stats, Specializations, Testimonials)
- `/find-doctors` — Search & filter doctors
- `/find-doctors/[id]` — Doctor details + Booking form
- `/about` — About Us
- `/contact` — Contact Us
- `/login` — Login
- `/register` — Register

### Private Pages
- `/dashboard/patient/overview` — Patient dashboard
- `/dashboard/patient/appointment` — My Appointments
- `/dashboard/patient/payment-history` — Payment History
- `/dashboard/patient/reviews` — My Reviews
- `/dashboard/doctor/overview` — Doctor dashboard
- `/dashboard/doctor/appointments` — Appointment Requests
- `/dashboard/doctor/profile` — Profile Management
- `/dashboard/admin/overview` — Admin Analytics
- `/dashboard/admin/users` — Manage Users
- `/dashboard/admin/doctors` — Manage Doctors
- `/dashboard/admin/appointments` — All Appointments
- `/payment/[appointmentId]` — Stripe Payment

---

## 🎨 Optional Features Implemented

- ✅ **Dark/Light Theme Toggle** — via `next-themes`
- ✅ **Layout Change** — Grid/List toggle on Find Doctors page

---

## 🚢 Deployment

- Client deployed on **Vercel**
- Server deployed on **Render** / **Railway**
- MongoDB hosted on **MongoDB Atlas**

### Production Environment Variables
Make sure to set all `.env` variables in your deployment platform.

---

## 👩‍💻 Developer

**Jannat** — Web Technologies Course, Assignment 10

Student ID: `0562320005101030`
