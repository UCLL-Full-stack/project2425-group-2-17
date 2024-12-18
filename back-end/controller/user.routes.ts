import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';


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
 *                 example: "Tim Doe"
 *               email:
 *                 type: string
 *                 example: "tim.doe@gmail.com"
 *               username:
 *                 type: string
 *                 example: "tim123"
 *               password:
 *                 type: string
 *                 example: "tim"
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
