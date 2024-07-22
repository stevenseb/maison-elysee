'use client';
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface CartItem {
  itemId: string;
  name: string;
  size: string;
  mainColor: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isVisible: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string, size: string, mainColor: string } }
  | { type: 'INCREASE_QUANTITY'; payload: { itemId: string, size: string, mainColor: string } }
  | { type: 'DECREASE_QUANTITY'; payload: { itemId: string, size: string, mainColor: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'REPLACE_CART'; payload: CartItem[] }
  | { type: 'TOGGLE_CART_VISIBILITY'; payload: boolean };

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.itemId === action.payload.itemId &&
          item.size === action.payload.size &&
          item.mainColor === action.payload.mainColor
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: updatedItems };
      } else {
        return { ...state, items: [...state.items, action.payload] };
      }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            item.itemId !== action.payload.itemId ||
            item.size !== action.payload.size ||
            item.mainColor !== action.payload.mainColor
        ),
      };

    case 'INCREASE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.itemId === action.payload.itemId &&
          item.size === action.payload.size &&
          item.mainColor === action.payload.mainColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };

    case 'DECREASE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.itemId === action.payload.itemId &&
            item.size === action.payload.size &&
            item.mainColor === action.payload.mainColor
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'REPLACE_CART':
      return { ...state, items: action.payload };

    case 'TOGGLE_CART_VISIBILITY':
      return { ...state, isVisible: action.payload };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isVisible: false });

  // Persist cart to session storage
  useEffect(() => {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'REPLACE_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  // Clear cart after 30 minutes of inactivity
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_CART' });
        alert('Cart has been cleared due to 30 minutes of inactivity.');
      }, 30 * 60 * 1000); // 30 minutes
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [dispatch]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
