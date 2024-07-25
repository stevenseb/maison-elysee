'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Item, Image } from './types';
import { fetchItems, handleDelete, handleUpdateQuantity, handleUpdateItem } from './utils';

export default function AdminPage() {
  const [form, setForm] = useState<Item>({
    _id: '',
    name: '',
    size: [],
    mainColor: '',
    price: 0,
    description: '',
    gender: 'mens',
    category: 'shirt',
    style: '',
    images: [],
    saleDiscount: 0,
    quantity: 1,
  });

  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: name === 'size' ? value.split(',') :
               name === 'price' || name === 'saleDiscount' || name === 'quantity' ? Number(value) :
               value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleMainImageChange = (index: number) => {
    setMainImageIndex(index);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, item));
      } else if (key !== 'images') {
        formData.append(key, String(value));
      }
    });

    if (images.length > 0) {
      formData.append('mainImage', images[mainImageIndex]);
      images.forEach((image, index) => {
        if (index !== mainImageIndex) {
          formData.append('additionalImages', image);
        }
      });
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload and save successful:', data);
        setCreatedItemId(data.item._id);
        setForm({
          _id: '',
          name: '',
          size: [],
          mainColor: '',
          price: 0,
          description: '',
          gender: 'mens',
          category: 'shirt',
          style: '',
          images: [],
          saleDiscount: 0,
          quantity: 1,
        });
        setImages([]);
        setMainImageIndex(0);
        alert(`Item added successfully! Item ID: ${data.item._id}`);
      } else {
        console.error('Error uploading and saving item:', response.statusText);
        alert('Error uploading and saving item. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Clothing Item to Inventory</h1>
      {createdItemId && (
        <p className="text-green-500 mb-4">Item created successfully! Item ID: {createdItemId}</p>
      )}
      <p className="mb-4">Scroll down or minimize form to view inventory &rarr;&rarr;</p>
      <button 
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {showForm ? 'Minimize Form' : 'Expand Form'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-300">Size (comma separated)</label>
            <input
              type="text"
              id="size"
              name="size"
              value={form.size.join(',')}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <div>
            <label htmlFor="mainColor" className="block text-sm font-medium text-gray-300">Main Color</label>
            <input
              type="text"
              id="mainColor"
              name="mainColor"
              value={form.mainColor}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-300">Gender</label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="mens">Mens</option>
              <option value="womens">Womens</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="shirt">Shirt</option>
              <option value="pants">Pants</option>
              <option value="dress">Dress</option>
              <option value="shorts">Shorts</option>
              <option value="t-shirt">T-shirt</option>
            </select>
          </div>
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-300">Style</label>
            <input
              type="text"
              id="style"
              name="style"
              value={form.style}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-300">Images</label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              onChange={handleImageChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <div>
            <label htmlFor="mainImageIndex" className="block text-sm font-medium text-gray-300">Main Image Index</label>
            <input
              type="number"
              id="mainImageIndex"
              name="mainImageIndex"
              value={mainImageIndex}
              onChange={(e) => handleMainImageChange(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            {images.map((_, index) => (
              <div key={index} className="mt-2">
                <label className="text-sm text-gray-300">Image {index + 1}</label>
              </div>
            ))}
          </div>
          <div>
            <label htmlFor="saleDiscount" className="block text-sm font-medium text-gray-300">Sale Discount</label>
            <input
              type="number"
              id="saleDiscount"
              name="saleDiscount"
              value={form.saleDiscount}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <button 
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Item
          </button>
        </form>
      )}
    </div>
  );
}
