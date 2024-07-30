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
    });
  };

  const baseUrl = 'https://maison-elysee.b-cdn.net/';
  const mainImageUrl = images.find(img => img.main)?.url || images[0]?.url;
  const fullImageUrl = `${baseUrl}${mainImageUrl}`;

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md flex flex-col h-full">
      <Link href={`/item/${_id}`} className="block flex-grow">
        <div className="relative pt-[100%] overflow-hidden rounded-md mb-4">
          <img
            src={fullImageUrl}
            alt={name}
            className="absolute top-0 left-0 w-full h-full object-contain"
          />
        </div>
        <h3 className="text-base font-bold sm:text-sm mb-2 text-orange-300 line-clamp-1">{name}</h3>
        <p className="text-xs mb-2 text-orange-200 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-orange-200">{gender}</p>
          <p className="text-xs text-orange-200">{style}</p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-orange-200">Color: {mainColor}</p>
          <p className="text-xs text-orange-200">Size: {size.join(', ')}</p>
        </div>
      </Link>
      {saleDiscount ? (
        <div className="text-red-500 font-bold text-sm sm:text-base">
          <span className="line-through">${price.toFixed(2)}</span> ${discountedPrice}
        </div>
      ) : (
        <div className="font-bold text-yellow-100 text-sm sm:text-base">${price.toFixed(2)}</div>
      )}
      <div className="rating">
  <input type="radio" name="rating-4" className="mask mask-star-2 bg-green-500" />
  <input type="radio" name="rating-4" className="mask mask-star-2 bg-green-500" defaultChecked />
  <input type="radio" name="rating-4" className="mask mask-star-2 bg-green-500" />
  <input type="radio" name="rating-4" className="mask mask-star-2 bg-green-500" />
  <input type="radio" name="rating-4" className="mask mask-star-2 bg-green-500" />
</div>
      <button 
        onClick={handleAddToCart} 
        className="mt-4 w-full bg-orange-300 hover:bg-orange-400 text-black font-bold py-2 px-4 rounded text-sm sm:text-base"
      >
        Add to Cart
      </button>
    </div>
  );
}
