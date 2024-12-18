import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './controller/user.routes';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

// Status Route
app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

// Swagger Setup
const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'API for managing users, incomes, and expenses',
        },
        servers: [{ url: `http://localhost:${port}` }],
    },
    apis: ['./controller/*.ts'], // Adjust this to match your controller's path
};

const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/users', userRouter); // User routes

// Error-Handling Middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'unauthorized', message: err.message });
    } else if (err.name === 'CoursesError') {
        res.status(400).json({ status: 'domain error', message: err.message });
    } else {
        res.status(500).json({ status: 'application error', message: err.message });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});


