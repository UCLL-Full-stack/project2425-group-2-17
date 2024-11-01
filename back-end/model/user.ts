import { Budget } from "./budget";


export class User {
    private static idCounter: number = 1; // Static variable to keep track of the next available ID

    private id: number;
    private name: string;
    private email: string;
    private budgets?: Budget[]; // One-to-Many relationship with Budget

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

    public getBudgets(): Budget[] | undefined {
        return this.budgets;
    }

    // Setters
    public setName(name: string): void {
        this.name = name;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public addBudget(budget: Budget): void {
        if (!this.budgets) {
            this.budgets = [];
        }
        this.budgets.push(budget);
    }

    constructor(name: string, email: string, budgets?: Budget[]) {
        this.id = User.idCounter++; // Assign an auto-incremented ID
        this.name = name;
        this.email = email;
        this.budgets = budgets;
    }
}
