import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './controller/user.routes';
import { expressjwt } from 'express-jwt';
import helmet from 'helmet'; // Import Helmet for security headers

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

// Middleware
app.use(helmet()); // Add security headers with Helmet
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            baseUri: ["'self'"],
            fontSrc: ["'self'", "https:", "data:"],
            formAction: ["'self'"],
            frameAncestors: ["'self'"],
            imgSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
            scriptSrc: ["'self'"],
            scriptSrcAttr: ["'none'"],
            styleSrc: ["'self'", "https:", "'unsafe-inline'"],
            upgradeInsecureRequests: [],
        },
    })
);
app.use(helmet.crossOriginOpenerPolicy({ policy: 'same-origin' }));
app.use(helmet.crossOriginResourcePolicy({ policy: 'same-origin' }));
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(helmet.hsts({ maxAge: 15552000, includeSubDomains: true }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.frameguard({ action: 'sameorigin' }));

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

// JWT Secret and Allowed Paths
const JWT_SECRET = '2154f4f52194f158c308f668a64a6f4a7f43f3f5ccc5cfeef6ff30fda34fa82';

app.use(
    expressjwt({
        secret: JWT_SECRET,
        algorithms: ['HS256'],
    }).unless({
        path: [
            { url: '/api-docs', methods: ['GET'] }, // Allow the base Swagger UI path
            { url: /^\/api-docs\/.*/, methods: ['GET'] }, // Allow subpaths under /api-docs/
            '/users/login',
            '/users/signup',
            '/status',
        ],
    })
);

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
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
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
