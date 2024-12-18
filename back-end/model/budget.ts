import { Expense } from './expense';
import { Income } from './income';

export class Budget {
    private _id: number;
    private _totalIncome: number;
    private _totalExpenses: number;
    private _incomes?: Income[]; // One-to-Many relationship with Income
    private _expenses?: Expense[]; // One-to-Many relationship with Expense

    constructor(
        id: number,
        totalIncome: number,
        totalExpenses: number,
        incomes?: Income[],
        expenses?: Expense[]
    ) {
        this._id = id;
        this._totalIncome = totalIncome;
        this._totalExpenses = totalExpenses;
        this._incomes = incomes || [];
        this._expenses = expenses || [];
    }

    // Getter and Setter for id
    getId(): number {
        return this._id;
    }
    setId(value: number): void {
        this._id = value;
    }

    // Getter and Setter for totalIncome
    getTotalIncome(): number {
        return this._totalIncome;
    }
    setTotalIncome(value: number): void {
        this._totalIncome = value;
    }

    // Getter and Setter for totalExpenses
    getTotalExpenses(): number {
        return this._totalExpenses;
    }
    setTotalExpenses(value: number): void {
        this._totalExpenses = value;
    }

    // Getter and Setter for incomes
    getIncomes(): Income[] | undefined {
        return this._incomes;
    }
    setIncomes(value: Income[] | undefined): void {
        this._incomes = value || [];
    }

    // Getter and Setter for expenses
    getExpenses(): Expense[] | undefined {
        return this._expenses;
    }
    setExpenses(value: Expense[] | undefined): void {
        this._expenses = value || [];
    }

    // Add Income
    addIncome(income: Income): void {
        if (!this._incomes) this._incomes = [];
        this._incomes.push(income);
        this._totalIncome += income.getAmount();
    }

    // Add Expense
    addExpense(expense: Expense): void {
        if (!this._expenses) this._expenses = [];
        this._expenses.push(expense);
        this._totalExpenses += expense.getAmount();
    }
}

