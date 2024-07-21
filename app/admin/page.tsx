'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { fetchItems, handleDelete, handleUpdateQuantity, handleUpdateItem } from './utils';
import { Item } from './types';

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchItems(setItems);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'size' ? value.split(',') : value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isUpdating && currentId) {
      await handleUpdateItem(currentId, form, items, setItems);
      setIsUpdating(false);
      setCurrentId(null);
    } else {
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

        // Update items list
        setItems([...items, data.data]);
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }

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
    setIsUpdating(true);
    setCurrentId(item._id!);
  };

  const handlePrepopulateSimilar = (item: Item) => {
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
    setIsUpdating(false);
    setCurrentId(null);
  };

  const openDeleteModal = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await handleDelete(itemToDelete, items, setItems);
      closeDeleteModal();
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Add New Clothing Item to Inventory</h1>
      <p className="text-center text-gray-400 mb-4 py-2">Scroll down or minimize form to view inventory &gt;&gt;&gt;</p>
      <button
        className="mb-1 px-2 py-1 bg-blue-500 text-white rounded border border-white"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Minimize Form' : 'Expand Form'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Size (comma separated)</label>
            <input
              type="text"
              name="size"
              value={form.size.join(',')}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Main Color</label>
            <input
              type="text"
              name="mainColor"
              value={form.mainColor}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
              required
            >
              <option value="mens">Mens</option>
              <option value="womens">Womens</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
              required
            >
              <option value="shirt">Shirt</option>
              <option value="pants">Pants</option>
              <option value="dress">Dress</option>
              <option value="shorts">Shorts</option>
              <option value="t-shirt">T-shirt</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Style</label>
            <input
              type="text"
              name="style"
              value={form.style}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Sale Discount</label>
            <input
              type="number"
              name="saleDiscount"
              value={form.saleDiscount}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="col-span-full">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded border border-white">
              {isUpdating ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Inventory Items</h2>
        <ul>
          {items.map((item) => (
            <li key={item._id} className="flex justify-between items-center border-b py-2">
              <div>
                <p>Name: {item.name}</p>
                <p>Quantity: {item.quantity}</p><p>Price: ${item.price}</p>
              </div>
              <div className="flex flex-wrap my-5 space-x-2">
                <button
                  className="mb-4 ml-2 px-1 py-2 bg-red-500 text-white rounded border border-white"
                  onClick={() => openDeleteModal(item._id!)} // The `!` operator asserts that the value is not undefined
                >
                  Delete
                </button>
                <button
                  className="mb-4 px-2 py-2 bg-green-500 text-white rounded border border-white"
                  onClick={() => handleUpdateQuantity(item._id!, 1, items, setItems)} // The `!` operator asserts that the value is not undefined
                >
                  +
                </button>
                <button
                  className="mb-4  px-3 py-2 bg-yellow-500 text-white rounded border border-white"
                  onClick={() => handleUpdateQuantity(item._id!, -1, items, setItems)} // The `!` operator asserts that the value is not undefined
                >
                  -
                </button>
                <button
                  className="mb-4 px-2 py-2 bg-blue-500 text-white rounded border border-white"
                  onClick={() => handlePrepopulate(item)}
                >
                  Update
                </button>
                <button
                  className="mb-4 px-2 py-2 bg-blue-500 text-white rounded border border-white"
                  onClick={() => handlePrepopulateSimilar(item)}
                >
                  Similar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-black">Are you sure you want to delete this item?</h2>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={confirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
