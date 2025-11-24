import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

function LoginPage({ navigateTo }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { signIn, user, isAdmin, loading: authLoading } = useAuth();

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
      const { error } = await signIn(email);
      if (error) throw error;
      setMessage('Check your email for the magic link!');
      setEmail('');
      setTimeout(() => setShowModal(false), 3000);
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="login-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome to AuroraServices</h2>
            <p>Sign in with your email to continue</p>
          </div>

          <button
            className="btn-primary full-width"
            onClick={() => setShowModal(true)}
          >
            Sign In / Sign Up
          </button>

          <p className="hint">
            We'll send you a magic link to sign in
          </p>
        </div>
      </div>

      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Enter Your Email</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setMessage('');
                  setEmail('');
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
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
                />
              </div>

              {message && (
                <div className={`message ${message.includes('error') || message.includes('Error') ? 'error' : 'success'}`}>
                  {message}
                </div>
              )}

              <button type="submit" className="btn-primary full-width" disabled={loading}>
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
