export type VariationType = "GENERIC" | "COLOR" | "SIZE" | "FABRIC";

export type Variation = {
  id: string;
  name: string;
  type: VariationType;
  priceAdjustment: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  images: string[];
  isActive: boolean;
  acceptOrderNote: boolean;
  storeId: string;
  variations: Variation[];
};

export type CartProduct = {
  cartKey: string; // productId + ':' + sortedVariationIds
  storeId: string;
  productId: string;
  name: string;
  images: string[];
  variationIds: string[];
  variationNames: string; // "Azul / P / Algodão"
  price: number;
  note: string;
};
