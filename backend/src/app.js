import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js'; // Import the new routes

const app = express();

app.use(cors());
app.use(express.json());

// A simple health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Success', message: 'Yahora backend is up and running! 🚀...' });
});

app.get('/', (req, res) => {
    res.send('Yahora API is successfully running! 🚀...');
});

// Mount the authentication routes
app.use('/api/auth', authRoutes);

export default app;