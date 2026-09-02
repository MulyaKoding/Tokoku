export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
};

export type CartItem = Product & { qty: number };