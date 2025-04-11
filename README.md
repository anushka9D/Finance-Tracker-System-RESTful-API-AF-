# Finance-Tracker-System-RESTful-API-AF-
Building a Secure RESTful API for a Personal Finance Tracker System


# 💰 Personal Finance Tracker API

A secure, RESTful API built with **Express.js** for managing personal finances. This system supports multiple user roles, transaction tracking, budget management, reporting, and much more.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4DB33D?style=flat&logo=mongodb&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)

---

## 🚀 Features

### 👥 User Roles & Authentication
- **Admin**: Manage users, oversee transactions, and configure system settings.
- **Regular User**: Add/edit/delete transactions, set budgets, and generate reports.
- **Authentication**: Secure JWT-based authentication and session management.

### 💳 Transaction Management
- Full **CRUD operations** on transactions.
- Categorization, **custom tags**, and **recurring transactions**.

### 📊 Budget Management
- Monthly and category-based budgeting.
- Smart **budget adjustment recommendations**.
- Alerts when nearing or exceeding budgets.

### 📈 Financial Reports
- Analyze **spending trends** and **income vs. expenses**.
- Filter reports by time, category, or tags.

### 🔔 Notifications & Alerts
- Alerts for unusual spending.
- Bill payment and financial goal reminders.

### 🎯 Goals & Savings Tracking
- Set and track financial goals.
- Automatically allocate income to savings.

### 💱 Multi-Currency Support
- Multi **currency exchange** handling.

### 📊 Role-Based Dashboards
- **Admin**: View system-wide activity and user summaries.
- **User**: Personalized transaction, budget, and goal overview.

---

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Testing**: Jest

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/anushka9D/Finance-Tracker-System-RESTful-API-AF-.git
cd Finance-Tracker-System-RESTful-API-AF-

# Install dependencies
npm install

# Set up environment variables
 PORT=Include a suitable port number
 CONNECTION_STRING=Include a mongoDB URI
 JWT_SECRET=Include a JWT secret key
 EMAIL=Include an email to send notifications
 EMAIL_PASSWORD = Include a passkey of the email
# Fill in the required keys in .env

# Run the app
npm run dev
```

##

### run unit test code 
```bash
`npx jest tests/unit/userController.test.js`  \
`npx jest tests/unit/transactionController.test.js`  \
`npx jest tests/unit/budgetController.test.js` 
```
##

### run integration test code
```bash
`npx jest tests/integration/userRoutes.test.js`
```
##

# Project Documentation

## 1. Authentication Routes

- **Register User**  
  `POST` `http://localhost:8090/api/auth/register`
  
- **Login User**  
  `POST` `http://localhost:8090/api/auth/login`
  
- **Get All Users**  
  `GET` `http://localhost:8090/api/auth/getusers`
  
- **Update User**  
  `PUT` `http://localhost:8090/api/auth/updateuser`
  
- **Delete User**  
  `DELETE` `http://localhost:8090/api/auth/userdelete`
  
- **Delete User by Admin**  
  `DELETE` `http://localhost:8090/api/auth/deleteuserbyadmin/:id`

---

## 2. User Routes

- **Admin Endpoint**  
  `GET` `http://localhost:8090/api/users/admin`
  
- **User Endpoint**  
  `GET` `http://localhost:8090/api/users/user`

---

## 3. Transactions Routes

- **Create Transaction**  
  `POST` `http://localhost:8090/api/transactions/createtransaction`
  
- **Get All Transactions**  
  `GET` `http://localhost:8090/api/transactions/getalltransactions`
  
- **Get Transaction by ID**  
  `GET` `http://localhost:8090/api/transactions/gettransaction/:id`
  
- **Update Transaction**  
  `PUT` `http://localhost:8090/api/transactions/updatetransaction/:id`
  
- **Delete Transaction**  
  `DELETE` `http://localhost:8090/api/transactions/deletetransaction/:id`
  
- **Get Transactions by Tag**  
  `GET` `http://localhost:8090/api/transactions/gettransactionsbytag/:tag`

---

## 4. Budgets Routes

- **Create Budget**  
  `POST` `http://localhost:8090/api/budgets/createbudget`
  
- **Get Budgets**  
  `GET` `http://localhost:8090/api/budgets/getbudgets`
  
- **Get Budget Status**  
  `GET` `http://localhost:8090/api/budgets/budget/status`
  
- **Get Budget Recommendations**  
  `GET` `http://localhost:8090/api/budgets/budget/recommendations`
  
- **Notify Budget Exceeded**  
  `GET` `http://localhost:8090/api/budgets/budget/notify/exceeded`

---

## 5. Goals Routes

- **Create Goal**  
  `POST` `http://localhost:8090/api/goals/creategoal`
  
- **Get Goals**  
  `GET` `http://localhost:8090/api/goals/getgoals`
  
- **Update Goal Progress**  
  `PUT` `http://localhost:8090/api/goals/updateprogress/:id`

---

## 6. Reports Routes

- **Get Reports**  
  `GET` `http://localhost:8090/api/reports/getreports`
  
- **Get Report by ID**  
  `GET` `http://localhost:8090/api/reports/getreportbyid`

---

## 7. Dashboard Routes

- **Get User Dashboard**  
  `GET` `http://localhost:8090/api/dashboard/getuserdashboard`
  
- **Get Admin Dashboard**  
  `GET` `http://localhost:8090/api/dashboard/getadmindashboard`

---

## 8. Notifications Routes

- **Get Notifications**  
  `GET` `http://localhost:8090/api/notifications/getnotifications`
  
- **Mark Notification as Read**  
  `PUT` `http://localhost:8090/api/notifications/markasread/:id`

---

