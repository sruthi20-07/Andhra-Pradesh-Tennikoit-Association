# Andhra-Pradesh-Tennikoit-Association
# APTAMP – Andhra Pradesh Tennikoit Association Management Portal

## Overview

APTAMP (Andhra Pradesh Tennikoit Association Management Portal) is a full-stack web application developed to digitize and streamline the management of Tennikoit activities across Andhra Pradesh.

The platform provides a centralized system for player registration, tournament management, rankings, gallery management, feedback collection, contact handling, and administrative operations through secure role-based access control.

---

## Features

### Public Portal

* Home Page
* About Association
* Committee Members
* Sports Calendar
* Tournament Information
* State & District Rankings
* Gallery (Photos & Videos)
* Downloads
* Notifications & Announcements
* Contact Us
* FAQ

### Player Module

* Player Registration
* Secure Login & Authentication
* Profile Management
* Photo Upload
* Tournament Registration
* Match History
* Rankings
* Certificates
* Player Dashboard

### Tournament Management

* Create Tournaments
* Manage Tournament Categories
* Registration Approval
* Match Scheduling
* Tournament Results
* Tournament Documents

### Gallery Management

* Upload Photos
* Upload Videos
* Category-wise Gallery
* Public Gallery Display
* Admin Gallery Management

### Contact & Feedback Module

* Public Contact Form
* Feedback Submission
* Admin Review Dashboard
* Query Status Tracking
* Reply Management

### Administrative Features

* Player Approval/Rejection
* Tournament Management
* Rankings Management
* Gallery Management
* Contact Query Management
* Feedback Management
* Dashboard Analytics
* Reports & Statistics

---

## User Roles

### Admin

* Full system access
* Manage players
* Manage tournaments
* Manage gallery
* Manage feedback
* Manage contacts

### Player

* Register account
* Update profile
* Register for tournaments
* View rankings
* Access certificates

### Public User

* Browse portal
* View tournaments
* View gallery
* Submit feedback
* Submit contact queries

---

## Technology Stack

### Frontend

* React.js
* Vite
* Material UI (MUI)
* React Router
* Axios
* React Query

### Backend

* Java 21
* Spring Boot 3
* Spring Security
* JWT Authentication
* Spring Data JPA
* Maven

### Database

* PostgreSQL

### Other Tools

* Flyway Migration
* Lombok
* REST APIs
* Git & GitHub

---

## Project Architecture

Frontend

React.js + Vite

↓

REST APIs

↓

Spring Boot Backend

↓

PostgreSQL Database

---

## Database Modules

* Users
* Players
* Tournaments
* Tournament Registrations
* Rankings
* Gallery Items
* Notifications
* Contacts
* Feedback
* Documents

---

## Security Features

* JWT Authentication
* Role-Based Access Control (RBAC)
* Password Encryption
* Protected API Endpoints
* Secure Session Management

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/aptamp.git
```

### Backend Setup

```bash
cd apta-portal-backend
```

Configure PostgreSQL database:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/aptamp_db
spring.datasource.username=postgres
spring.datasource.password=your_password
```

Run backend:

```bash
./mvnw spring-boot:run
```

Backend URL:

```text
http://localhost:8082
```

---

### Frontend Setup

```bash
cd aptamp-frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## Default Modules

### Player Registration

* Online registration
* Profile creation
* Photo upload
* District allocation

### Tournament System

* Tournament creation
* Registration workflow
* Match tracking
* Results publication

### Gallery System

* Photo management
* Video management
* Public gallery display

### Contact System

* Public contact form
* Query management
* Admin responses

### Feedback System

* Feedback collection
* Review and analysis

---

## Future Enhancements

* Online Payment Gateway
* SMS Notifications
* Email Notifications
* Mobile Application
* AI-Based Analytics
* Multi-Language Support (English & Telugu)
* Certificate Generation
* Live Tournament Scoring

---

## Project Status

Current Version: Production Development

Core Modules Completed:

* Authentication
* Player Registration
* Tournament Management
* Rankings
* Gallery
* Contact Module
* Feedback Module
* Admin Dashboard

---

## Developed For

Andhra Pradesh Tennikoit Association (APTA)

Official Sports Management and Administration Portal

---

## License

This project is developed for academic, organizational, and sports management purposes.

© Andhra Pradesh Tennikoit Association Management Portal (APTAMP)
