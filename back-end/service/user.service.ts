import { PrismaClient } from '@prisma/client';
import { User as UserModel } from '../model/user';
import {Budget as BudgetModel} from '../model/budget'
import { Income } from '../model/income';
import { Expense } from '../model/expense';
import { Category } from '../model/category'; // Import your Category class

//const prisma = new PrismaClient();
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Log all queries
});
const getAllUsers = async (): Promise<any[]> => {
    // Fetch all users along with their budgets, incomes, and expenses
    const users = await prisma.user.findMany({
        include: {
            Budget: {
                include: {
                    incomes: {
                        include: { category: true },
                    },
                    expenses: {
                        include: { category: true },
                    },
                },
            },
        },
    });

    // Return the raw data as is
    return users;
};

// const getAllUsers = async (): Promise<UserModel[]> => {
//     const users = await prisma.user.findMany({
//         include: {
//             Budget: {
//                 include: {
//                     incomes: {
//                         include: { category: true }, // Include categories for incomes
//                     },
//                     expenses: {
//                         include: { category: true }, // Include categories for expenses
//                     },
//                 },
//             },
//         },
//     });

//     // Map Prisma users to your `UserModel`
//     return users.map((user) => {
//         const budgets = user.Budget.map((budget) => {
//             const incomes = budget.incomes.map(
//                 (income) =>
//                     new Income(
//                         income.id,
//                         income.amount,
//                         income.date,
//                         income.budgetId,
//                         undefined,
//                         income.category ? [new Category(income.category.id, income.category.name)] : []
//                     )
//             );

//             const expenses = budget.expenses.map(
//                 (expense) =>
//                     new Expense(
//                         expense.id,
//                         expense.amount,
//                         expense.date,
//                         expense.budgetId,
//                         undefined,
//                         expense.category ? [new Category(expense.category.id, expense.category.name)] : []
//                     )
//             );

//            return new BudgetModel(budget.id, budget.income, budget.expense, incomes, expenses);
//         });

//         return new UserModel(
//             user.name,
//             user.email,
//             user.username,
//             user.password,
//             user.role,
//             budgets
//         );
//     });
// };

const getUserByUsernameAndPassword = async (username: string, password: string): Promise<UserModel | null> => {
    const user = await prisma.user.findFirst({
        where: {
            username,
            password,
        },
        include: {
            Budget: true,
        },
    });

    if (!user) return null;

    // Map to `UserModel`
    return new UserModel(
        user.name,
        user.email,
        user.username,
        user.password,
        user.role,
        user.Budget.map(
            (budget) =>
                new BudgetModel(
                    budget.id,
                    budget.income,
                    budget.expense,
                    [], // Empty for now; adjust if you want to include incomes/expenses
                    []
                )
        )
    );
};

const deleteUser = async (id: number): Promise<void> => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new Error(`User with id ${id} does not exist.`);
    }

    await prisma.user.delete({
        where: { id },
    });

    console.log(`User with id ${id} deleted successfully.`);
};


const addAUser = async (userData: any): Promise<UserModel> => {
    // Map the plain input data to an instance of UserModel
    const user = new UserModel(
        userData.name,
        userData.email,
        userData.username,
        userData.password,
        userData.role || 'user',
        userData.budgets?.map(
            (budget: any) =>
                new BudgetModel(
                    budget.id || 0,
                    budget.income || 0,
                    budget.expense || 0,
                    [], // Incomes (empty for now)
                    [] // Expenses (empty for now)
                )
        ) || []
    );

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: user.getEmail() },
    });
    if (existingUser) throw new Error(`User with email ${user.getEmail()} already exists.`);

    // Find the next available ID
    const maxUser = await prisma.user.findFirst({
        orderBy: { id: 'desc' }, // Get the user with the highest ID
        select: { id: true },
    });
    const nextId = (maxUser?.id || 0) + 1; // Increment the highest ID

    // Create the user and their budgets
    const newUser = await prisma.user.create({
        data: {
            id: nextId, // Manually assign the next available ID
            name: user.getName(),
            email: user.getEmail(),
            username: user.getUsername(),
            password: user.getPassword(),
            role: user.getRole(),
            Budget: {
                create: user.getBudgets()?.map((budget) => ({
                    income: budget.getTotalIncome(),
                    expense: budget.getTotalExpenses(),
                })),
            },
        },
        include: {
            Budget: true,
        },
    });

    // Map back to UserModel instance
    return new UserModel(
        newUser.name,
        newUser.email,
        newUser.username,
        newUser.password,
        newUser.role,
        newUser.Budget.map(
            (budget) =>
                new BudgetModel(
                    budget.id,
                    budget.income,
                    budget.expense,
                    [],
                    []
                )
        )
    );

};


