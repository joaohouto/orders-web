export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  storeId: string;
  variations: {
    id: string;
    name: string;
    price: string;
  }[];
};

export type CartProduct = {
  id: string;
  storeId: string;
  productId: string;
  name: string;
  images: string[];
  variationName: string;
  price: string;
  note: string;
};
