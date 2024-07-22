'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Invoice from '../../components/ui/invoice';
import { useSession } from 'next-auth/react';

interface Errors {
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

const CheckoutPage = () => {
  const { state, dispatch } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateAddress, setStateAddress] = useState('');
  const [zip, setZip] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    dispatch({ type: 'TOGGLE_CART_VISIBILITY', payload: false });
  }, [dispatch]);

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!address) newErrors.address = 'Address is required';
    if (!city) newErrors.city = 'City is required';
    if (!stateAddress) newErrors.state = 'State is required';
    if (!zip) newErrors.zip = 'ZIP code is required';
    if (zip && !/^\d{5}$/.test(zip)) newErrors.zip = 'ZIP code must be 5 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session?.user?.id,
            items: state.items.map(item => ({
              itemId: item.itemId,
              name: item.name,
              size: item.size,
              mainColor: item.mainColor,
              price: item.price,
              quantity: item.quantity,
            })),
          }),
        });

        if (response.ok) {
          setIsCompleted(true);
          dispatch({ type: 'CLEAR_CART' });
        } else {
          console.error('Error creating order:', await response.json());
        }
      } catch (error) {
        console.error('Error creating order:', error);
      }
    }
  };

  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, router]);

  if (isCompleted) {
    return (
      <Invoice formData={{ name, email, address, city, state: stateAddress, zip }} cartItems={state.items} />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-6">Checkout</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl mb-4">Order Summary</h2>
        <ul>
          {state.items.map((item) => (
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
          <p>${state.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-white text-black"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-white text-black"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-white text-black"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-white text-black"
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">State</label>
          <select
            value={stateAddress}
            onChange={(e) => setStateAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-white text-black"
          >
            <option value="">Select state</option>
            {[
              'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
              'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
              'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
              'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
              'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
            ].map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">ZIP</label>
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-white text-black"
          />
          {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded"
        >
          Complete Purchase
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
