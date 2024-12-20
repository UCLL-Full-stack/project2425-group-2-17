// utils/jwt.ts

import jwt from 'jsonwebtoken';

const SECRET_KEY = '2154f4f52194f158c308f668a64a6f4a7f43f3f5ccc5cfeef6ff30fda34fa82'; // Replace with an environment variable in production

/**
 * Generates a JWT token for a given username.
 *
 * @param username - The username to include in the token payload.
 * @returns A signed JWT token.
 */
export const generateJWTtoken = (username: string): string => {
    const payload = { username };
    const options = { expiresIn: '8h' }; // Token expires in 8 hour

    return jwt.sign(payload, SECRET_KEY, options);
};
