'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import ItemCard, { Item } from '../components/ItemCard';
import BrandCard from '../components/BrandCard';

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
          setItems((prevItems) => {
            const newItems = fetchedItems.filter(
              (item) => !prevItems.some((prevItem) => prevItem.itemId === item.itemId)
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
    <div className="min-h-screen p-0">
      <div
        className="relative h-80 sm:h-96 md:h-[35rem] lg:h-[40rem] w-full mb-8 flex items-start justify-center bg-cover bg-top"
        style={{
          backgroundImage: "url('/Hero1.jpg')",
        }}
      >
        <BrandCard />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {items.map((item: Item) => (
            <div key={item.itemId} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
