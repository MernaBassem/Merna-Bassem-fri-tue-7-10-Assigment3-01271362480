import express from 'express';
import trainerRouter from './src/Modules/Trainer/trainer.routes.js';
import memberRouter from "./src/Modules/Membership/membership.routes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use('/trainer', trainerRouter);
app.use("/member", memberRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});