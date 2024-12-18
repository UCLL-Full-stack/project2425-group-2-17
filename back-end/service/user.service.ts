import { Budget } from "../model/budget";
import { User } from "../model/user";
import userDB from "../repository/user.db";

const getAllUsers = (): User[] => userDB.getAllUsers();

const getUserById = (id: number): User => {
    const user = userDB.getUserById(id);
    if (!user) throw new Error(`User with id ${id} does not exist.`);
    return user;
};

// New Function: Get User by Username and Password
const getUserByUsernameAndPassword = (username: string, password: string): User | null => {
    const user = userDB.getAllUsers().find(
        (user) => user.getUsername() === username && user.getPassword() === password
    );
    return user || null;
};

const deleteUser = (id: number): void => {
    const user = userDB.getUserById(id);
    if (!user) throw new Error(`User with id ${id} does not exist.`);
    userDB.deleteUser(id);
};
let currentBudgetId = 10; // Start ID from 10

const getNextBudgetId = (): number => {
    if (currentBudgetId > 100) currentBudgetId = 10; // Reset to 10 if ID exceeds 100
    return currentBudgetId++;
};

const addAUser = (user: User): User => {
    const existingUser = userDB.getAllUsers().find(u => u.getEmail() === user["email"]);
    if (existingUser) throw new Error(`User with email ${user["email"]} already exists.`);
    
    const newBudget = new Budget(
        getNextBudgetId(), // Generate unique ID for budget
        0,          // Default totalIncome
        0,          // Default totalExpenses
        [],         // Empty incomes array
        []          // Empty expenses array
    );

    const newUser = new User(
        user["name"] || "Unnamed User",
        user["email"] || "",
        user["username"] || "",
        user["password"] || "",
        user["role"] || "user",
        user["budgets"] || [newBudget] // Assign new budget if none provided
    );

    userDB.addAUser(newUser);
    return newUser;
};



const addIncomeToAUser = (id: number, amount: number, description: string): void => {
    const user = userDB.getUserById(id);
    if (!user) throw new Error(`User with id ${id} does not exist.`);
    user.addIncome(amount, description);
    userDB.updateUser(id, user);
};

const addExpenseToAUser = (id: number, amount: number, description: string): void => {
    const user = userDB.getUserById(id);
    if (!user) throw new Error(`User with id ${id} does not exist.`);
    user.addExpense(amount, description);
    userDB.updateUser(id, user);
};

  

export default {
    getAllUsers,
    getUserById,
    getUserByUsernameAndPassword, // Expose the new function
    deleteUser,
    addAUser,
    addIncomeToAUser,
    addExpenseToAUser,
    getNextBudgetId,
};

