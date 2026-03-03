import app from './app.js';
import dotenv from 'dotenv';

// Load env variables
dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});