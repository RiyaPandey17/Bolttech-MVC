# Bolttech Barcelona Fullstack Test

Welcome to Bolttech, the fastest growing insurtech in the world. This repository contains the MVP for the Carental squad, which aims to develop a car rental platform for Barcelona. The MVP focuses on showcasing the bookings motor functionality.

---

## Project Overview

### User Stories

#### US 1: View Car Availability
As a customer, I want to see the availability of cars for specific time slots so I can be informed of pricing and stock.

**Requisites:**
- All available cars for the complete time slot will be returned.
- Each car will display the total booking price and the average daily price.

#### US 2: Create a Booking
As a customer, I want to create a booking for a car.

**Requisites:**
- A user can have only one booking for the same dates.
- NOTE: considered that overlapping booking not allowed since wasn't clear if to and from date booking were mentioned or overlapping ones(different dates)
- The driving license must be valid through the entire booking period.

---

## Features

### Backend
- **Domain-Driven Design (DDD):** The backend is structured using DDD principles, with clear separation between domain entities, repositories, and application use cases.
- **Hexagonal Architecture:** Ports and adapters are used to ensure flexibility and maintainability.
- **Booking Logic:** Implements business rules for car availability and booking creation.
- **Seasonal Pricing:** Calculates booking prices based on predefined seasons (peak, mid, off-season).
- **Authentication:** JWT-based authentication for user login and registration.
- **Validation:** Middleware for validating API requests.

### Frontend
- **React + Next.js:** Provides a simple and intuitive UI for customers.
- **Car Availability:** Displays available cars with pricing details for selected dates.
- **Booking Creation:** Allows users to book cars and view their bookings.
- **Responsive Design:** Styled using Tailwind CSS for a modern and responsive layout.

---

## Future Improvements

1. **Frontend Enhancements**:
   - Add a Navbar component for better navigation.
   - Improve error handling and loading states with visual feedback.
   - Add loading indicators for actions like checking car availability or creating bookings.
   - Replace Context API with Redux or Zustand for better scalability as the application grows.
   - Make use of Cookies for authentication.
   - Booking Details need to show according to user timezone.

2. **Backend Enhancements**:
   - Add more comprehensive tests for all use cases.
   - Optimize database queries for better performance.
   - Implement centralized error handling middleware for consistent error responses.
   - Replace hardcoded values with environment variables for better security.
   - Implement rate limiting to prevent abuse of API endpoints.
   - Add caching for frequently accessed data, such as car availability, to improve performance.
   - Add roles and authentication verification for APIs for security.

3. **Deployment**:
   - Dockerize the application for easier deployment.
   - Set up CI/CD pipelines to automate testing and deployment.

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
| Toyota    | Yaris      | 3     | $9843     | $7689    | $5365    |
| Seat      | Ibiza      | 5     | $8512     | $6573    | $4685    |
| Nissan    | Qashqai    | 2     | $10146    | $8294    | $5987    |
| Jaguar    | e-pace     | 1     | $12054    | $9135    | $7027    |
| Mercedes  | Vito       | 2     | $10916    | $8964    | $6497    |

---

## License

This project is classified as **C2 - General Business**.

