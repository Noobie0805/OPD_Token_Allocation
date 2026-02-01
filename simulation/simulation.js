import { v4 as uuid } from "uuid";
import { doctors, slots } from "../data/store.js";
import { allocateToken, emergencyInsert } from "../services/tokenAllocator.js";

console.log("Starting OPD Day Simulation");

// Create doctors
const doctor1 = { id: uuid(), name: "Dr A" };
const doctor2 = { id: uuid(), name: "Dr B" };
const doctor3 = { id: uuid(), name: "Dr C" };

doctors.push(doctor1, doctor2, doctor3);

// Create slots
const slot1 = {
    id: uuid(),
    doctorId: doctor1.id,
    start: "09:00",
    end: "10:00",
    capacity: 2,
    tokens: []
};

slots.push(slot1);

// Events
console.log("09:00 - Online booking");
allocateToken({ doctorId: doctor1.id, slotId: slot1.id, source: "ONLINE" });

console.log("09:10 - Walk-in booking");
allocateToken({ doctorId: doctor1.id, slotId: slot1.id, source: "WALK_IN" });

console.log("09:20 - Paid priority arrives");
allocateToken({ doctorId: doctor1.id, slotId: slot1.id, source: "PAID" });

console.log("09:35 - Emergency case");
emergencyInsert({ doctorId: doctor1.id, slotId: slot1.id });

console.log("Simulation completed");
console.log("Final Slot State:", slot1);
