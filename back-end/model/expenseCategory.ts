export class ExpenseCategory {
    private _expenseId: number;
    private _categoryId: number;

    constructor(expenseId: number, categoryId: number) {
        this._expenseId = expenseId;
        this._categoryId = categoryId;
    }

    // Getter and Setter for expenseId
    getExpenseId(): number {
        return this._expenseId;
    }
    setExpenseId(value: number) {
        this._expenseId = value;
    }

    // Getter and Setter for categoryId
    getCategoryId(): number {
        return this._categoryId;
    }
    setCategoryId(value: number) {
        this._categoryId = value;
    }
}
