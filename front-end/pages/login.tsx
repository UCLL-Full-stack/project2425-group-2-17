import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@styles/home.module.css";

const Login = () => {
  // State declarations for username, password, and error
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting to log in with:", { username, password });

    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      console.log('Fetch response:', response);

      if (!response.ok) {
        throw new Error('Invalid username or password.');
      }

      const user = await response.json();
      console.log('Parsed user object:', user);

      // Save token and user info to localStorage
      localStorage.setItem('token', user.token);// Save the token
      localStorage.setItem('userId', user.id.toString()); 
      localStorage.setItem('username', user.username);
      localStorage.setItem('fullname', user.fullname);
      console.log('Token saved in localStorage:', localStorage.getItem('token'));
      console.log( user.role);
        // Redirect based on role
      // Redirect based on role
      if (user.role === 'user') {
        console.log('Redirecting to /user');
        router.push(`/users/${user.id}`); // Redirect to user-specific page
    } else if (user.role === 'admin') {
        console.log('Redirecting to /admin');
        router.push('/admin');
    } else if (user.role === 'manager') {
        console.log('Redirecting to /manager');
        router.push('/manager');
    }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Properly handle the error message
      } else {
        console.error('An unexpected error occurred:', err);
      }
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