const addIncomeToAUser = async (
    userId: number,
    amount: number,
    category?: string
): Promise<void> => {
    // Find the user
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) throw new Error(`User with id ${userId} does not exist.`);

    // Find or create the user's budget
    let budget = await prisma.budget.findFirst({
        where: { userId },
        include: {
            incomes: {
                include: { category: true }, // Ensure category is included
            },
            expenses: {
                include: { category: true }, // Ensure category is included
            },
        },
    });

    if (!budget) {
        // If no budget exists, create a new one
        budget = await prisma.budget.create({
            data: {
                userId,
                income: 0,
                expense: 0,
            },
            include: {
                incomes: {
                    include: { category: true },
                },
                expenses: {
                    include: { category: true },
                },
            },
        });

        console.log(`New budget created for user with id ${userId}.`);
    }

    // Find or create the category
    let categoryId: number | undefined;
    if (category) {
        const categoryRecord = await prisma.category.upsert({
            where: { name: category },
            update: {},
            create: { name: category },
        });
        categoryId = categoryRecord.id;
    }

    // Create the income record with the current date and time
    await prisma.income.create({
        data: {
            amount,
            date: new Date(), // Automatically set to the current date and time
            budgetId: budget.id,
            userId,
            categoryId, // Set categoryId if available
        },
    });
      // Update the total expenses in the budget
      await prisma.budget.update({
        where: { id: budget.id },
        data: {
            income: budget.income + amount, // Increment total expenses by the new amount
        },
    });
    

    console.log(`Income of ${amount} added to user with id ${userId}, category: ${category || 'None'}.`);
};



const addExpenseToAUser = async (
    userId: number,
    amount: number,
    category?: string
): Promise<void> => {
    // Find the user
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) throw new Error(`User with id ${userId} does not exist.`);

    // Find or create the user's budget
    let budget = await prisma.budget.findFirst({
        where: { userId },
        include: {
            incomes: {
                include: { category: true }, // Ensure category is included
            },
            expenses: {
                include: { category: true }, // Ensure category is included
            },
        },
    });

    if (!budget) {
        // If no budget exists, create a new one
        budget = await prisma.budget.create({
            data: {
                userId,
                income: 0,
                expense: 0,
            },
            include: {
                incomes: {
                    include: { category: true },
                },
                expenses: {
                    include: { category: true },
                },
            },
        });

        console.log(`New budget created for user with id ${userId}.`);
    }

    // Find or create the category
    let categoryId: number | undefined;
    if (category) {
        const categoryRecord = await prisma.category.upsert({
            where: { name: category },
            update: {},
            create: { name: category },
        });
        categoryId = categoryRecord.id;
    }

    // Create the expense record with the current date and time
    await prisma.expense.create({
        data: {
            amount,
            date: new Date(), // Automatically set to the current date and time
            budgetId: budget.id,
            userId,
            categoryId, // Set categoryId if available
        },
    });
     // Update the total expenses in the budget
     await prisma.budget.update({
        where: { id: budget.id },
        data: {
            expense: budget.expense + amount, // Increment total expenses by the new amount
        },
    });

    console.log(`Expense of ${amount} added to user with id ${userId}, category: ${category || 'None'}.`);
};


const getUserById = async (id: number): Promise<UserModel | null> => {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            Budget: {
                include: {
                    incomes: {
                        include: { category: true }, // Include categories for incomes
                    },
                    expenses: {
                        include: { category: true }, // Include categories for expenses
                    },
                },
            },
        },
    });

    if (!user) return null;

    // Map budgets
    const budgets = user.Budget.map(
        (budget) =>
            new BudgetModel(
                budget.id,
                budget.income,
                budget.expense,
                budget.incomes.map(
                    (income) =>
                        new Income(
                            income.id,
                            income.amount,
                            income.date,
                            income.budgetId,
                            undefined, // Budget will be set by `BudgetModel`
                            income.category ? [new Category(income.category.id, income.category.name)] : [] // Map categories
                        )
                ),
                budget.expenses.map(
                    (expense) =>
                        new Expense(
                            expense.id,
                            expense.amount,
                            expense.date,
                            expense.budgetId,
                            undefined, // Budget will be set by `BudgetModel`
                            expense.category ? [new Category(expense.category.id, expense.category.name)] : [] // Map categories
                        )
                )
            )
    );

    // Map and return the user
    return new UserModel(
        user.name,
        user.email,
        user.username,
        user.password,
        user.role,
        budgets
    );
};

async function updateUserById(id: number, data: Partial<{ name: string; email: string }>) {
    return await prisma.user.update({
        where: { id },
        data,
    });
}






export default {
    getAllUsers,
    getUserById,
    getUserByUsernameAndPassword,
    deleteUser,
    addAUser,
    addIncomeToAUser,
    addExpenseToAUser,
    updateUserById,
};
