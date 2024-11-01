import express, { NextFunction, Request, Response } from 'express';
import lecturerService from '../service/user.service';
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user ID
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The user's name
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     description: The user's email address
 *                     example: johndoe@example.com
 *       500:
 *         description: Server error
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const users = await lecturerService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
})

/**
 * @swagger
 * /users/{id}:
 *  get:
 *      summary: Get a user by id.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              required: true
 *              description: The user id.
 *      responses:
 *          200:
 *              description: A user object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const user = await userService.getUserById(Number(req.params.id));
        res.status(200).json(user);
    }catch (error) {
        next(error);
    }
});