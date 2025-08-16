# Healthcare Appointment and Records System

## Description
Healthcare Appointment and Records System is a secure web application designed for healthcare institutions to manage patient appointments, medical histories, doctor-patient communications, and follow-up schedules.

## Features
- **Signup**: Register a new user (patient or admin).
- **Login**: Authenticate users to access their profile and records.
- **Logout**: Log users out of the system securely.
- **View/Update Profile**: Patients can view and update their profile information.
- **Create, Delete, Update, View Appointments**: Patients and healthcare staff can manage appointments.
- **Create, Delete, Update, View Medical Records**: Patients can maintain their medical records, including allergies, history, and treatment plans.

## Project Setup

### 1. Prerequisites
Ensure the following are installed on your local machine:
- [Node.js](https://nodejs.org)
- npm (Node Package Manager) - comes bundled with Node.js
- [MongoDB](https://www.mongodb.com/) (for database management)

### 2. Backend Setup
The backend is built using Express.js and MongoDB. Follow these steps to set it up:

1. Navigate to the backend directory:
   cd IFN636_A1/backend

2. Install the backend dependencies:
   npm install

3. Create a .env file in the backend folder and add the following environment variables:
   MONGO_URI=your-mongo-db-connection-string
   JWT_SECRET=your-secret-key
   PORT=5001

   Replace:
   - your-mongo-db-connection-string with your MongoDB connection URI.
   - your-secret-key with a secret key for signing JSON Web Tokens.

4. Run the backend:
   npm run dev

   This will start the server on http://localhost:5001.

### 3. Frontend Setup
The frontend is built using React. To set it up:

Navigate to the frontend directory:
cd IFN636_A1/frontend

Install the frontend dependencies:
npm install

Create a .env file in the frontend folder and add the following:
REACT_APP_API_URL=http://localhost:5001/api

This sets the backend API URL for the frontend to connect to.

Run the frontend:
npm start

This will start the React development server on http://localhost:3000.


### 4. Usage
**Signup**: Go to /register to create a new user account.<br>
**Login**: Go to /login to sign in.<br>
**Appoinment**: Go to /tasks to manage your appointments.<br>
**Medical Record**: Go to /medicalRecords to manage medical history and related data.

## Public URL of Project
Public URL: 3.24.240.84
Name: Instance summary for i-0a3294e4feab0157f (kakiy)
