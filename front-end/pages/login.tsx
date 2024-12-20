import { GetStaticPropsContext } from 'next';

import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@styles/home.module.css";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Login = () => {
  // State declarations for username, password, and error
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(t('error', 'Invalid username or password.'));
      }

      const user = await response.json();

      // Save token and user info to localStorage
      localStorage.setItem('token', user.token);
      localStorage.setItem('userId', user.id.toString());
      localStorage.setItem('username', user.username);
      localStorage.setItem('fullname', user.fullname);

      // Redirect based on role
      if (user.role === 'user') {
        router.push(`/users/${user.id}`);
      } else if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'manager') {
        router.push('/manager');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        console.error('An unexpected error occurred:', err);
      }
    }
  };

  const switchLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <>
      <Head>
        <title>{t('login', 'Login')}</title>
      </Head>
      <main className={styles.main}>
        <h1>{t('login', 'Translation not found')} BudgetMate</h1>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div>
            <label htmlFor="username">{t('username', 'Username')}:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">{t('password', 'Password')}:</label>
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
            {t('submit', 'Login')}
          </button>
        </form>
        <div className={styles.languageSwitcher}>
          <button onClick={() => switchLanguage('en')}>English</button>
          <button onClick={() => switchLanguage('nl')}>Nederlands</button>
        </div>
        <section className={styles.userTable}>
          <h2>Predefined Users</h2>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
                <th>Role</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>john</td>
                <td>john123</td>
                <td>user</td>
                <td>A user can add income or expenses incurred for the office.</td>
              </tr>
              <tr>
                <td>tim</td>
                <td>tim123</td>
                <td>user</td>
                <td>A user can add income or expenses incurred for the office.</td>
              </tr>
              <tr>
                <td>manager</td>
                <td>manager</td>
                <td>manager</td>
                <td>A manager can edit user details.</td>
              </tr>
              <tr>
                <td>admin</td>
                <td>admin</td>
                <td>admin</td>
                <td>An admin can add or delete a user.</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
};

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}

export default Login;
