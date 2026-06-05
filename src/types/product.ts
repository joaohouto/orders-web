export type Variation = {
  id: string;
  name: string;
  priceAdjustment: number;
};

export type VariationGroup = {
  id: string;
  name: string;
  type?: "select" | "text";
  variations: Variation[];
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  memberPrice?: number | null;
  images: string[];
  isActive: boolean;
  acceptOrderNote: boolean;
  soldOutAt: string | null;
  storeId: string;
  variationGroups: VariationGroup[];
  store?: {
    name: string;
    slug: string;
    icon?: string;
    accentColor?: string | null;
  };
};

export type CartProduct = {
  cartKey: string; // productId + ':' + sortedVariationIds + ':' + textInputs
  storeId: string;
  storeName: string;
  productId: string;
  name: string;
  images: string[];
  variationIds: string[];
  variationNames: string; // "Cor: Azul / Tamanho: M / Nome: JOÃO"
  textInputs: Record<string, string>; // groupId -> user-typed value
  price: number;
  note: string;
};
