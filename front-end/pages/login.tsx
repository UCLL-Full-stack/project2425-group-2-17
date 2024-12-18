import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@styles/home.module.css";
import userService from "../../back-end/service/user.service";


const Login: React.FC = () => {
  const router = useRouter();

  // State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const matchedUser = userService.getUserByUsernameAndPassword(username, password);

    if (matchedUser) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", `${matchedUser.getId()}`);
      localStorage.setItem("role", matchedUser.getRole());

      if (matchedUser.getRole() === "user") router.push("/user");
      else if (matchedUser.getRole() === "admin") router.push("/admin");
      else if (matchedUser.getRole() === "manager") router.push("/manager");
    } else {
      setError("Invalid username or password.");
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




