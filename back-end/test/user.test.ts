import { Budget } from "../model/budget";
import { Category } from "../model/category";
import { Expense } from "../model/expense";
import { Income } from "../model/income";
import { User } from "../model/user";

// Sample users
const user1:User =  new User("John Doe", "John.Doe@gmail.com");
const user2: User =  new User("Mary Toe", "Mary.Toe@gmail.com");
const users: User[] = [ user1, user2];

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
const budget1 = new Budget(1, 6500, 1500 , [income1, income2], [expense1, expense2]);



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

// Tests
describe('User Tests', () => {

    test('Create a user with a budget', () => {
        const user = new User("Jane Smith", "jane.smith@example.com", [budget1]);
        expect(user.getName()).toBe("Jane Smith");
        expect(user.getEmail()).toBe("jane.smith@example.com");
        expect(user.getBudgets()?.length).toBe(1);
    });

    test('Get user by ID', () => {
        const user = getUserById(1);
        expect(user).not.toBeNull();
        expect(user?.getName()).toBe("John Doe");
    });

    test('Get user by non-existing ID', () => {
        const user = getUserById(99);
        expect(user).toBeNull();
    });

    test('Add a budget to a user', () => {
        const newBudget = new Budget(2, 8000, 3000);
        const user = getUserById(2);
        expect(user).not.toBeNull();
        if (user) {
            user.addBudget(newBudget);
            expect(user.getBudgets()?.length).toBe(1);
        }
    });

    

    test('Check categories of income and expense', () => {
        expect(income1.getCategories()).toBeDefined();
        expect(income1.getCategories()?.[0].getName()).toBe("Salary");
    
        expect(expense1.getCategories()).toBeDefined();
        expect(expense1.getCategories()?.[0].getName()).toBe("Rent");
    });
    
});
