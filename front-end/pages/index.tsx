import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
  
      // Redirect to login if no token exists
      router.push('/login');
    
  }, [router]);

  return (
    <div>
      <h1>Welcome to BudgetMate!</h1>
      {/* You can add a loader or some other visual feedback here */}
    </div>
  );
};

export default Home;

