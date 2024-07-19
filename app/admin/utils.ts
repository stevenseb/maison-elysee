import { Item } from './types';

export const fetchItems = async (setItems: (items: Item[]) => void) => {
  try {
    const response = await fetch('/api/items');
    const data = await response.json();
    setItems(data.data);
  } catch (error) {
    console.error('Error fetching items:', error);
  }
};

export const handleDelete = async (id: string, items: Item[], setItems: (items: Item[]) => void) => {
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

export const handleUpdateQuantity = async (id: string, delta: number, items: Item[], setItems: (items: Item[]) => void) => {
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

export const handleUpdateItem = async (id: string, updatedItem: Item, items: Item[], setItems: (items: Item[]) => void) => {
  try {
    const response = await fetch(`/api/items?id=${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    }

    const data = await response.json();
    setItems(items.map((item) => (item._id === id ? data.data : item)));
  } catch (error) {
    console.error('Error updating item:', error);
  }
};
