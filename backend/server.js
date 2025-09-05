import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import audioRoutes from "./routes/audioRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/audio', audioRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



