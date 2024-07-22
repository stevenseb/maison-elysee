// app/orders/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface OrderItem {
  itemId: string;
  name: string;
  size: string;
  mainColor: string;
  price: number;
  quantity: number;
}

interface Order {
  orderId: string;
  userId: string;
  orderDate: string;
  shippingDate: string;
  items: OrderItem[];
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders');
        setOrders(res.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order.orderId} className="bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 className="text-2xl mb-4">Order {order.orderId}</h2>
            <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
            <p>Shipping Date: {new Date(order.shippingDate).toLocaleDateString()}</p>
            <div className="bg-gray-700 p-4 rounded-lg mt-4">
              <h3 className="text-xl mb-4">Items</h3>
              {order.items.map(item => (
                <div key={`${item.itemId}-${item.size}-${item.mainColor}`} className="mb-4">
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
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
