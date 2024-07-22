'use client';

import React from 'react';

interface InvoiceProps {
  formData: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  cartItems: any[];
}

const Invoice: React.FC<InvoiceProps> = ({ formData, cartItems }) => {
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Thank You for Your Purchase!</h2>
      <p>Your order will be shipped as soon as possible.</p>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-4">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={`${item.itemId}-${item.size}-${item.mainColor}`} className="mb-4">
              <div className="flex justify-between">
                <p>{item.name}</p>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>{item.size}</p>
                <p>{item.mainColor}</p>
              </div>
              <div className="flex justify-between">
                <p>Quantity: {item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold text-lg">
          <p>Total</p>
          <p>${total}</p>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-4">
        <h3 className="text-xl font-bold mb-4">Shipping Information</h3>
        <p>Name: {formData.name}</p>
        <p>Email: {formData.email}</p>
        <p>Address: {formData.address}</p>
        <p>City: {formData.city}</p>
        <p>State: {formData.state}</p>
        <p>ZIP Code: {formData.zip}</p>
      </div>
    </div>
  );
};

export default Invoice;
