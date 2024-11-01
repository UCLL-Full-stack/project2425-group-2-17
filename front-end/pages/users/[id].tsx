import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '@styles/userDetails.module.css';

// Sample Types
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

const UserDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (id) {
      // Replace with your backend API URL
      fetch(`http://localhost:3000/users/${id}`)
        .then(response => response.json())
        .then(data => {
          console.log(data); // Check the structure of the fetched data
          setUser(data);
        });
    }
  }, [id]);

    // This function navigates back to the home page
    const handleGoHome = () => {
      router.push('/');
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
              user.budgets.map(budget => (
                <div key={budget._id} className={styles.card}>
                  <h3 className={styles.cardTitle}>Budget ID: {budget._id}</h3>
                  <p className={styles.cardText}>Total Income: ${budget._totalIncome}</p>
                  <p className={styles.cardText}>Total Expenses: ${budget._totalExpenses}</p>

                  <h4 className={styles.subHeading}>Incomes</h4>
                  {Array.isArray(budget._incomes) && budget._incomes.length > 0 ? (
                    budget._incomes.map(income => (
                      <div key={income._id} className={styles.cardText}>
                        <p>
                          Income of ${income._amount} on {new Date(income._date).toLocaleDateString()}
                        </p>
                        <p>Category:</p>
                        <ul>
                          {income._categories.map(category => (
                            <li key={category._id}>{category._name}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className={styles.cardText}>No incomes recorded.</p>
                  )}

                  <h4 className={styles.subHeading}>Expenses</h4>
                  {Array.isArray(budget._expenses) && budget._expenses.length > 0 ? (
                    budget._expenses.map(expense => (
                      <div key={expense._id} className={styles.cardText}>
                        <p>
                          Expense of ${expense._amount} on {new Date(expense._date).toLocaleDateString()}
                        </p>
                        <p>Category:</p>
                        <ul>
                          {expense._categories.map(category => (
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
          </>
        ) : (
          <p>Loading...</p>
        )}

        <button onClick={handleGoHome} className={styles.homeButton}>Home</button>
      </main>
    </>
  );
};

export default UserDetails;
