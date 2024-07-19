export interface Item {
    _id?: string;
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
  