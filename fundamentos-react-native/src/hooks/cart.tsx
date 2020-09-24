import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const productsASLoaded = await AsyncStorage.getItem('@GoMarketplace:cart');

      if(!!productsASLoaded){
        setProducts([...JSON.parse(productsASLoaded)]);
      }
    }

    loadProducts();
  }, [setProducts]);

  useEffect(() => {
    async function saveInAsyncStorage() {
      //await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(products));
    }
    
    saveInAsyncStorage();
  }, [products]);

  const addToCart = useCallback(async product => {
    const productExistsI = products.findIndex(element => element.id === product.id);

    if(productExistsI !== -1){
      let newProduct: Product = products[productExistsI];

      newProduct.quantity += 1;

      products.splice(productExistsI, 1);
      
      setProducts([...products, newProduct]);
    } else {
      const newProduct: Product = {
        title: product.title,
        id: product.id,
        image_url: product.image_url,
        price: product.price,
        quantity: 1,
      }

      setProducts([...products, newProduct]);
      
      await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(products));
    }
  }, [products]);

  const increment = useCallback(async id => {
    const productIndex = products.findIndex(element => element.id === id);

    const { title, image_url, price, quantity } = products[productIndex];

    const newProduct = {
      title: title,
      id: id,
      image_url: image_url,
      price: price,
      quantity: quantity + 1,
    };

    products.splice(productIndex, 1);

    setProducts([...products, newProduct]);
    
    await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(products));
  }, [products]);

  const decrement = useCallback(async id => {
    const productIndex = products.findIndex(element => element.id === id);

    const { title, image_url, price, quantity } = products[productIndex];

    if(quantity > 1) {
      const newProduct = {
        title: title,
        id: id,
        image_url: image_url,
        price: price,
        quantity: quantity - 1,
      };

      products.splice(productIndex, 1);

      setProducts([...products, newProduct]);
    }
    
    await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(products));
  }, [products]);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
