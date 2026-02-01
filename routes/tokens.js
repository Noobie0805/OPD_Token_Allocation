import express from "express";
import {
    allocateToken,
    cancelToken,
    emergencyInsert
} from "../services/tokenAllocator.js";

const router = express.Router();

router.post("/", (req, res) => {
    const token = allocateToken(req.body);
    res.json(token);
});

router.post("/emergency", (req, res) => {
    const token = emergencyInsert(req.body);
    res.json(token);
});

router.put("/:id/cancel", (req, res) => {
    cancelToken(req.params.id);
    res.json({ success: true });
});

export default router;
