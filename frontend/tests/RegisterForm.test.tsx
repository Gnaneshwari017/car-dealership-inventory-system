import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '../src/components/RegisterForm';
import { AuthProvider } from '../src/context/AuthContext';
import { api } from '../src/api/client';

vi.mock('../src/api/client', () => ({
  api: {
    auth: {
      register: vi.fn(),
      getProfile: vi.fn()
    }
  }
}));

describe('RegisterForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders all registration inputs and role choices', () => {
    render(
      <AuthProvider>
        <RegisterForm />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Customer \(Buyer\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Staff Admin/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Register$/i })).toBeInTheDocument();
  });

  it('shows error if password is too short', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <RegisterForm />
      </AuthProvider>
    );

    await user.type(screen.getByLabelText(/Full Name/i), 'Alice Smith');
    await user.type(screen.getByLabelText(/Email Address/i), 'alice@test.com');
    await user.type(screen.getByLabelText(/^Password/i), '123');
    await user.type(screen.getByLabelText(/Confirm/i), '123');
    await user.click(screen.getByRole('button', { name: /^Register$/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/at least 6 characters/i);
    });
  });

  it('shows error if passwords do not match', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <RegisterForm />
      </AuthProvider>
    );

    await user.type(screen.getByLabelText(/Full Name/i), 'Alice Smith');
    await user.type(screen.getByLabelText(/Email Address/i), 'alice@test.com');
    await user.type(screen.getByLabelText(/^Password/i), 'Password@123');
    await user.type(screen.getByLabelText(/Confirm/i), 'Mismatch@123');
    await user.click(screen.getByRole('button', { name: /^Register$/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Passwords do not match/i);
    });
  });

  it('successfully registers a user with selected role and calls onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    (api.auth.register as any).mockResolvedValueOnce({
      access_token: 'new-reg-jwt-token',
      token_type: 'bearer',
      user: {
        id: 5,
        name: 'Alice Smith',
        email: 'alice@test.com',
        role: 'ADMIN',
        created_at: new Date().toISOString()
      }
    });

    render(
      <AuthProvider>
        <RegisterForm onSuccess={onSuccess} />
      </AuthProvider>
    );

    await user.type(screen.getByLabelText(/Full Name/i), 'Alice Smith');
    await user.type(screen.getByLabelText(/Email Address/i), 'alice@test.com');
    await user.type(screen.getByLabelText(/^Password/i), 'SecurePass@123');
    await user.type(screen.getByLabelText(/Confirm/i), 'SecurePass@123');
    await user.click(screen.getByRole('button', { name: /Staff Admin/i }));
    await user.click(screen.getByRole('button', { name: /^Register$/i }));

    await waitFor(() => {
      expect(api.auth.register).toHaveBeenCalledWith({
        name: 'Alice Smith',
        email: 'alice@test.com',
        password: 'SecurePass@123',
        role: 'ADMIN'
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
