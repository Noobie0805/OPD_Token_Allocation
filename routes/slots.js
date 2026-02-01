import express from "express";
import { v4 as uuid } from "uuid";
import { slots } from "../data/store.js";

const router = express.Router();

router.post("/", (req, res) => {
    const slot = {
        id: uuid(),
        doctorId: req.body.doctorId,
        start: req.body.start,
        end: req.body.end,
        capacity: req.body.capacity,
        tokens: []
    };
    slots.push(slot);
    res.json(slot);
});

router.get("/:id", (req, res) => {
    const slot = slots.find(s => s.id === req.params.id);
    res.json(slot);
});

export default router;
