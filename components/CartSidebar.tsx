'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const CartSidebar = () => {
  const { state, dispatch } = useCart();

  const handleCloseCart = () => {
    dispatch({ type: 'TOGGLE_CART_VISIBILITY', payload: false });
  };

  const handleOpenCart = () => {
    dispatch({ type: 'TOGGLE_CART_VISIBILITY', payload: true });
  };

  const handleCheckout = () => {
    dispatch({ type: 'TOGGLE_CART_VISIBILITY', payload: false });
  };

  return (
    <>
      <div className={`fixed right-0 top-0 h-full z-50 bg-gray-900 text-white shadow-lg transform transition-transform ${state.isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl">Shopping Cart</h2>
          <button onClick={handleCloseCart} className="text-white text-xl">&times;</button>
        </div>
        <div className="p-4">
          {state.items.length === 0 ? (
            <p className="text-xs">Your cart is empty</p>
          ) : (
            <>
              {state.items.map((item) => (
                <div key={`${item._id}-${item.size}-${item.mainColor}`} className="mb-4">
                  <div className="flex justify-between">
                    <p className="pr-4 text-orange-300 text-xs">{item.name}</p>
                    <p className="text-orange-500 text-xs">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs">{item.size}</p>
                    <p className="text-xs">{item.mainColor}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs">Quantity: {item.quantity}</p>
                    <div>
                      <button onClick={() => dispatch({ type: 'INCREASE_QUANTITY', payload: { _id: item._id, size: item.size, mainColor: item.mainColor } })} className="text-xs px-1">&uarr;</button>
                      <button onClick={() => dispatch({ type: 'DECREASE_QUANTITY', payload: { _id: item._id, size: item.size, mainColor: item.mainColor } })} className="text-xs px-1">&darr;</button>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/checkout">
                <button
                  onClick={handleCheckout}
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  Checkout
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
      {state.items.length > 0 && (
        <div
          className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white px-2 py-1 cursor-pointer text-xs"
          onClick={state.isVisible ? handleCloseCart : handleOpenCart}
        >
          {state.isVisible ? 'Close >' : '< Open'}
        </div>
      )}
    </>
  );
};

export default CartSidebar;
