import Link from 'next/link';

export default function ItemCard({ item }) {
  const { itemId, name, size, mainColor, price, description, gender, category, style, imageUrl, saleDiscount } = item;

  const discountedPrice = saleDiscount ? (price - (price * saleDiscount / 100)).toFixed(2) : price.toFixed(2);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <Link href={`/item/${itemId}`} className="block">
        <img src={imageUrl} alt={name} className="h-40 w-full object-cover rounded-md mb-4" />
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
      </Link>
    </div>
  );
}
