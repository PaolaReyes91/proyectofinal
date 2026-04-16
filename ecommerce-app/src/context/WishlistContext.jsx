import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  getWishlist,
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi,
  checkProductInWishlist,
  clearWishlist as clearWishlistApi,
  moveToCart
} from "../services/wishlistService";
import { useCart } from "./CartContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isAuth } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    if (!isAuth) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getWishlist();
      if (data.wishList && data.wishList.products) {
        setWishlistItems(data.wishList.products.map(item => item.product).filter(Boolean));
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuth]);

  useEffect(() => {
    if (isAuth) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuth, fetchWishlist]);

  const addToWishlist = async (product) => {
    if (!isAuth) {
      throw new Error("Debes iniciar sesión para agregar a favoritos");
    }

    try {
      const productId = product._id || product.id;
      await addToWishlistApi(productId);
      await fetchWishlist();
    } catch (err) {
      if (err.response?.status === 400) {
        throw new Error("El producto ya está en tu lista de deseos");
      }
      throw err;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuth) return;

    try {
      await removeFromWishlistApi(productId);
      setWishlistItems(prev => prev.filter(item => (item._id || item.id) !== productId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      throw err;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item._id || item.id) === productId);
  };

  const moveToCartHandler = async (product) => {
    if (!isAuth) return;

    try {
      const productId = product._id || product.id;
      await moveToCart(productId);
      addToCart(product, 1);
      await fetchWishlist();
    } catch (err) {
      console.error("Error moving to cart:", err);
      throw err;
    }
  };

  const clearWishlist = async () => {
    if (!isAuth) return;

    try {
      await clearWishlistApi();
      setWishlistItems([]);
    } catch (err) {
      console.error("Error clearing wishlist:", err);
      throw err;
    }
  };

  const value = {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    moveToCart: moveToCartHandler,
    clearWishlist,
    refreshWishlist: fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist debe ser usado dentro de WishlistProvider");
  }
  return context;
}
