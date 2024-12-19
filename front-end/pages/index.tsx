import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login'); // Redirect to login if not logged in
    } else {
      router.push(`/users/${localStorage.getItem('userId')}`); // Redirect to user's page
    }
  }, [router]);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
};

export default Home;
