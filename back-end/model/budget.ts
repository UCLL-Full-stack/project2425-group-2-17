import { Expense } from './expense';
import { Income } from './income';
import { User } from './user';

export class Budget {
    private _id: number;
    private _totalIncome: number;
    private _totalExpenses: number;
  //  private _user: User; // Many-to-One relationship with User
    private _incomes?: Income[]; // One-to-Many relationship with Income
    private _expenses?: Expense[]; // One-to-Many relationship with Expense

    constructor(
        id: number,
        totalIncome: number,
        totalExpenses: number,
       // user: User,
        incomes?: Income[],
        expenses?: Expense[]
    ) {
        this._id = id;
        this._totalIncome = totalIncome;
        this._totalExpenses = totalExpenses;
      //  this._user = user;
        this._incomes = incomes;
        this._expenses = expenses;
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

    // Getter and Setter for user
    // getUser(): User {
    //     return this._user;
    // }
    // setUser(value: User): void {
    //     this._user = value;
    // }

    // Getter and Setter for incomes
    getIncomes(): Income[] | undefined {
        return this._incomes;
    }
    setIncomes(value: Income[] | undefined): void {
        this._incomes = value;
    }

    // Getter and Setter for expenses
    getExpenses(): Expense[] | undefined {
        return this._expenses;
    }
    setExpenses(value: Expense[] | undefined): void {
        this._expenses = value;
    }
}
