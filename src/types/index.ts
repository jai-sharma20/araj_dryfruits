export interface Product {
  /**
   * Unique product identifier in the format: PREFIX-TIMESTAMP-RANDOM
   * PREFIX: Category-based prefix (NUT, SPC, DRF)
   * TIMESTAMP: Unix timestamp when the product was created
   * RANDOM: Random alphanumeric string
   * Example: NUT-1709123456789-ABC123
   */
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  description: string;
  weight: string;
  nutritionalInfo: string;
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar?: string;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  weight: string;
  searchTerm: string;
}