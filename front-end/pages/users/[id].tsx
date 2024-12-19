import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '@styles/userDetails.module.css';

// Types
interface Category {
  _id: number;
  _name: string;
}

interface Income {
  _id: number;
  _amount: number;
  _date: string;
  _categories: Category[];
}

interface Expense {
  _id: number;
  _amount: number;
  _date: string;
  _categories: Category[];
}

interface Budget {
  _id: number;
  _totalIncome: number;
  _totalExpenses: number;
  _incomes: Income[];
  _expenses: Expense[];
}

interface User {
  id: number;
  name: string;
  email: string;
  budgets: Budget[];
}

// Fetcher function for useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const UserDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  // Fetch user data with useSWR
  const { data: user, mutate } = useSWR<User>(
    id ? `http://localhost:3000/users/${id}` : null,
    fetcher
  );

  const [income, setIncome] = useState({ amount: 0, category: '' });
  const [expense, setExpense] = useState({ amount: 0, category: '' });

  // Check for user authentication with useEffect
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUserId = localStorage.getItem('userId');

    if (!isLoggedIn || storedUserId !== id) {
      router.push('/login');
    }
  }, [id, router]);

  // Handle adding income
  const handleAddIncome = async () => {
    if (!income.amount || income.amount <= 0 || !income.category.trim()) {
      alert('Please provide a valid amount and category for income.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/users/income`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(id),
          amount: income.amount,
          description: income.category,
        }),
      });

      if (response.ok) {
        alert('Income successfully added!');
        setIncome({ amount: 0, category: '' });
        mutate(); // Revalidate the SWR cache
      } else {
        alert('Failed to add income. Please try again.');
      }
    } catch (err) {
      console.error('Error adding income:', err);
    }
  };

  // Handle adding expense
  const handleAddExpense = async () => {
    if (!expense.amount || expense.amount <= 0 || !expense.category.trim()) {
      alert('Please provide a valid amount and category for expense.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/users/expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(id),
          amount: expense.amount,
          description: expense.category,
        }),
      });

      if (response.ok) {
        alert('Expense successfully added!');
        setExpense({ amount: 0, category: '' });
        mutate(); // Revalidate the SWR cache
      } else {
        alert('Failed to add expense. Please try again.');
      }
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  return (
    <>
      <Head>
        <title>User Details</title>
        <meta name="description" content="User Details Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {user ? (
          <>
            <h1 className={styles.heading}>{user.name}'s Details</h1>
            <p>Email: {user.email}</p>

            <h2 className={styles.subHeading}>Budgets</h2>
            {user.budgets && user.budgets.length > 0 ? (
              user.budgets.map((budget) => (
                <div key={budget._id} className={styles.card}>
                  <h3 className={styles.cardTitle}>Budget ID: {budget._id}</h3>
                  <p className={styles.cardText}>Total Income: ${budget._totalIncome}</p>
                  <p className={styles.cardText}>Total Expenses: ${budget._totalExpenses}</p>

                  <h4 className={styles.subHeading}>Incomes</h4>
                  {budget._incomes.length > 0 ? (
                    budget._incomes.map((income) => (
                      <div key={income._id} className={styles.cardText}>
                        <p>
                          Income of ${income._amount} on{' '}
                          {new Date(income._date).toLocaleDateString()}
                        </p>
                        <p>Category:</p>
                        <ul>
                          {income._categories.map((category) => (
                            <li key={category._id}>{category._name}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className={styles.cardText}>No incomes recorded.</p>
                  )}

                  <h4 className={styles.subHeading}>Expenses</h4>
                  {budget._expenses.length > 0 ? (
                    budget._expenses.map((expense) => (
                      <div key={expense._id} className={styles.cardText}>
                        <p>
                          Expense of ${expense._amount} on{' '}
                          {new Date(expense._date).toLocaleDateString()}
                        </p>
                        <p>Category:</p>
                        <ul>
                          {expense._categories.map((category) => (
                            <li key={category._id}>{category._name}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className={styles.cardText}>No expenses recorded.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No budgets found for this user.</p>
            )}

            {/* Add Income */}
            <div className={styles.form}>
              <h3>Add Income</h3>
              <input
                type="number"
                placeholder="Amount"
                value={income.amount || ''}
                onChange={(e) =>
                  setIncome({ ...income, amount: parseFloat(e.target.value) || 0 })
                }
              />
              <input
                type="text"
                placeholder="Category"
                value={income.category}
                onChange={(e) => setIncome({ ...income, category: e.target.value })}
              />
              <button onClick={handleAddIncome}>Add Income</button>
            </div>

            {/* Add Expense */}
            <div className={styles.form}>
              <h3>Add Expense</h3>
              <input
                type="number"
                placeholder="Amount"
                value={expense.amount || ''}
                onChange={(e) =>
                  setExpense({ ...expense, amount: parseFloat(e.target.value) || 0 })
                }
              />
              <input
                type="text"
                placeholder="Category"
                value={expense.category}
                onChange={(e) => setExpense({ ...expense, category: e.target.value })}
              />
              <button onClick={handleAddExpense}>Add Expense</button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}

        <button className={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </main>
    </>
  );
};

export default UserDetails;
