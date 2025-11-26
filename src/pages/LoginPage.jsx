import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

function LoginPage({ navigateTo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const { signIn, signUp, user, isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin) {
        navigateTo('admin');
      } else {
        navigateTo('home');
      }
    }
  }, [user, isAdmin, authLoading, navigateTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      let result;

      if (isSignUp) {
        result = await signUp(email, password);
        if (!result.error) {
          setMessageType('success');
          setMessage('Account created successfully! You can now sign in.');
          setEmail('');
          setPassword('');
          setTimeout(() => setIsSignUp(false), 2000);
        }
      } else {
        result = await signIn(email, password);
        if (!result.error) {
          setMessageType('success');
          setMessage('Signing in...');
        }
      }

      if (result.error) {
        setMessageType('error');
        throw result.error;
      }
    } catch (error) {
      setMessageType('error');
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="login-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>AuroraServices</h1>
            <p>{isSignUp ? 'Create your account' : 'Welcome back'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {message && (
              <div className={`message message-${messageType}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary full-width"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                isSignUp ? 'Sign Up' : 'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setMessage('');
                  setEmail('');
                  setPassword('');
                }}
                className="toggle-btn"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        <div className="login-backdrop"></div>
      </div>
    </div>
  );
}

export default LoginPage;
