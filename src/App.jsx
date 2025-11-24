import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'products':
        return <ProductsPage />;
      case 'login':
        return <LoginPage navigateTo={navigateTo} />;
      case 'admin':
        return <AdminDashboard navigateTo={navigateTo} />;
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <AuthProvider>
      <div className="app">
        <div className="aurora-bg">
          <div className="aurora-particle"></div>
          <div className="aurora-particle"></div>
          <div className="aurora-particle"></div>
        </div>

        <Navbar navigateTo={navigateTo} currentPage={currentPage} />

        <div className="main-content">
          {renderPage()}
        </div>

        <Footer navigateTo={navigateTo} />
      </div>
    </AuthProvider>
  );
}

export default App;
