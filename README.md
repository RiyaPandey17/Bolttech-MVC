# Bolttech Barcelona Fullstack Test

Welcome to Bolttech, the fastest-growing insurtech in the world. This repository contains the MVP for the **Carental** squad, which aims to develop a car rental platform in Barcelona. The MVP focuses on showcasing the bookings motor for a demo to the global leads team.

---

## Project Overview

### User Stories

#### US 1: View Car Availability
As a customer, I want to see the availability of cars for specific time slots so I can be informed of pricing and stock.

**Requisites:**
- All available cars for the complete time slot will be returned.
- Each car will include:
  - Total booking price.
  - Average daily price.

#### US 2: Create a Booking
As a customer, I want to create a booking for a car.

**Requisites:**
- A user can have only one booking for the same dates.
- The driving license must be valid through the entire booking period.

---

## Features

### Backend
- **Domain-Driven Design (DDD):** The backend is structured around core domain entities such as `User`, `Car`, and `Booking`.
- **Hexagonal Architecture:** Separation of concerns between application logic, domain entities, and infrastructure.
- **RESTful API:** Provides endpoints for authentication, car availability, and bookings.
- **Validation:** Input validation using `express-validator`.
- **Authentication:** JWT-based authentication for secure access.
- **Database:** PostgreSQL for production and SQLite for testing, managed via Knex.js.
- **Seasons:** Pricing logic based on predefined seasons:
  - **Peak Season:** June 1 - September 15.
  - **Mid Season:** March 1 - June 1, September 15 - October 31.
  - **Off Season:** November 1 - March 1.

### Frontend
- **React + Next.js:** A simple UI to interact with the API.
- **Tailwind CSS:** Styling for responsive and modern design.
- **Pages:**
  - Home: Welcome page with login/register options.
  - Login: User authentication.
  - Register: User registration.
  - Bookings: View and create bookings.
- **State Management:** Context API for managing user state.

---

## Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL (for production)
- SQLite (for testing)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the `backend` directory:
     ```env
     DB_CLIENT=pg
     DB_HOST=127.0.0.1
     DB_PORT=5432
     DB_NAME=bolttech_mvp
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     JWT_SECRET=your_jwt_secret
     PORT=4000
     FRONTEND_PORT=3000
     ```
4. Run database migrations:
   ```bash
   npm run migrate
   ```
5. Seed the database:
   ```bash
   npm run seed
   ```
6. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the `frontend` directory:
     ```env
     API_URL=http://localhost:4000
     ```
4. Start the frontend server:
   ```bash
   npm run dev
   ```

---

## API Documentation

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Login and receive a JWT token.
- **GET** `/api/auth/me`: Get the current authenticated user.

### Availability
- **GET** `/api/availability`: Check car availability for a given date range.

### Bookings
- **POST** `/api/bookings`: Create a new booking.
- **GET** `/api/bookings`: Get all bookings for a user.

---

## Testing

### Backend Tests
- Run tests:
  ```bash
  npm test
  ```
- Coverage includes:
  - `CheckCarAvailability` use case.
  - `CreateBooking` use case.

---

## Design Principles

- **SOLID Principles:** Ensuring maintainable and scalable code.
- **Test-Driven Development (TDD):** Tests written for core use cases.
- **Hexagonal Architecture:** Clear separation between domain, application, and infrastructure layers.

---

## Future Improvements

- **Frontend Enhancements:**
  - Add a Navbar component for better navigation.
  - Improve error handling and loading states.
- **Backend Enhancements:**
  - Add more comprehensive tests for all use cases.
  - Implement rate limiting for API endpoints.
- **Deployment:**
  - Dockerize the application for easier deployment.
  - Set up CI/CD pipelines.

---

## Predefined Values

### Seasons
| Season       | Date Range                     |
|--------------|--------------------------------|
| Peak Season  | June 1 - September 15         |
| Mid Season   | March 1 - June 1, Sep 15 - Oct 31 |
| Off Season   | November 1 - March 1          |

### Cars
| Brand     | Model      | Stock | Peak Price | Mid Price | Off Price |
|-----------|------------|-------|------------|-----------|-----------|
| Toyota    | Yaris      | 3     | $98.43     | $76.89    | $53.65    |
| Seat      | Ibiza      | 5     | $85.12     | $65.73    | $46.85    |
| Nissan    | Qashqai    | 2     | $101.46    | $82.94    | $59.87    |
| Jaguar    | e-pace     | 1     | $120.54    | $91.35    | $70.27    |
| Mercedes  | Vito       | 2     | $109.16    | $89.64    | $64.97    |

---

## License

This project is licensed under the MIT License.

---

## Contact

For any questions or feedback, feel free to reach out to the Bolttech team.

