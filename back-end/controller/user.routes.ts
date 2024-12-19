import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *     IncomeExpense:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           example: "income"
 *         amount:
 *           type: number
 *           example: 500
 *         description:
 *           type: string
 *           example: "Salary for May"
 */

export const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Server error
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     description: Authenticate a user by providing their username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john123"
 *               password:
 *                 type: string
 *                 example: "john"
 *     responses:
 *       200:
 *         description: Successfully logged in. Returns user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       401:
 *         description: Invalid username or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid username or password."
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error."
 */
userRouter.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        // Query the database
        const user = await prisma.user.findFirst({
            where: { username, password },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Return user data (exclude sensitive info)
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(Number(req.params.id));
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       500:
 *         description: Server error
 */
userRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userService.deleteUser(Number(req.params.id));
        res.status(200).json({ message: 'User successfully deleted' });
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /users:
 *   put:
 *     summary: Add a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "example Doe"
 *               email:
 *                 type: string
 *                 example: "example.doe@gmail.com"
 *               username:
 *                 type: string
 *                 example: "example"
 *               password:
 *                 type: string
 *                 example: "example"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       200:
 *         description: User successfully updated
 *       500:
 *         description: Server error
 */
userRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedUser = await userService.addAUser(req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});





/**
 * @swagger
 * /users/expense:
 *   post:
 *     summary: Add an expense to a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 example: 500
 *               description:
 *                 type: string
 *                 example: "Groceries expense"
 *     responses:
 *       201:
 *         description: Expense successfully added
 *       500:
 *         description: Server error
 */
userRouter.post('/expense', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, amount, description } = req.body;
        const newRecord = await userService.addExpenseToAUser(userId, amount, description );
        res.status(201).json(newRecord);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/income:
 *   post:
 *     summary: Add an income to a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 example: 5000
 *               description:
 *                 type: string
 *                 example: "Salary income"
 *     responses:
 *       201:
 *         description: Income successfully added
 *       500:
 *         description: Server error
 */
userRouter.post('/income', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, amount, description } = req.body;
        const newRecord = await userService.addIncomeToAUser(userId,  amount, description );
        res.status(201).json(newRecord);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user's name and email by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Name"
 *               email:
 *                 type: string
 *                 example: "updated.email@example.com"
 *     responses:
 *       200:
 *         description: User successfully updated
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        // Validate input
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required.' });
        }

        // Update the user
        const updatedUser = await userService.updateUserById(Number(id), { name, email });

        if (!updatedUser) {
            return res.status(404).json({ error: `User with ID ${id} not found.` });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});




