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
  username: string;
  password: string;
  role: string;
}

const Home: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'user',
  });

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
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to fetch users:', err));
  };

  // Add a new user
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.username || !newUser.password) {
      alert("All fields are required!");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          password: newUser.password,
          role: newUser.role || 'user',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
  
      setNewUser({
        id: 0,
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'user',
      }); // Reset form
  
      fetchUsers(); // Fetch the updated list of users
    } catch (error) {
      console.error('Failed to add new user:', error);
    }
  };
  

  // Delete a user
  const handleDelete = async (userId: number) => {
    try {
      await fetch(`http://localhost:3000/users/${userId}`, { method: 'DELETE' });
      fetchUsers();
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
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error(`Failed to update user ${user.id}:`, error);
    }
  };

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

        {/* Add New User Form */}
        <div className={styles.addUserForm}>
          <h3>Add New User</h3>
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="admin">manager</option>
          </select>
          <button onClick={handleAddUser}>Add User</button>
        </div>

        {/* User List */}
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user.id} className={styles.card}>
              {editingUser?.id === user.id ? (
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
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>

        <button className={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </main>
    </>
  );
};

export default Home;


