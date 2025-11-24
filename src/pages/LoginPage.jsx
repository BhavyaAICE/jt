import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

function LoginPage({ navigateTo }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { signIn, signUp, user, isAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        setMessage('Login successful!');
        setTimeout(() => {
          if (isAdmin) {
            navigateTo('admin');
          } else {
            navigateTo('home');
          }
        }, 1000);
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setMessage('Account created! Please check your email for verification.');
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (user && !isAdmin) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back!</h2>
              <p>You are logged in as {user.email}</p>
            </div>
            <button className="btn-primary full-width" onClick={() => navigateTo('home')}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Login to your account' : 'Sign up for a new account'}</p>
          </div>

          <form onsubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {message && (
              <div className={`message ${message.includes('error') || message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>

            <div className="switch-mode">
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage('');
                }}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>

            {isLogin && (
              <p className="hint">
                Admin Demo: admin@auroraservices.com / admin123
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
