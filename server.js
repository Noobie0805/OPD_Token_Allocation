import express from "express";
import doctorsRouter from "./routes/doctors.js";
import slotsRouter from "./routes/slots.js";
import tokensRouter from "./routes/tokens.js";

const app = express();
app.use(express.json());

app.use("/doctors", doctorsRouter);
app.use("/slots", slotsRouter);
app.use("/tokens", tokensRouter);

app.listen(3000, () => {
    console.log("OPD Token Allocation Engine running on port 3000");
});
