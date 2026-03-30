# ⛳ Golf Charity Subscription Platform

A production-grade full-stack platform that combines **golf performance tracking, subscription-based gameplay, and charitable giving** into a single ecosystem.

This project translates a complex real-world product specification into a scalable, user-centric web application.

---

## 📖 Product Vision

The platform reimagines golf as an **impact-driven experience** — where performance, rewards, and philanthropy coexist.

Users can:
- Track their **Stableford golf scores**
- Participate in **monthly draw-based prize pools**
- Contribute to **charities through subscriptions**

---

## 🎯 Core Objectives (PRD Alignment)

- ✅ Subscription Engine (Stripe-powered)
- ✅ Score Management System (Rolling 5-score logic)
- ✅ Custom Draw Engine (Monthly execution)
- ✅ Charity Contribution System
- ✅ Admin Governance & RBAC
- ✅ Emotion-driven modern UI/UX (non-traditional golf design)

---

## 🏗 System Architecture

### 🔹 Frontend & Core Platform
- **Stack:** MERN + Supabase
- **Responsibilities:**
  - UI/UX (mobile-first)
  - Score entry & dashboard
  - Charity selection & tracking
  - Supabase Auth (JWT/session-based)
  - PostgreSQL database

---

### 🔹 Stripe Payment Microservice
- **Stack:** Node.js + Express
- **Responsibilities:**
  - Subscription lifecycle (monthly/yearly)
  - Secure payments (Stripe)
  - Webhook handling
  - Sync subscription state with Supabase

---

## 🔐 Role-Based Access Control (RBAC)

### Public Visitor
- Explore platform concept
- View charities
- Understand draw system
- Initiate subscription

### Registered Subscriber
- Manage profile
- Enter & edit scores
- Select charity contribution
- Track participation & winnings
- Upload proof for verification

### Administrator
- Manage users & subscriptions
- Configure & run draws
- Manage charities
- Verify winners & payouts
- Access analytics dashboard

---

## 💳 Subscription System

- Plans:
  - Monthly
  - Yearly (discounted)

- Features:
  - Real-time subscription validation
  - Renewal & cancellation handling
  - Restricted access for inactive users

---

## ⛳ Score Management System

- Users must maintain **exactly 5 scores**
- Score range: **1–45 (Stableford)**
- Each score includes a **date**
- Logic:
  - Only latest 5 scores retained
  - New score → replaces oldest
  - Displayed in reverse chronological order

---

## 🎰 Draw & Reward System

### Match Types
- 5-Number Match (Jackpot)
- 4-Number Match
- 3-Number Match

### Draw Logic
- Random generation OR
- Algorithm-based (score frequency weighting)

### Features
- Monthly draw execution
- Admin-controlled publishing
- Simulation mode before publishing
- Jackpot rollover if no winner

---

## 💰 Prize Pool Distribution

| Match Type       | Share | Rollover |
|----------------|------|---------|
| 5 Match        | 40%  | Yes     |
| 4 Match        | 35%  | No      |
| 3 Match        | 25%  | No      |

- Auto-calculated based on active subscribers
- Split equally among winners

---

## ❤️ Charity System

- Default contribution: **≥10% of subscription**
- Users can increase percentage
- Features:
  - Charity directory (search & filter)
  - Individual charity profiles
  - Featured charity spotlight
  - Independent donation option

---

## 🧾 Winner Verification System

- Proof upload (score screenshots)
- Admin review workflow:
  - Pending → Approved/Rejected
- Payment tracking:
  - Pending → Paid

---

## 📊 User Dashboard

- Subscription status (active/inactive)
- Score management UI
- Charity selection & percentage
- Draw participation summary
- Winnings overview

---

## 🛠 Admin Dashboard

### User Management
- View/edit users
- Manage subscriptions
- Edit scores

### Draw Management
- Configure logic
- Run simulations
- Publish results

### Charity Management
- Add/edit/delete charities
- Manage media/content

### Winners Management
- Verify proofs
- Track payouts

### Analytics
- Total users
- Prize pool stats
- Charity contributions
- Draw insights

---

## 📊 Database Design (Supabase PostgreSQL)

### Tables

- **users**
  - subscription_status, role, charity_percentage

- **scores**
  - user_id, score, date (rolling 5)

- **draws**
  - winning_numbers, status, jackpot_rolled

- **charity_contributions**
  - user_id, charity_id, amount, type

- **winners**
  - match_type, proof_url, payment_status

---

## ⚙️ Environment Variables

### Frontend (.env)

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_public_anon_key
STRIPE_PAYMENT_API_URL=https://stripe-payment-service-u949.onrender.com
```
Stripe Service (.env)
```env
STRIPE_SECRET_KEY=sk_test_...
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=http://localhost:5173
```
Clone Repositories
```bash
git clone https://github.com/sudip57/golf-charity-platform.git
git clone https://github.com/sudip57/stripe-payment-service.git
```
Install Dependencies
# Run in BOTH folders
```bash
npm install
```
Run Development Servers
# Run in BOTH folders
```bash
npm run dev
```
