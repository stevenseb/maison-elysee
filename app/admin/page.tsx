'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface Item {
  _id?: string;
  name: string;
  size: string[];
  mainColor: string;
  price: number;
  description: string;
  gender: 'mens' | 'womens' | 'unisex';
  category: 'shirt' | 'pants' | 'dress' | 'shorts' | 't-shirt';
  style: string;
  imageUrl: string;
  saleDiscount?: number;
  quantity: number;
}

export default function AdminPage() {
  const [form, setForm] = useState<Item>({
    name: '',
    size: [],
    mainColor: '',
    price: 0,
    description: '',
    gender: 'mens',
    category: 'shirt',
    style: '',
    imageUrl: '',
    saleDiscount: 0,
    quantity: 1,
  });
  const [items, setItems] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items');
      const data = await response.json();
      setItems(data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'size' ? value.split(',') : value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      console.log('Item added:', data);

      // Clear the form
      setForm({
        name: '',
        size: [],
        mainColor: '',
        price: 0,
        description: '',
        gender: 'mens',
        category: 'shirt',
        style: '',
        imageUrl: '',
        saleDiscount: 0,
        quantity: 1,
      });

      // Update items list
      setItems([...items, data.data]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/items?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdateQuantity = async (id: string, delta: number) => {
    try {
      const item = items.find((item) => item._id === id);
      if (!item) return;
      const newQuantity = item.quantity + delta;
      const response = await fetch(`/api/items?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const updatedItem = await response.json();
      setItems(items.map((item) => (item._id === id ? updatedItem.data : item)));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handlePrepopulate = (item: Item) => {
    setForm({
      name: item.name,
      size: item.size,
      mainColor: item.mainColor,
      price: item.price,
      description: item.description,
      gender: item.gender,
      category: item.category,
      style: item.style,
      imageUrl: item.imageUrl,
      saleDiscount: item.saleDiscount ?? 0,
      quantity: item.quantity,
    });
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Add New Clothing Item</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Minimize Form' : 'Expand Form'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Size (comma separated)</label>
            <input
              type="text"
              name="size"
              value={form.size.join(',')}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Main Color</label>
            <input
              type="text"
              name="mainColor"
              value={form.mainColor}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="mens">Mens</option>
              <option value="womens">Womens</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="shirt">Shirt</option>
              <option value="pants">Pants</option>
              <option value="dress">Dress</option>
              <option value="shorts">Shorts</option>
              <option value="t-shirt">T-shirt</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Style</label>
            <input
              type="text"
              name="style"
              value={form.style}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Sale Discount</label>
            <input
              type="number"
              name="saleDiscount"
              value={form.saleDiscount}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Add Item
          </button>
        </form>
      )}

      <h2 className="text-2xl font-bold mt-8">Inventory Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id} className="flex justify-between items-center border-b py-2">
            <div>
              <p>Name: {item.name}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <div>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded mr-2"
                onClick={() => handleDelete(item._id!)} // The `!` operator asserts that the value is not undefined
              >
                Delete
              </button>
              <button
                className="px-2 py-1 bg-green-500 text-white rounded mr-2"
                onClick={() => handleUpdateQuantity(item._id!, 1)} // The `!` operator asserts that the value is not undefined
              >
                +
              </button>
              <button
                className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                onClick={() => handleUpdateQuantity(item._id!, -1)} // The `!` operator asserts that the value is not undefined
              >
                -
              </button>
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded"
                onClick={() => handlePrepopulate(item)}
              >
                Similar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
