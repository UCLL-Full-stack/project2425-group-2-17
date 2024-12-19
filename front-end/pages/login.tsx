import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@styles/home.module.css";



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
          const response = await fetch('http://localhost:3000/users/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
              throw new Error('Invalid username or password.');
          }

          const user = await response.json();

          // Save user info to localStorage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', user.id);
          localStorage.setItem('role', user.role);

          // Redirect based on role
          if (user.role === 'user') router.push('/user');
          else if (user.role === 'admin') router.push('/admin');
          else if (user.role === 'manager') router.push('/manager');
      } catch (err: any) {
          setError(err.message);
      }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <main className={styles.main}>
        <h1>Login to BudgetMate</h1>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.button} type="submit">
            Login
          </button>
        </form>
      </main>
    </>
  );
};

export default Login;




