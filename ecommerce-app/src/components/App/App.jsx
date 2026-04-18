import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from "../../context/CartContext";
import { AuthProvider } from '../../context/AuthContext';
import { WishlistProvider } from '../../context/WishlistContext';
import Header from "../../layout/Header/Header"
import Footer from "../../layout/Footer/Footer";
import Home from "../../pages/Home"; 
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import Course from '../../pages/Course';
import Wishlist from '../../pages/Wishlist';
import Help from '../../pages/Help';
import Contact from '../../pages/Contact';
import SearchResult from '../../pages/SearchResult';
import CategoryPage from '../../pages/CategoryPage';
import ProtectedRoute from '../../pages/ProtectedRoute';

import { lazy, Suspense } from 'react';
import Loading from '../common/Loading/Loading';

const Cart = lazy(() => import('../../pages/Cart'));
const Checkout = lazy(() => import('../../pages/Checkout'));
const Profile = lazy(() => import('../../pages/Profile'));
const Settings = lazy(() => import('../../pages/Settings'));
const Orders = lazy(() => import('../../pages/Orders'));
const OrderConfirmation = lazy(() => import('../../pages/OrderConfirmation'));

function App()  {
  return (
    <AuthProvider>
    <CartProvider>
    <WishlistProvider>
      <BrowserRouter>
        <div className="App">
            <Header />
              <Suspense fallback={<Loading message="Cargando página..." />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/course/:courseId" element={<Course />} />
                  <Route path="/search" element={<SearchResult />} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute
                      redirectTo="/login"
                      >
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute redirectTo="/login">
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                    <ProtectedRoute>
                      <Checkout></Checkout>
                    </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                    }
                  />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                </Routes>
              </Suspense>
          <Footer />
        </div>
      </BrowserRouter>
    </WishlistProvider>
    </CartProvider>
    </AuthProvider>
  );
};

export default App;
