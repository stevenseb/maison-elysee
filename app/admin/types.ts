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
    images: { url: string; main: boolean }[];
    saleDiscount?: number;
    quantity: number;
  }
  
  export type ItemFormState = Omit<Item, '_id' | 'images'> & { images: File[] };
  
  
  