export class IncomeCategory {
    private _incomeId: number;
    private _categoryId: number;

    constructor(incomeId: number, categoryId: number) {
        this._incomeId = incomeId;
        this._categoryId = categoryId;
    }

    // Getter and Setter for incomeId
    getIncomeId(): number {
        return this._incomeId;
    }
    setIncomeId(value: number) {
        this._incomeId = value;
    }

    // Getter and Setter for categoryId
    getCategoryId(): number {
        return this._categoryId;
    }
    setCategoryId(value: number) {
        this._categoryId = value;
    }
}
