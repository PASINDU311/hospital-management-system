# 🏥 Hospital Management System (HMS)

> A comprehensive, modern, and secure Hospital Management System built with **Spring Boot** and **React**. Designed with dedicated modules for Patients, Doctors, and Administrators—featuring appointment booking, clinical consultations, medical records, billing/invoices, and pharmacy management.

---

## 🌟 Key Features

* **👨‍⚕️ Multi-Role Portals:** Custom interfaces and logic for Patients, Doctors, and Administrators.
* **📅 Appointment Management:** Real-time appointment booking, tracking, and status management.
* **📑 Clinical Consultations & Medical Records:** Comprehensive digital medical record tracking and clinical consultations.
* **💳 Billing & Invoices:** Invoice generation and automated billing service management.
* **💊 Pharmacy Module:** Management and tracking for pharmacy operations.
* **🔐 Secure Authentication:** JWT-based secure authentication and role-based access control (RBAC).

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React.js
* **Routing:** React Router DOM
* **HTTP Client:** Axios (`api.js`)
* **Styling:** CSS3, Custom Styling (`App.css`, `index.css`)

### Backend
* **Framework:** Java / Spring Boot (`HmsApplication.java`)
* **Package Structure:** `com.hospital.hms`
* **Security:** Spring Security & JWT (`JwtUtils.java`, `SecurityConfig.java`)
* **ORM & Database:** Spring Data JPA, Hibernate, MySQL/PostgreSQL

---

## 📂 Project Structure

OmniHealth-HMS/
├── 📁 backend/
│   └── 📁 src/
│       ├── 📁 main/
│       │   ├── 📁 java/com/hospital/hms/
│       │   │   ├── 📁 config/
│       │   │   │   ├── 📄 JwtUtils.java
│       │   │   │   └── 📄 SecurityConfig.java
│       │   │   ├── 📁 controller/
│       │   │   │   ├── 📄 AdminController.java
│       │   │   │   ├── 📄 AppointmentController.java
│       │   │   │   ├── 📄 AuthController.java
│       │   │   │   ├── 📄 BillingController.java
│       │   │   │   ├── 📄 DoctorController.java
│       │   │   │   └── 📄 MedicalRecordController.java
│       │   │   ├── 📁 dto/
│       │   │   │   ├── 📄 AppointmentResponse.java
│       │   │   │   ├── 📄 AuthResponse.java
│       │   │   │   ├── 📄 BookAppointmentRequest.java
│       │   │   │   ├── 📄 CreateInvoiceRequest.java
│   │   │   │   ├── 📄 CreateMedicalRecordRequest.java
│   │   │   │   ├── 📄 DashboardStatsResponse.java
│   │   │   │   ├── 📄 InvoiceResponse.java
│   │   │   │   ├── 📄 LoginRequest.java
│   │   │   │   ├── 📄 LoginResponse.java
│   │   │   │   ├── 📄 MedicalRecordResponse.java
│   │   │   │   ├── 📄 PatientRegisterRequest.java
│   │   │   │   └── 📄 RegisterDoctorRequest.java
│   │   │   ├── 📁 model/
│   │   │   │   ├── 📄 Appointment.java
│   │   │   │   ├── 📄 AppointmentStatus.java
│   │   │   │   ├── 📄 Doctor.java
│   │   │   │   ├── 📄 Invoice.java
│   │   │   │   ├── 📄 MedicalRecord.java
│   │   │   │   ├── 📄 Patient.java
│   │   │   │   ├── 📄 PaymentStatus.java
│   │   │   │   ├── 📄 Role.java
│   │   │   │   └── 📄 User.java
│   │   │   ├── 📁 repository/
│   │   │   │   ├── 📄 AppointmentRepository.java
│   │   │   │   ├── 📄 DoctorRepository.java
│   │   │   │   ├── 📄 InvoiceRepository.java
│   │   │   │   ├── 📄 MedicalRecordRepository.java
│   │   │   │   ├── 📄 PatientRepository.java
│   │   │   │   └── 📄 UserRepository.java
│   │   │   ├── 📁 service/
│   │   │   │   ├── 📄 AdminService.java
│   │   │   │   ├── 📄 AppointmentService.java
│   │   │   │   ├── 📄 AuthService.java
│   │   │   │   ├── 📄 BillingService.java
│   │   │   │   └── 📄 MedicalRecordService.java
│   │   │   └── 📄 HmsApplication.java
│   │   └── 📁 resources/
│   │       └── 📄 application.properties
│   └── 📄 pom.xml
│
└── 📁 frontend/
    ├── 📁 node_modules/
    ├── 📁 public/
    └── 📁 src/
        ├── 📁 components/
        │   ├── 📄 AdminDashboard.js
        │   ├── 📄 BookAppointment.js
        │   ├── 📄 ClinicalConsultation.js
        │   ├── 📄 DoctorAppointments.js
        │   ├── 📄 DoctorDashboard.js
        │   ├── 📄 DoctorLayout.js
        │   ├── 📄 Home.jsx
        │   ├── 📄 Login.js
        │   ├── 📄 MainLayout.js
        │   ├── 📄 MedicalRecords.jsx
        │   ├── 📄 Navbar.js
        │   ├── 📄 Pharmacy.jsx
        │   └── 📄 Register.js
        ├── 📁 layouts/
        ├── 📁 pages/
        ├── 📁 services/
        ├── 📄 api.js
        ├── 📄 App.css
        ├── 📄 App.js
        ├── 📄 App.test.js
        ├── 📄 index.css
        ├── 📄 index.js
        ├── 📄 logo.svg
        └── 📄 reportWebVitals.js

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v16.x or higher) & **npm**
* **Java Development Kit (JDK 17)** or higher
* **Maven**
* **MySQL Server**

---

### 1. Backend Setup (Spring Boot)

1. Open terminal and navigate to backend directory:
   cd backend

2. Configure your database settings in `src/main/resources/application.properties`:
   spring.datasource.url=jdbc:mysql://localhost:3306/your_db_name
   spring.datasource.username=your_username
   spring.datasource.password=your_password

3. Run the application:
   mvn spring-boot:run

*Backend server runs on http://localhost:8080*

---

### 2. Frontend Setup (React)

1. Open a new terminal and navigate to frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Start the development server:
   npm start

*Frontend application runs on http://localhost:3000*

---

## 🛡️ Key Controllers & Endpoints Overview

| Controller | Description |
| :--- | :--- |
| **`AuthController`** | User login & patient/doctor registration |
| **`AdminController`** | Dashboard stats, system administration & doctor approvals |
| **`AppointmentController`** | Booking & managing patient appointments |
| **`DoctorController`** | Doctor profiles and schedules |
| **`MedicalRecordController`** | Clinical consultations & medical history records |
| **`BillingController`** | Invoice creation and payment management |

---

## 📄 License

This project is open-source and available under the MIT License.