'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { fetchItems, handleDelete, handleUpdateQuantity, handleUpdateItem } from './utils';
import { Item, Image } from './types';

export default function AdminPage() {
  const [form, setForm] = useState<Omit<Item, '_id'>>({
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
  const [items, setItems] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchItems(setItems);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'size') {
      setForm({ ...form, [name]: value.split(',') });
    } else if (name === 'imageUrl') {
      setForm({ ...form, images: [{ url: value, main: true }] });
    } else {
      setForm({ ...form, [name]: value });
    }
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
      images: [],
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
      images: item.images,
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
      images: item.images,
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
      <h1 className="text-center text-2xl font-bold mb-4">Inventory Management</h1>
      <br/>
      <h2 className="text-center text-2xl font-bold mb-4">Add New Clothing Item to Inventory</h2>
      <p className="text-center text-gray-400 mb-4 py-2">Scroll down or minimize form to view inventory →</p>
      <button className="mb-4 px-2 py-1 bg-blue-500 text-white rounded border border-white" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Minimize Form' : 'Expand Form'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col">
            <label className="block">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full px-2 py-1 border rounded bg-gray-700 text-white"
              required placeholder="Name" />
          </div>
        <div className="flex flex-col">
        <label className="block">Size</label>
            <input type="text" name="size" value={form.size.join(',')} onChange={handleChange} placeholder="Size (comma separated)" className="w-full px-2 py-1 border rounded bg-gray-700 text-white" required />
            </div>
        <div className="flex flex-col">
        <label className="block">Main Color</label>
          <input name="mainColor" value={form.mainColor} onChange={handleChange} placeholder="Main Color" className="w-full px-2 py-2 border rounded bg-gray-700 text-white" required />
          </div>
          <div className="flex flex-col">
          <label className="block">Price</label>
          <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="w-full px-2 py-2 border rounded bg-gray-700 text-white" required/>
          </div>
            <div className="flex flex-col">
            <label className="block">Description</label>
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-2 py-2 border rounded bg-gray-700 text-white" required/>
            </div>
            <div className="flex flex-col">
          <label className="block">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-2 py-2 border rounded bg-gray-700 text-white" required>
            <option value="mens">Mens</option>
            <option value="womens">Womens</option>
            <option value="unisex">Unisex</option>
          </select>
            </div>
            <div className="flex flex-col">
            <label className="block">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full px-2 py-2 border rounded bg-gray-700 text-white" required>
            <option value="shirt">Shirt</option>
            <option value="pants">Pants</option>
            <option value="dress">Dress</option>
            <option value="shorts">Shorts</option>
            <option value="t-shirt">T-shirt</option>
            <option value="t-shirt">Swimwear</option>
          </select>
          </div>
          <div className="flex flex-col">
            <label className="block">Style</label>
          <input name="style" value={form.style} onChange={handleChange} placeholder="Style" className="w-full px-2 py-2 border rounded bg-gray-700 text-white" required/>
            </div>
            <div className="flex flex-col">
            <label className="block">Sale Discount</label>
          <input name="saleDiscount" value={form.saleDiscount} onChange={handleChange} placeholder="Sale Discount" type="number" className="w-full px-4 py-2 border rounded bg-gray-700 text-white"/>
            </div>
            <div className="flex flex-col">
            <label className="block">Quantity</label>
          <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" type="number" className="w-full px-2 py-2 border rounded bg-gray-700 text-white" required/>
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
          <div className="col-span-full">
            <button type="submit" className="px-2 py-2 mb-5 bg-blue-500 text-white rounded border border-white">
              {isUpdating ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Main Color</th>
            <th>Price</th>
            <th>Description</th>
            <th>Gender</th>
            <th>Category</th>
            <th>Style</th>
            <th>Quantity</th>
            <th>Images</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={11}>No items found</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.size.join(', ')}</td>
                <td>{item.mainColor}</td>
                <td>{item.price}</td>
                <td>{item.description}</td>
                <td>{item.gender}</td>
                <td>{item.category}</td>
                <td>{item.style}</td>
                <td>{item.quantity}</td>
                <td>
                  {item.images && item.images.length > 0 ? (
                    item.images.map((image, index) => (
                      <img key={index} src={image.url} alt={`Image ${index + 1}`} width="50" />
                    ))
                  ) : (
                    'No Image'
                  )}
                </td>
                <td>
                  <button onClick={() => handlePrepopulate(item)}>Update</button>
                  <button onClick={() => handlePrepopulateSimilar(item)} data-tooltip-target="tooltip-bottom" data-tooltip-placement="bottom">Similar</button>
                  <div id="tooltip-bottom" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">Use<div className="tooltip-arrow" data-popper-arrow></div>
                  </div>
                  <button onClick={() => openDeleteModal(item._id!)}>Delete</button>
                  <button onClick={() => handleUpdateQuantity(item._id!, 1, items, setItems)}>Increase Quantity</button>
                  <button onClick={() => handleUpdateQuantity(item._id!, -1, items, setItems)}>Decrease Quantity</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showDeleteModal && (
        <div>
          <p>Are you sure you want to delete this item?</p>
          <button onClick={closeDeleteModal}>Cancel</button>
          <button onClick={confirmDelete}>Confirm</button>
        </div>
      )}
    </div>
  );
}
