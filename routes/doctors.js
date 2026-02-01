import express from "express";
import { v4 as uuid } from "uuid";
import { doctors } from "../data/store.js";

const router = express.Router();

router.post("/", (req, res) => {
    const doctor = {
        id: uuid(),
        name: req.body.name
    };
    doctors.push(doctor);
    res.json(doctor);
});

export default router;
