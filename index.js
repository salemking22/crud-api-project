import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import contactsRouter from './routes/contacts.js';
import servicesRouter from './routes/services.js'; // ✅ ADD THIS
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve('./swagger.json'), 'utf8')
);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contacts', contactsRouter);
app.use('/api/services', servicesRouter); // ✅ ADD THIS
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route
app.get('/', (req, res) => {
    res.send('Contacts API is running 🎉');
});

// MongoDB connection and server start
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB ✅');
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
