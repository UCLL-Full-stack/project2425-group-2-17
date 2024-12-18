import { Budget } from "./budget";
import { Expense } from "./expense";
import { Income } from "./income";

export class User {

    private static idCounter: number = 1;

    private id: number;
    private name: string;
    private email: string;
    private username: string;
    private password: string;
    private role: string;
    private budgets?: Budget[];

    // Getters
    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public getUsername(): string {
        return this.username;
    }

    public getRole(): string {
        return this.role;
    }

    public getPassword(): string {
        return this.password;
    }

    public getBudgets(): Budget[] | undefined {
        return this.budgets;
    }

    // Constructor
    constructor(
        name: string,
        email: string,
        username: string,
        password: string,
        role: string,
        budgets?: Budget[]
    ) {
        this.id = User.idCounter++;
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = role;
        this.budgets = budgets;
    }
       // Add Expense to the first budget
       public addExpense(amount: number, description: string): void {
        if (!this.budgets || this.budgets.length === 0) {
            throw new Error("User does not have a budget to add expenses.");
        }
        const expense = new Expense(this.id, amount, new Date(), this.id);
        this.budgets[0].addExpense(expense);
    }

    // Add Income to the first budget
    public addIncome(amount: number, description: string): void {
        if (!this.budgets || this.budgets.length === 0) {
            throw new Error("User does not have a budget to add income.");
        }
        const income = new Income(this.id, amount, new Date(), this.id);
        this.budgets[0].addIncome(income);
    }
}
