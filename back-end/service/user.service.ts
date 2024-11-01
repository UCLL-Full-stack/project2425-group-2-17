import { User } from "../model/user";
import userDB from '../repository/user.db';

const getAllUsers = (): User[] => userDB.getAllUsers();
const getUserById = (id: number): User => {
    const user = userDB.getUserById( id );
    if (!user) throw new Error(`User with id ${id} does not exist.`);
    return user;
};



export default {getAllUsers, getUserById};