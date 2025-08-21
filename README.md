# Salary Management System

## Project Structure

```
src/
├── config/         # Database configuration
├── controllers/    # Controllers for handling API requests
├── db/
│   ├── config/     # Sequelize DB connection setup
│   └── migration/  # Database migrations
├── model/          # Sequelize models (User, Employee, Role, Payroll, etc.)
├── middleware/     # Middlewares (auth, validation, etc.)
├── routes/v1/      # API routes (auth, employee, role, etc.)
├── services/       # Business logic
├── utils/          # Helper functions
├── validation/     # Request validation schemas
└── app.js          # middleware
└── server.js       # App entry point
```

## Installation

```bash
git clone https://github.com/your-username/salary-management.git
cd salary-management
npm install
```

## Environment Variables

Create a `.env` file in the project root and add the following:

```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=salary_management
DB_PORT=5432
SALT=10
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1h
```

## Database Setup

```bash
npx sequelize-cli db:migrate
```

## Run Project

```bash
npm run dev
```
