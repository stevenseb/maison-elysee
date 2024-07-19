'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import ItemCard from '../components/ItemCard';

interface Item {
  _id: string;
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

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`/api/items?page=${page}`);
        const fetchedItems: Item[] = res.data.data;

        if (fetchedItems.length > 0) {
          // Check for duplicates before updating state
          setItems((prevItems) => {
            const newItems = fetchedItems.filter(
              (item) => !prevItems.some((prevItem) => prevItem._id === item._id)
            );
            return [...prevItems, ...newItems];
          });
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [page]);

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-4xl text-center py-8">Clothing Store</h1>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item: Item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
