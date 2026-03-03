import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// A simple health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Success', message: 'Yahora backend is up and running! 🚀...' });
});

// Add this right under your /api/health route
app.get('/', (req, res) => {
    res.send('Yahora API is successfully running! 🚀...');
});


export default app;