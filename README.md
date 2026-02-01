# OPD Token Allocation Engine

### Overview
The **OPD Token Allocation Engine** is a backend service that manages patient token allocation for hospital **Outpatient Departments (OPD)**.

It is designed to support multiple doctors working in fixed time slots with defined capacities while dynamically handling **priority patients, cancellations, no-shows, and emergencies** — ensuring fairness and elasticity in token distribution.

---

## Key Features
- **Per-slot hard capacity enforcement**
- **Priority-based token allocation**
- **Emergency token handling with controlled displacement**
- **Dynamic reallocation on cancellations and no-shows**
- **API-based design using Node.js + Express**
- **Simulate a full OPD day** with multiple doctors
- **Clean separation of concerns** (routes, services, data)

---

## Technology Stack
| Layer     | Technology                        |
| --------- | --------------------------------- |
| Runtime   | Node.js (ES Modules)              |
| Framework | Express.js                        |
| Storage   | In-memory (for algorithmic focus) |
| Utilities | UUID for token generation         |

---

## Priority Model
Token sources are assigned numeric priorities for flexible and fair conflict handling:

| Source         | Priority |
| -------------- | -------- |
| Emergency      | 100      |
| Paid Priority  | 80       |
| Follow-up      | 60       |
| Online Booking | 40       |
| Walk-in        | 20       |

Higher numeric values indicate higher priority during token allocation or conflict resolution.

---

## Core Concepts

### 1. Doctors and Slots
- Each doctor operates in fixed time slots (e.g., **09:00–10:00**).  
- Each slot enforces a **hard capacity limit**.  
- Tokens are allocated on a **per-slot basis**.

### 2. Tokens
A token represents a patient’s position in a doctor’s queue.  
Each token includes:
- Priority level  
- Status (Active, Cancelled, Displaced, etc.)  
- Slot association  

---

## Token Allocation Logic

### Normal Allocation
- If the slot has free capacity → allocate token directly.  
- If full → compare priorities.  
  - **Higher-priority tokens displace lower-priority ones** when necessary.

### Displacement Rules
- Only lower-priority tokens can be displaced.  
- Displaced tokens move to a **waiting queue**.  
- No backward-in-time displacement occurs.

### Emergency Handling
- Emergency tokens insert **instantly**.  
- The lowest-priority token in the slot is displaced if needed.  
- Temporary slot overflow is allowed (followed by downstream rebalancing).

### Cancellation Handling
- When a token is cancelled, its slot frees up.  
- The **highest-priority waiting token** is promoted.

### No-Shows
- Treated as cancellations.  
- Reallocation happens dynamically.

---

## 📡 API Endpoints

### Doctor Management
- `POST /doctors` - Create a new doctor

### Slot Management
- `POST /slots` - Create a slot for a doctor
- `GET /slots/:id` - Fetch slot details

### Token Management
- `POST /tokens` - Allocate a normal token
- `POST /tokens/emergency` - Insert an emergency token
- `PUT /tokens/:id/cancel` - Cancel a token
  
## Data Models

### Doctor
```json
{
  "id": "doc_1",
  "name": "Dr Sharma"
}
```

### Slot
```json
{
  "id": "slot_1",
  "doctorId": "doc_1",
  "start": "09:00",
  "end": "10:00",
  "capacity": 5,
  "tokens": []
}
```

### Token
```json
{
  "id": "token_101",
  "doctorId": "doc_1",
  "slotId": "slot_1",
  "source": "PAID",
  "priority": 80,
  "status": "ACTIVE",
  "createdAt": "2026-01-31T09:15:00Z"
}
```
## Simulation
A sample simulation script demonstrates how an OPD day behaves with:

- Online bookings
- Walk-in registrations
- Paid priority insertions
- Emergency cases
- Cancellations and reallocations

This helps visualize the dynamic response of the engine under real-world conditions.

## Failure Handling & Edge Cases
- Slot overflow prevented (except temporary during emergency).
- Invalid slot/token requests return precise error responses.
- Concurrent booking risks acknowledged (atomic DB ops required for persistence).
- In-memory store resets on restart.

## Design Trade-offs
- In-memory storage keeps focus on algorithm correctness.
- Database integration can be added without altering allocation logic.
- Simplicity > premature optimization.

## How to Run
```bash
# Install dependencies
npm install

# Start the server
npm start
```
Server runs on: http://localhost:3000

## Future Enhancements
- Database integration (MongoDB / PostgreSQL)
- Time-based no-show detection
- Authentication & role-based access
- Metrics & audit logs
- Unit & integration testing

## Conclusion
The OPD Token Allocation Engine provides a realistic, fairness-driven model for managing hospital outpatient queues. It demonstrates modular, extensible design – perfect for both academic study and real-world healthcare systems.

**Author:** Sarvjeet 
**License:** MIT  
**Version:** 1.0.0
