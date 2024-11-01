import { Budget } from './budget';
import { Category } from './category';

export class Expense {
    private _id: number;
    private _amount: number;
    private _date: Date;
    private _budgetId: number;
    private _budget?: Budget; // Many-to-One relationship with Budget
    private _categories?: Category[]; // Many-to-Many relationship with Category

    constructor(
        id: number,
        amount: number,
        date: Date,
        budgetId: number,
        budget?: Budget,
        categories?: Category[]
    ) {
        this._id = id;
        this._amount = amount;
        this._date = date;
        this._budgetId = budgetId;
        this._budget = budget;
        this._categories = categories;
    }

  // Getter and Setter for id
  getId(): number {
    return this._id;
}
setId(value: number): void {
    this._id = value;
}

// Getter and Setter for amount
getAmount(): number {
    return this._amount;
}
setAmount(value: number): void {
    this._amount = value;
}

// Getter and Setter for date
getDate(): Date {
    return this._date;
}
setDate(value: Date): void {
    this._date = value;
}

// Getter and Setter for budgetId
getBudgetId(): number {
    return this._budgetId;
}
setBudgetId(value: number): void {
    this._budgetId = value;
}

// Getter and Setter for budget
getBudget(): Budget | undefined {
    return this._budget;
}
setBudget(value: Budget | undefined): void {
    this._budget = value;
}

// Getter and Setter for categories
getCategories(): Category[] | undefined {
    return this._categories;
}
setCategories(value: Category[] | undefined): void {
    this._categories = value;
}
}
