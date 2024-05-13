import express from 'express';
import trainerRouter from './src/Modules/Trainer/trainer.routes.js';

const app = express();
const port = 3000;

app.use('/trainer', trainerRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});