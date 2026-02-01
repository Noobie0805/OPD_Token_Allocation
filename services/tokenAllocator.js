import { v4 as uuid } from "uuid";
import PRIORITY from "../data/priority.js";
import { slots, tokens, waitingQueue } from "../data/store.js";

export function allocateToken({ doctorId, slotId, source }) {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) throw new Error("Slot not found");

    const token = {
        id: uuid(),
        doctorId,
        slotId,
        source,
        priority: PRIORITY[source],
        status: "ACTIVE",
        createdAt: new Date()
    };

    // Slot has capacity
    if (slot.tokens.length < slot.capacity) {
        slot.tokens.push(token.id);
        tokens.push(token);
        return token;
    }

    // Slot full → try displacement
    const slotTokens = slot.tokens
        .map(id => tokens.find(t => t.id === id))
        .sort((a, b) => a.priority - b.priority);

    const lowest = slotTokens[0];

    if (token.priority > lowest.priority) {
        slot.tokens = slot.tokens.filter(id => id !== lowest.id);
        waitingQueue.push(lowest);
        slot.tokens.push(token.id);
        tokens.push(token);
        return token;
    }

    waitingQueue.push(token);
    return token;
}

export function cancelToken(tokenId) {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) throw new Error("Token not found");

    token.status = "CANCELLED";

    const slot = slots.find(s => s.id === token.slotId);
    slot.tokens = slot.tokens.filter(id => id !== tokenId);

    reallocate(slot.id);
}

function reallocate(slotId) {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || waitingQueue.length === 0) return;

    waitingQueue.sort((a, b) => b.priority - a.priority);
    const next = waitingQueue.shift();

    if (slot.tokens.length < slot.capacity) {
        slot.tokens.push(next.id);
        next.slotId = slotId;
        next.status = "ACTIVE";
    }
}

export function emergencyInsert(data) {
    return allocateToken({ ...data, source: "EMERGENCY" });
}
