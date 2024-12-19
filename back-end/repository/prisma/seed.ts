import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.income.deleteMany();
  await prisma.expense.deleteMany();

  // Hash passwords
  const saltRounds = 10;

  const user1Password = await bcrypt.hash("john", saltRounds);
  const user2Password = await bcrypt.hash("tim", saltRounds);
  const adminPassword = await bcrypt.hash("admin", saltRounds);
  const managerPassword = await bcrypt.hash("manager", saltRounds);

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      id: 1,
      name: "John Doe",
      email: "John.Doe@gmail.com",
      username: "john123",
      password: user1Password,
      role: "user",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: 2,
      name: "Tim Doe",
      email: "tim.doe@gmail.com",
      username: "tim123",
      password: user2Password,
      role: "user",
    },
  });

  const admin = await prisma.user.create({
    data: {
      id: 3,
      name: "Admin",
      email: "admin@example.com",
      username: "admin",
      password: adminPassword,
      role: "admin",
    },
  });

  const manager = await prisma.user.create({
    data: {
      id: 4,
      name: "Manager",
      email: "Manager@gmail.com",
      username: "manager",
      password: managerPassword,
      role: "manager",
    },
  });

  // Categories
  const categorySalary = await prisma.category.create({ data: { name: "Salary" } });
  const categoryFreelance = await prisma.category.create({ data: { name: "Freelance" } });
  const categoryRent = await prisma.category.create({ data: { name: "Rent" } });
  const categoryGroceries = await prisma.category.create({ data: { name: "Groceries" } });

  // Budgets
  const budget1 = await prisma.budget.create({
    data: {
      income: 0,
      expense: 0,
      userId: user1.id,
    },
  });

  const budget2 = await prisma.budget.create({
    data: {
      income: 0,
      expense: 0,
      userId: user2.id,
    },
  });

  // Expenses
  await prisma.expense.create({
    data: {
      amount: 1000,
      date: new Date("2024-10-05"),
      categoryId: categoryRent.id,
      budgetId: budget1.id,
    },
  });

  await prisma.expense.create({
    data: {
      amount: 500,
      date: new Date("2024-10-15"),
      categoryId: categoryGroceries.id,
      budgetId: budget2.id,
    },
  });

  // Incomes
  await prisma.income.create({
    data: {
      amount: 5000,
      date: new Date("2024-10-01"),
      categoryId: categorySalary.id,
      budgetId: budget1.id,
    },
  });

  await prisma.income.create({
    data: {
      amount: 1500,
      date: new Date("2024-10-10"),
      categoryId: categoryFreelance.id,
      budgetId: budget2.id,
    },
  });

  // Update Budgets
  const updatedBudget1 = await prisma.budget.update({
    where: { id: budget1.id },
    data: {
      income: 5000,
      expense: 1000,
    },
    include: { incomes: true, expenses: true },
  });

  const updatedBudget2 = await prisma.budget.update({
    where: { id: budget2.id },
    data: {
      income: 1500,
      expense: 500,
    },
    include: { incomes: true, expenses: true },
  });

  console.log("Updated Budget1:", updatedBudget1);
  console.log("Updated Budget2:", updatedBudget2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
