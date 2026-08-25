import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User 
} from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  quickDemoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  authError: string | null;
  setAuthError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    setAuthError(null);
    const cleanEmail = email.trim();
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
    } catch (err: any) {
      // If user does not exist yet (first-time owner setup), automatically create and sign in
      if ((err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') && pass.length >= 6) {
        try {
          await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          return;
        } catch (regErr: any) {
          if (regErr.code !== 'auth/email-already-in-use') {
            const msg = regErr.message || 'Registration failed.';
            setAuthError(msg);
            throw new Error(msg);
          }
        }
      }

      let msg = 'Failed to sign in. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Incorrect password. If you forgot your password or need a new account, use the options below.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again later or reset password.';
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const register = async (email: string, pass: string) => {
    setAuthError(null);
    const cleanEmail = email.trim();
    try {
      await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    } catch (err: any) {
      let msg = err.message || 'Registration failed.';
      if (err.code === 'auth/email-already-in-use') {
        // If already exists, try to log in directly
        try {
          await signInWithEmailAndPassword(auth, cleanEmail, pass);
          return;
        } catch (loginErr) {
          msg = 'An account with this email already exists. Please enter the correct password to sign in.';
        }
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return;
      }
      const msg = err.message || 'Google sign-in failed.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const quickDemoLogin = async () => {
    setAuthError(null);
    const demoEmail = 'owner@thriftwithmiemie.com';
    const demoPass = 'MiemieAdmin2026!';
    try {
      await signInWithEmailAndPassword(auth, demoEmail, demoPass);
    } catch (err: any) {
      // If not yet registered, create it seamlessly
      try {
        await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
      } catch (regErr: any) {
        // If it exists but wrong password, sign in again
        if (regErr.code === 'auth/email-already-in-use') {
          await signInWithEmailAndPassword(auth, demoEmail, demoPass);
        } else {
          throw regErr;
        }
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send password reset email.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin: !!currentUser,
      loading,
      login,
      register,
      loginWithGoogle,
      quickDemoLogin,
      logout,
      resetPassword,
      authError,
      setAuthError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
