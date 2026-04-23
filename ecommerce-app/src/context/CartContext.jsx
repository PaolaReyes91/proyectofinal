import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import * as cartService from "../services/cartService";
import { CART_ACTIONS, cartInitialState, cartReducer } from "./cartReducer";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);
  const [syncState, setSyncState] = useState({
    syncing: false,
    lastSyncError: null,
  });

const { isAuth, user } = useAuth();

  // Funciones auxiliares:
  const getTotalItems = useCallback(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items],
  );
  const getTotalPrice = useCallback(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items],
  );

  useEffect(() => {
    const initializeCart = async () => {
      if (isAuth && user?._id) {
        try {
          const backendCart = await cartService.getCart(user._id);
          // El backend devuelve 'products', no 'items'
          if (backendCart?.products) {
            dispatch({ type: CART_ACTIONS.INIT, payload: backendCart.products });
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    initializeCart();
  }, [isAuth, user?._id]);

  const syncToBackend = useCallback(
    async (syncFn) => {
      if (!isAuth) return;

      setSyncState({ syncing: true, lastSyncError: null });
      try {
        await syncFn();
        setSyncState({ syncing: false, lastSyncError: null });
      } catch (error) {
        console.error(error);
        setSyncState({ syncing: false, lastSyncError: error });
      }
    },
    [isAuth],
  );

  const removeFromCart = useCallback(
    (productId) => {
      console.log("Removing product with ID:", productId);
      dispatch({ type: CART_ACTIONS.REMOVE, payload: productId });

      syncToBackend(async () => {
        await cartService.removeToCart(user._id, productId);
      });
    },
    [syncToBackend, user],
  );

  const updateQuantity = useCallback(
    (productId, newQuantity) => {
      dispatch({
        type: CART_ACTIONS.SET_QTY,
        payload: { _id: productId, quantity: newQuantity },
      });

      syncToBackend(async () => {
        await cartService.updateCartItem(user._id, productId, newQuantity);
      });
    },
    [syncToBackend, user],
  );

  const addToCart = useCallback(
    (product, quantity = 1) => {
      const productId = product._id || product.id;
      dispatch({ type: CART_ACTIONS.ADD, payload: { ...product, _id: productId, quantity } });

      syncToBackend(async () => {
        await cartService.addToCart(user._id, productId, quantity);
      });
    },
    [syncToBackend, user],
  );

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR });

    syncToBackend(async () => {
      await cartService.clearCart(user._id);
    });
  }, [syncToBackend, user]);

  const value = useMemo(
    () => ({
      cartItems: state.items,
      total: getTotalPrice(),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      syncState,
    }),
    [
      state.items,
      getTotalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      syncState,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart debe ser usado dentro de CartProvider");
  return context;
}
