import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

// Context
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout'; // New
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import About from './pages/About';
import ProductDetails from './pages/ProductDetails';
import Collection from './pages/Collection';
import ForgotPassword from './pages/ForgotPassword';


// Helper to reset scroll on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout Wrapper to handle conditional Navbar/Footer
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Define paths where Navbar and Footer should be HIDDEN
  const hideLayout = ['/login', '/signup', '/seller/login','/forgot'].includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
       <Toaster 
  position="top-center" 
  reverseOrder={false} 
  toastOptions={{
    // Duration in milliseconds (1000ms = 1 sec)
    duration: 3000, 
    style: {
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      borderRadius: '12px',
      background: '#1bc30b', // Kantam Slate Blue
      color: '#060606',
    },
  }}
/>
        <ScrollToTop />
        <LayoutWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path='/forgot' element={<ForgotPassword/>} />
            
            {/* User & Checkout Routes */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />


          </Routes>
        </LayoutWrapper>
      </Router>
    </CartProvider>
  );
}

export default App;