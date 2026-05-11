# 🚀 DCMS Quick Start Guide

## Complete System with Real Database & Actual Functionality

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Install MongoDB (Choose one)

**Option A: Docker (Easiest)**
```bash
cd dcms
docker-compose up -d
```
MongoDB will run on `localhost:27017` with:
- Username: `admin`
- Password: `password`

**Option B: Local MongoDB**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community
# Install and run MongoDB

# Linux
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

**Option C: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account & cluster
3. Get connection string
4. Add to `.env`: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dcms`

---

### Step 2: Start Backend API

```bash
cd dcms
npm install                # First time only
npx nx serve api           # Starts on http://localhost:3000/api
```

### Step 3: Start User Portal

```bash
# In new terminal
cd dcms
npx nx serve dcms          # Starts on http://localhost:4200
```

### Step 4: Start Admin Portal

```bash
# In new terminal
cd dcms
npx nx serve admin-portal  # Starts on http://localhost:4201
```

---

## 📝 Test Real Workflows

### Scenario 1: Create & Join Committee

**1. Create Committee (Admin Portal)**
```
Admin Portal → Committees → "Create Committee"
Fill in:
- Name: "Tech Startup Fund"
- Monthly Amount: 10000
- Total Members: 10
- Type: Lottery
- Start Date: Today
- Click Create
```

**2. Join Committee (User Portal)**
```
User Portal → Dashboard → "Browse Committees"
- See newly created committee
- Click "Join Committee"
- Click Confirm
```

**3. Approve Join Request (Admin Portal)**
```
Admin Portal → Join Requests
- See pending request
- Click "Approve"
- User now appears in committee members
```

---

### Scenario 2: Submit & Approve Payment

**1. User Submits Payment**
```
User Portal → Payments → "Pay Now"
- Select committee
- Upload receipt
- Submit
```

**2. Admin Approves Payment**
```
Admin Portal → Payments
- See pending payment
- Click "Approve"
- Payment status updates to "Approved"
```

**3. View in User Portal**
```
User Portal → Payments
- See payment marked as "Approved"
- Trust score increases
```

---

### Scenario 3: Release Payout (Admin)

**1. View Scheduled Payouts**
```
Admin Portal → Payouts
- See "Scheduled" payouts
```

**2. Release Payout**
```
- Click "Release" button
- Payout status: Scheduled → Released
```

**3. User Receives in Wallet**
```
User Portal → Wallet
- Balance updates automatically
- Transaction appears in history
```

---

## 🔍 Monitor Database

### View Data with Mongo Express
```
Open: http://localhost:8081
Username: admin
Password: password
```

Browse all collections:
- `users`
- `committees`
- `payments`
- `payouts`
- `joinrequests`

---

## 🛠️ API Endpoints Reference

### All Endpoints Available

```
# Committees
POST   /api/committees/create
GET    /api/committees
GET    /api/committees/:id
POST   /api/committees/:id/join
GET    /api/committees/:id/members
POST   /api/committees/:id/pause
POST   /api/committees/:id/close
GET    /api/committees/user/:userId

# Payments
POST   /api/payments/submit
GET    /api/payments/user/:userId
GET    /api/payments/pending
POST   /api/payments/:id/approve
POST   /api/payments/:id/reject
POST   /api/payments/:id/receipt

# Join Requests
POST   /api/join-requests/request
GET    /api/join-requests/pending
POST   /api/join-requests/:id/approve
POST   /api/join-requests/:id/reject

# Payouts
GET    /api/payouts/user/:userId
GET    /api/payouts/scheduled
POST   /api/payouts/:id/release
POST   /api/payouts/:id/hold
POST   /api/payouts/:id/complete
```

---

## ✅ Demo Credentials

**User Portal:**
- Email: admin@dcms.local
- Password: password

**Admin Portal:**
- Email: admin@dcms.local
- Password: password

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Check MongoDB is running: docker ps (for Docker)
2. Or: brew services list (for local)
3. Check .env has correct MONGODB_URI
```

### API Returns 500 Error
```
Check:
1. MongoDB is running
2. Network connection
3. API logs in terminal
4. Collection exists in database
```

### Frontend Can't Connect to API
```
Ensure:
1. API running on http://localhost:3000/api
2. CORS enabled (it is by default)
3. No firewall blocking port 3000
```

---

## 📊 Expected Behavior

After setup, you should be able to:

✅ Create real committees in database  
✅ Join committees (creates database record)  
✅ Admin approves join requests (updates database)  
✅ Submit payments with receipts  
✅ Admin approves/rejects payments  
✅ Release payouts to users  
✅ See all data persist after refresh  
✅ View data in Mongo Express UI  

---

## 🚀 What's Different Now

| Feature | Before | Now |
|---------|--------|-----|
| Data | Mock (in memory) | **Real MongoDB** |
| Join Committee | Instant | **Requires admin approval** |
| Payments | Mock status | **Real approval workflow** |
| Payouts | Mock | **Real release & tracking** |
| Database | None | **Persistent MongoDB** |
| Workflows | Demo | **Fully functional** |

---

## 📞 Next Steps

1. ✅ Start MongoDB with docker-compose
2. ✅ Start API, User Portal, Admin Portal
3. ✅ Test workflows above
4. ✅ Monitor database with Mongo Express
5. ✅ Build & deploy when ready

---

## 🎉 You Now Have

- ✅ Full-stack application
- ✅ Real database (MongoDB)
- ✅ Real API endpoints
- ✅ Real workflows
- ✅ Production-ready code
- ✅ Easy local development setup

**All core functionalities are fully implemented and working with real data!**
