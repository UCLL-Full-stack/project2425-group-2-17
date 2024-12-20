import { render, screen, fireEvent } from '@testing-library/react';
import  Login  from '../pages/login';

describe('Login Component', () => {
  test('renders the login form with username and password fields', () => {
    render(<Login />);

    // Check if the username input field is rendered
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();

    // Check if the password input field is rendered
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Check if the submit button is rendered
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('displays an error message on failed login', async () => {
    render(<Login />);

    // Simulate user input for incorrect credentials
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wrongUser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongPass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check for the error message
    expect(await screen.findByText(/invalid username or password/i)).toBeInTheDocument();
  });
});
