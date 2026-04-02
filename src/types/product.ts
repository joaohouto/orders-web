export type Variation = {
  id: string;
  name: string;
  priceAdjustment: number;
};

export type VariationGroup = {
  id: string;
  name: string;
  variations: Variation[];
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
  variationGroups: VariationGroup[];
};

export type CartProduct = {
  cartKey: string; // productId + ':' + sortedVariationIds
  storeId: string;
  productId: string;
  name: string;
  images: string[];
  variationIds: string[];
  variationNames: string; // "Cor: Azul / Tamanho: M"
  price: number;
  note: string;
};
