import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import LoadingScreen from './components/LoadingScreen';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time and resources loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onShopNow={() => setCurrentPage('shop')}
            onExploreProducts={() => setCurrentPage('shop')}
            onViewAllProducts={() => setCurrentPage('shop')}
          />
        );
      case 'shop':
        return <ShopPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      default:
        return (
          <HomePage
            onShopNow={() => setCurrentPage('shop')}
            onExploreProducts={() => setCurrentPage('shop')}
            onViewAllProducts={() => setCurrentPage('shop')}
          />
        );
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <LoadingScreen isLoading={isLoading} />
        <div className={`min-h-screen bg-gray-50 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
          <main>
            {renderPage()}
          </main>
          <Footer onPageChange={setCurrentPage} />
          <Cart />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;