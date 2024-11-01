import { Income } from './income';
import { Expense } from './expense';


export class Category {
    private _id: number;
    private _name: string;
    private _incomes?: Income[]; // Many-to-Many relationship with Income
    private _expenses?: Expense[]; // Many-to-Many relationship with Expense

    constructor(id: number, name: string, incomes?: Income[], expenses?: Expense[]) {
        this._id = id;
        this._name = name;
        this._incomes = incomes;
        this._expenses = expenses;
    }

    // Getter and Setter for id
    getId(): number {
        return this._id;
    }
    setId(value: number) {
        this._id = value;
    }

    // Getter and Setter for name
    getName(): string {
        return this._name;
    }
    setName(value: string) {
        this._name = value;
    }

    // Getter and Setter for incomes
    getIncomes(): Income[] | undefined {
        return this._incomes;
    }
    setIncomes(value: Income[] | undefined) {
        this._incomes = value;
    }

    // Getter and Setter for expenses
    getExpenses(): Expense[] | undefined {
        return this._expenses;
    }
    setExpenses(value: Expense[] | undefined) {
        this._expenses = value;
    }
}
