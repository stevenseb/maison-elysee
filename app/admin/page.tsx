'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface Image {
  url: string;
  main: boolean;
}

interface Item {
  name: string;
  size: string[];
  mainColor: string;
  price: number;
  description: string;
  gender: 'mens' | 'womens' | 'unisex';
  category: 'shirt' | 'pants' | 'dress' | 'shorts' | 't-shirt';
  style: string;
  images: Image[];
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
    images: [],
    saleDiscount: 0,
    quantity: 1,
  });
  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('mainColor', form.mainColor);
    formData.append('price', String(form.price));
    formData.append('description', form.description);
    formData.append('gender', form.gender);
    formData.append('category', form.category);
    formData.append('style', form.style);
    formData.append('saleDiscount', String(form.saleDiscount));
    formData.append('quantity', String(form.quantity));
    form.size.forEach((size) => formData.append('size', size));

    if (images.length > 0) {
      formData.append('mainImage', images[mainImageIndex]);
      images.forEach((image, index) => {
        if (index !== mainImageIndex) {
          formData.append('additionalImages', image);
        }
      });
    }

    try {
      // Upload images and save item data
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload and save successful:', data);
        setCreatedItemId(data.item._id);

        // Reset form and state
        setForm({
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

        // Optionally, show a success message to the user
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
    <div className="max-w-3xl w-full mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Add New Clothing Item to Inventory</h1>
      {createdItemId && (
        <p className="text-center text-green-500 mb-4">
          Item created successfully! Item ID: {createdItemId}
        </p>
      )}
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
          <label className="block mb-2">Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <div className="flex flex-col col-span-full">
          <label className="block mb-2">Main Image Index</label>
          <select
            value={mainImageIndex}
            onChange={(e) => handleMainImageChange(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
          >
            {images.map((_, index) => (
              <option key={index} value={index}>
                Image {index + 1}
              </option>
            ))}
          </select>
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
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
}
