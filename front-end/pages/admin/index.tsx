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
  password?: string; // Password is optional here, as we won't display it
  role: string;
}

const Home: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'user',
  });

  // Redirect to login if not logged in or unauthorized
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (!isLoggedIn ) {
      router.push('/login');
    }
  }, [router]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.name?.trim() || !newUser.email?.trim() || !newUser.username?.trim() || !newUser.password?.trim()) {
        alert('All fields are required!');
        return;
    }

    try {
        console.log('Attempting to add user:', newUser);

        const response = await fetch('http://localhost:3000/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newUser.name.trim(),
                email: newUser.email.trim(),
                username: newUser.username.trim(),
                password: newUser.password.trim(),
                role: newUser.role || 'user', // Ensure role defaults to 'user' if empty
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error response:', errorData);
            alert(`Failed to add user: ${errorData.error || 'Unknown error'}`);
            return;
        }

        const result = await response.json();
        console.log('User added successfully:', result);
       

        alert('User added successfully!');
        setNewUser({
            name: '',
            email: '',
            username: '',
            password: '',
            role: 'user',
        }); // Reset the form
        fetchUsers(); // Refresh the user list
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Failed to add user. Please try again.');
    }
};



  // Delete a user
  const handleDelete = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Failed to delete user with ID ${userId}`);
      }
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
    }
  };

  // Save edited user
  const handleSave = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`http://localhost:3000/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      setEditingUser(null); // Exit edit mode
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
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
        <h1>Welcome to BudgetMate, Admin!</h1>
        <h2>An admin can delete or add a user or a Manager</h2>
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
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
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
                  <button onClick={handleSave}>Save</button>
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
