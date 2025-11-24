import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

function LoginPage({ navigateTo }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(true);
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

      if (error && error.message.includes('not found')) {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create_user`;
        const createResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email, role: 'customer' }),
        });

        const createData = await createResponse.json();

        if (!createResponse.ok) {
          throw new Error(createData.error || 'Failed to create account');
        }

        const { error: retryError } = await signIn(email);
        if (retryError) throw retryError;

        setMessage('Account created and signed in successfully!');
        setEmail('');
      } else if (error) {
        throw error;
      } else {
        setMessage('Successfully signed in!');
        setEmail('');
      }
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
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
