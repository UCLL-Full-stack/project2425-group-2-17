import Head from 'next/head';
import styles from '@styles/home.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Sample User Data Type
interface User {
  id: number;
  name: string;
  email: string;
}

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, []);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Replace with your backend API URL
    fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };
  

  return (
    <>
      <Head>
        <title>BudgetMate</title>
        <meta name="description" content="Budget app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Welcome to BudgetMate!</h1>
        <div className={styles.description}>
          <p>Below is the list of all users:</p>
        </div>
        <ul className={styles.userList}>
          {users.map(user => (
            <li key={user.id} className={styles.card}>
              <Link href={`/users/${user.id}`}>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </Link>
            </li>
          ))}
        </ul>
        <button className={styles.button} onClick={handleLogout}>Logout</button>

      </main>
    </>
  );
};

export default Home;
