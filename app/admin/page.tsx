'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Item } from './types';
import { fetchItems, handleDelete, handleUpdateQuantity, handleUpdateItem } from './utils';

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

  const [items, setItems] = useState<Item[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchItems(setItems);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleMainImageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMainImageIndex(Number(e.target.value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
  
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, item as string));
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
      if (currentId) {
        // Use handleUpdateItem for updates
        await handleUpdateItem(currentId, form, items, setItems);
        alert(`Item updated successfully! Item ID: ${currentId}`);
      } else {
        // Use the existing API endpoint for creating new items
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Upload and save successful:', data);
          setCreatedItemId(data.item._id);
          setItems([...items, data.item]);
          alert(`Item added successfully! Item ID: ${data.item._id}`);
        } else {
          console.error('Error uploading and saving item:', response.statusText);
          alert('Error uploading and saving item. Please try again.');
        }
      }
      // Reset form and images
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
      setIsUpdating(false);
      setCurrentId(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error. Please try again.');
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
  const baseUrl = 'https://maison-elysee.b-cdn.net/';


  return (
    <div className="max-w-5xl w-full mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4 text-yellow-200">Inventory Management</h1>
      <br/>
      <h2 className="text-center text-2xl font-bold mb-4 text-orange-300">Add New Clothing Item to Inventory</h2>
      <p className="text-center text-gray-400 mb-4 py-2">Scroll down or minimize form to view inventory →</p>
      {createdItemId && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">Item created successfully! Item ID: {createdItemId}</span>
        </div>
      )}
      <button onClick={() => setShowForm(!showForm)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
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
            <label className="block">Quantity</label>
          <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" type="number" className="w-full px-2 py-2 border rounded bg-gray-700 text-white" required/>
            </div>
            <div className="flex flex-col">
            <label className="block">Sale Discount</label>
          <input name="saleDiscount" value={form.saleDiscount} onChange={handleChange} placeholder="Sale Discount" type="number" className="w-full px-4 py-2 border rounded bg-gray-700 text-white"/>
            </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300" htmlFor="images">
              Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {images.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mainImageIndex">
                Main Image Index
              </label>
              <select
                id="mainImageIndex"
                name="mainImageIndex"
                value={mainImageIndex}
                onChange={handleMainImageChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {images.map((_, index) => (
                  <option key={index} value={index}>
                    Image {index + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="col-span-full">
            <button type="submit" className="px-2 py-2 mb-5 bg-blue-500 text-white rounded border border-white">
              {isUpdating ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      )}
      {/* Inventory */}
      <h2 className="text-center text-2xl font-bold mb-4 text-orange-300">View or Modify Inventory</h2>
      <table className="min-w-full text-xs text-black bg-gray-400 border-2 border-black rounded-lg">
        <thead>
          <tr>
            <th className="p-1">Name</th>
            <th className="p-1">Size</th>
            <th className="p-2">Main Color</th>
            <th className="p-2">Price</th>
            <th className="p-2">Description</th>
            <th className="p-2">Gender</th>
            <th className="p-2">Category</th>
            <th className="p-2">Style</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Images</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center py-4">No items found</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item._id} className="border-2 border-black">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.size.join(', ')}</td>
                <td className="p-2">{item.mainColor}</td>
                <td className="p-2">{item.price}</td>
                <td className="p-2">{item.description}</td>
                <td className="p-2">{item.gender}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.style}</td>
                <td className="p-2 flex-col">{item.quantity }   <button onClick={() => handleUpdateQuantity(item._id!, 1, items, setItems)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2 border-2 border-gray-600">+</button>
                    <button onClick={() => handleUpdateQuantity(item._id!, -1, items, setItems)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold ml-3 mb-1 mt-2  py-1 px-2 rounded border-2 border-gray-600">-</button></td>
                <td className="p-2">
                  {item.images && item.images.length > 0 ? (
                    item.images.map((image, index) => (
                      <img key={index} src={`${baseUrl}${image.url}`} alt={`Image ${index + 1}`} width="50" className="hover:scale-150 transition-all duration-500 cursor-pointer"/>
                    ))
                  ) : (
                    'No Image'
                  )}
                </td>
                  {/* Buttons */}
                <td className="py-1 flex-col">
                  <button onClick={() => handlePrepopulate(item)} className="m-2 bg-yellow-500 hover:bg-yellow-700 text-gray-100 font-bold py-1 px-1 rounded border-2 border-gray-600">Update</button>
                  <div className="tooltip" data-tip="Click to populate form and edit for similar new item">
                  <button onClick={() => handlePrepopulateSimilar(item)} className="m-2 bg-green-500 hover:bg-green-700 text-gray-100 font-bold py-1 px-1 rounded border-2 border-gray-600">Similar</button></div>
                  <button onClick={() => openDeleteModal(item._id!)} className="m-2 bg-red-500 hover:bg-red-700 text-gray-100 font-bold py-1 px-1 rounded border-2 border-gray-600">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete item
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this item? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={confirmDelete} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Delete
                </button>
                <button onClick={closeDeleteModal} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
