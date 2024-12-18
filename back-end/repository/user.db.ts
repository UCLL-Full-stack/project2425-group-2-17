import { Budget } from "../model/budget";
import { Category } from "../model/category";
import { Expense } from "../model/expense";
import { Income } from "../model/income";
import { User } from "../model/user";

// Categories
const categorySalary = new Category(1, "Salary");
const categoryFreelance = new Category(2, "Freelance");
const categoryRent = new Category(3, "Rent");
const categoryGroceries = new Category(4, "Groceries");


const expense0 = new Expense(3,0,new Date("2024-10-01"),3,undefined,undefined);
const income0 = new Income(3,0,new Date("2024-10-01"),3,undefined,undefined);
const budget0 = new Budget(3,income0.getAmount(), expense0.getAmount(), [income0], [expense0]);
// Incomes
const income1 = new Income(1, 5000, new Date("2024-10-01"), 1, undefined, [categorySalary]);
const income2 = new Income(2, 1500, new Date("2024-10-10"), 1, undefined, [categoryFreelance]);

// Expenses
const expense1 = new Expense(1, 1000, new Date("2024-10-05"), 1, undefined, [categoryRent]);
const expense2 = new Expense(2, 500, new Date("2024-10-15"), 1, undefined, [categoryGroceries]);

// Budgets
const budget1 = new Budget(1, 6500, 1500, [income1, income2], [expense1, expense2]);
const budget2 = new Budget(2, 6500, 1500, [income1, income2], [expense1, expense2]);

// Users with credentials
const user1: User = new User("John Doe", "John.Doe@gmail.com", "john123", "john", "user", [budget1]);
const admin: User = new User("Admin", "admin@example.com", "admin", "admin", "admin", undefined);
const manager: User = new User("Mary Toe", "Mary.Toe@gmail.com", "manager", "manager", "manager", undefined);
const user2: User = new User("Tim Doe", "tim.doe@gmail.com", "tim123", "tim", "user", [budget2]);

const users: User[] = [user1, admin, manager, user2];

// Functions
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
        throw new Error("Database error. See server log for details.");
    }
}

function getAllUsers(): User[] {
    return users;
}

function getUserByUsernameAndPassword(username: string, password: string): User | null {
    return users.find((user) => user.getUsername() === username && user.getPassword() === password) || null;
}

function deleteUser(userId: number): void {
    const index = users.findIndex((user) => user.getId() === userId);
    if (index === -1) throw new Error(`User with ID ${userId} does not exist.`);
    users.splice(index, 1);
    console.log(`User with ID ${userId} deleted successfully.`);
}

function addAUser(newUser: User): User {
    if (users.some((user) => user.getEmail() === newUser.getEmail())) {
        throw new Error(`User with email ${newUser.getEmail()} already exists.`);
    }
    users.push(newUser);
    return newUser;
}

function addIncomeToAUser(userId: number, income: Income): void {
    const user = getUserById(userId);
    if (!user) throw new Error(`User with ID ${userId} does not exist.`);
    user.getBudgets()?.[0]?.addIncome(income);
}

function addExpenseToAUser(userId: number, expense: Expense): void {
    const user = getUserById(userId);
    if (!user) throw new Error(`User with ID ${userId} does not exist.`);
    user.getBudgets()?.[0]?.addExpense(expense);
}

function updateUser(userId: number, updatedUser: Partial<User>): User {
    const user = getUserById(userId);
    if (!user) throw new Error(`User with ID ${userId} does not exist.`);

    if (updatedUser.getName) user["name"] = updatedUser.getName();
    if (updatedUser.getEmail) user["email"] = updatedUser.getEmail();
    if (updatedUser.getUsername) user["username"] = updatedUser.getUsername();
    if (updatedUser.getPassword) user["password"] = updatedUser.getPassword();
    if (updatedUser.getRole) user["role"] = updatedUser.getRole();
    if (updatedUser.getBudgets) user["budgets"] = updatedUser.getBudgets();

    console.log(`User with ID ${userId} updated successfully.`);
    return user;
}



export default {
    getUserById,
    getAllUsers,
    getUserByUsernameAndPassword,
    deleteUser,
    addAUser,
    addIncomeToAUser,
    addExpenseToAUser,
    updateUser,
};

