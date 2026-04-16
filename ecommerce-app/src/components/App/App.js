import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from "../../context/CartContext";
import { AuthProvider } from '../../context/AuthContext';
import { WishlistProvider } from '../../context/WishlistContext';
import Header from "../../layout/Header/Header"
import Footer from "../../layout/Footer/Footer";
import Cart from '../../pages/Cart';
import Checkout from '../../pages/Checkout';
import Home from "../../pages/Home"; 
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import OrderConfirmation from '../../pages/OrderConfirmation';
import Course from '../../pages/Course';
import Profile from "../../pages/Profile";
import ProtectedRoute from '../../pages/ProtectedRoute';
import Orders from '../../pages/Orders';
import Wishlist from '../../pages/Wishlist';
import Settings from '../../pages/Settings';
import Help from '../../pages/Help';
import Contact from '../../pages/Contact';
import SearchResult from '../../pages/SearchResult';
import CategoryPage from '../../pages/CategoryPage';

function App()  {
  return (
    <AuthProvider>
    <CartProvider>
    <WishlistProvider>
      <BrowserRouter>
        <div className="App">
            <Header />
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
                    //allowedRoles={["admin", "customer", "cliente"]}
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
          <Footer />
        </div>
      </BrowserRouter>
    </WishlistProvider>
    </CartProvider>
    </AuthProvider>
  );
};

export default App;
