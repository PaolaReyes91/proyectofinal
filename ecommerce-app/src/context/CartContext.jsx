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
          if (backendCart?.items) {
            dispatch({ type: CART_ACTIONS.INIT, payload: backendCart.items });
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
      dispatch({ type: CART_ACTIONS.ADD, payload: { ...product, quantity } });

      syncToBackend(async () => {
        await cartService.addToCart(user._id, product._id, quantity);
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
