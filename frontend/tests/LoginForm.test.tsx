import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../src/components/LoginForm';
import { AuthProvider } from '../src/context/AuthContext';
import { api } from '../src/api/client';

vi.mock('../src/api/client', () => ({
  api: {
    auth: {
      login: vi.fn(),
      getProfile: vi.fn()
    }
  }
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders login form elements properly', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buyer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Admin/i })).toBeInTheDocument();
  });

  it('shows error if submitted with empty fields', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitBtn);

    // HTML5 required or custom validator
    expect(screen.getByLabelText(/Email Address/i)).toBeInvalid();
  });

  it('successfully logs in with valid credentials and invokes onSuccess callback', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    (api.auth.login as any).mockResolvedValueOnce({
      access_token: 'fake-jwt-token',
      token_type: 'bearer',
      user: {
        id: 1,
        name: 'Test Buyer',
        email: 'buyer@test.com',
        role: 'USER',
        created_at: new Date().toISOString()
      }
    });

    render(
      <AuthProvider>
        <LoginForm onSuccess={onSuccess} />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });

    await user.type(emailInput, 'buyer@test.com');
    await user.type(passwordInput, 'Buyer@123');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(api.auth.login).toHaveBeenCalledWith({
        email: 'buyer@test.com',
        password: 'Buyer@123'
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('displays an error alert when login fails', async () => {
    const user = userEvent.setup();
    (api.auth.login as any).mockRejectedValueOnce(new Error('Invalid email or password'));

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });

    await user.type(emailInput, 'wrong@test.com');
    await user.type(passwordInput, 'wrongpass');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password');
    });
  });

  it('populates demo credentials and logs in when Demo Buyer button is clicked', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    (api.auth.login as any).mockResolvedValueOnce({
      access_token: 'demo-token',
      token_type: 'bearer',
      user: {
        id: 2,
        name: 'Demo Buyer',
        email: 'customer@dealership.com',
        role: 'USER',
        created_at: new Date().toISOString()
      }
    });

    render(
      <AuthProvider>
        <LoginForm onSuccess={onSuccess} />
      </AuthProvider>
    );

    const demoBuyerBtn = screen.getByRole('button', { name: /Buyer/i });
    await user.click(demoBuyerBtn);

    await waitFor(() => {
      expect(api.auth.login).toHaveBeenCalledWith({
        email: 'customer@dealership.com',
        password: 'Customer@123'
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
