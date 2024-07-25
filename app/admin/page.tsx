'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Item, ItemFormState } from './types';
import { fetchItems, handleDelete, handleUpdateQuantity, handleUpdateItem } from './utils';

export default function AdminPage() {
  const [form, setForm] = useState<ItemFormState>({
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
      } else {
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
    <div>
      <h1>Add New Clothing Item to Inventory</h1>
      {createdItemId && (
        <p>Item created successfully! Item ID: {createdItemId}</p>
      )}
      <p>Scroll down or minimize form to view inventory </p>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Minimize Form' : 'Expand Form'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="size">Size (comma separated)</label>
            <input
              type="text"
              id="size"
              name="size"
              value={form.size.join(',')}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="mainColor">Main Color</label>
            <input
              type="text"
              id="mainColor"
              name="mainColor"
              value={form.mainColor}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="mens">Mens</option>
              <option value="womens">Womens</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="shirt">Shirt</option>
              <option value="pants">Pants</option>
              <option value="dress">Dress</option>
              <option value="shorts">Shorts</option>
              <option value="t-shirt">T-shirt</option>
            </select>
          </div>
          <div>
            <label htmlFor="style">Style</label>
            <input
              type="text"
              id="style"
              name="style"
              value={form.style}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="images">Images</label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              onChange={handleImageChange}
            />
          </div>
          <div>
            <label htmlFor="mainImageIndex">Main Image Index</label>
            <input
              type="number"
              id="mainImageIndex"
              name="mainImageIndex"
              value={mainImageIndex}
              onChange={(e) => handleMainImageChange(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
            />
            {images.map((_, index) => (
              <div key={index}>
                <label>Image {index + 1}</label>
              </div>
            ))}
          </div>
          <div>
            <label htmlFor="saleDiscount">Sale Discount</label>
            <input
              type="number"
              id="saleDiscount"
              name="saleDiscount"
              value={form.saleDiscount}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Add Item</button>
        </form>
      )}
    </div>
  );
}
