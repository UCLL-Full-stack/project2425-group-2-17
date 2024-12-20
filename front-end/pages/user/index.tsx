import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@styles/home.module.css";

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Check if the user is logged in and retrieve their userId
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userId = localStorage.getItem("userId");

    if (!isLoggedIn || !userId) {
      router.push("/login"); // Redirect to login if not logged in
    } else {
      router.push(`/users/${userId}`); // Redirect to the user's detail page
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>BudgetMate</title>
        <meta name="description" content="Budget app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Redirecting...</h1>
        <p>If you are not redirected, please <a href="/login">login</a>.</p>
      </main>
    </>
  );
};

export default Home;

