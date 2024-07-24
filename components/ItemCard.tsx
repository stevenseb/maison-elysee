'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export interface Image {
  url: string;
  main: boolean;
}

export interface Item {
  _id: string;
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

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { _id, name, size, mainColor, price, description, gender, category, style, images, saleDiscount } = item;

  const discountedPrice = saleDiscount ? (price - (price * saleDiscount / 100)).toFixed(2) : price.toFixed(2);

  const { dispatch } = useCart();

  const handleAddToCart = () => {
    const selectedSize = size[0];
    console.log('Add to cart clicked'); // Log to verify click
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        _id,
        name,
        size: selectedSize,
        mainColor,
        price: saleDiscount ? Number(discountedPrice) : price,
        quantity: 1,
      },
    });
    dispatch({ type: 'TOGGLE_CART_VISIBILITY', payload: true });
    console.log('Item dispatched to cart:', {
      _id,
      name,
      size: selectedSize,
      mainColor,
      price: saleDiscount ? Number(discountedPrice) : price,
      quantity: 1,
    }); // Log to verify dispatch
  };

  // Define the base URL for your Bunny CDN pull zone
  const baseUrl = 'https://maison-elysee.b-cdn.net/';

  // Get the main image URL or the first image if no main image is set
  const mainImageUrl = images.find(img => img.main)?.url || images[0]?.url;
  const fullImageUrl = `${baseUrl}${mainImageUrl}`;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <Link href={`/item/${_id}`}>
        <div className="relative pt-[75%] overflow-hidden rounded-md mb-6">
          <img
            src={fullImageUrl}
            alt={name}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      </Link>
      <h3 className="text-lg font-bold mb-2">{name}</h3>
      <p className="text-sm mb-2">{description}</p>
      <p className="text-sm mb-2">Category: {category}</p>
      <p className="text-sm mb-2">Gender: {gender}</p>
      <p className="text-sm mb-2">Style: {style}</p>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm">Color: {mainColor}</p>
        <p className="text-sm">Size: {size.join(', ')}</p>
      </div>
      {saleDiscount ? (
        <div className="text-red-500 font-bold">
          <span className="line-through">${price.toFixed(2)}</span> ${discountedPrice}
        </div>
      ) : (
        <div className="font-bold">${price.toFixed(2)}</div>
      )}
      <button 
        onClick={handleAddToCart} 
        className="mt-4 w-full bg-orange-300 hover:bg-orange-400 text-black font-bold py-2 px-4 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}
