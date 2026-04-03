import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js'; 
import academicRoutes from './modules/academic/academic.routes.js';

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

app.use('/api/auth', authRoutes);

app.use('/api/academic', academicRoutes);

export default app;