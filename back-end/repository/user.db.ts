import { Budget } from "../model/budget";
import { Category } from "../model/category";
import { Expense } from "../model/expense";
import { Income } from "../model/income";
import { User } from "../model/user";



// Sample categories
const categorySalary = new Category(1, "Salary");
const categoryFreelance = new Category(2, "Freelance");
const categoryRent = new Category(3, "Rent");
const categoryGroceries = new Category(4, "Groceries");

// Sample incomes
const income1 = new Income(1, 5000, new Date('2024-10-01'), 1, undefined, [categorySalary]);
const income2 = new Income(2, 1500, new Date('2024-10-10'), 1, undefined, [categoryFreelance]);

// Sample expenses
const expense1 = new Expense(1, 1000, new Date('2024-10-05'), 1, undefined, [categoryRent]);
const expense2 = new Expense(2, 500, new Date('2024-10-15'), 1, undefined, [categoryGroceries]);

// Sample budget
const budget1 = new Budget(1, 6500, 1500, [income1, income2], [expense1, expense2]);

// Sample users
const user1:User =  new User("John Doe", "John.Doe@gmail.com", [budget1]);
const user2: User =  new User("Mary Toe", "Mary.Toe@gmail.com");
const users: User[] = [ user1, user2];


// Function to get user by ID
function getUserById(userId: number): User | null {
    try {
        const user = users.find((user) => user.getId() === userId);
        if (!user) {
            console.warn(`User with ID ${userId} not found.`);
            return null;
        }
        return user;
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        throw new Error('Database error. See server log for details.');
    }
}

function getAllUsers():User[]{
    return users
}

export default{
    getUserById,
    getAllUsers,
}

