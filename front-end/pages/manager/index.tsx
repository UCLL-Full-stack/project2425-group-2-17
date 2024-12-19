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
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null); // Track user being edited

  // Redirect to login if not logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, []);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Failed to fetch users:", err));
  };

  // Delete a user
  const handleDelete = async (userId: number) => {
    try {
      await fetch(`http://localhost:3000/users/${userId}`, { method: 'DELETE' });
      fetchUsers(); // Refresh user list after deletion
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error);
    }
  };

  // Save edited user
  const handleSave = async (user: User) => {
    try {
      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      setEditingUser(null); // Exit edit mode
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error(`Failed to update user ${user.id}:`, error);
    }
  };

  // Logout function
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
        <h1>Welcome to BudgetMate, Manager!</h1>
        <h2>A manager can edit a user, if you want to add or delete a user, you need to have admin rights</h2>
        <div className={styles.description}>
          <br></br>
          <p>Below is the list of all users:</p>
        </div>
        <ul className={styles.userList}>
          {users.map(user => (
            <li key={user.id} className={styles.card}>
              {editingUser?.id === user.id ? (
                // Inline edit form
                <div>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                  <button onClick={() => handleSave(editingUser)}>Save</button>
                  <button onClick={() => setEditingUser(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <Link href={`/users/${user.id}`}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                  </Link>
                  <button onClick={() => setEditingUser(user)}>Edit</button>
                  {/* <button onClick={() => handleDelete(user.id)}>Delete</button> */}
                </div>
              )}
            </li>
          ))}
        </ul>
        <button className={styles.button} onClick={handleLogout}>Logout</button>
      </main>
    </>
  );
};

export default Home;
