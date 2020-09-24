import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();
  const [price, setPrice] = useState(0);
  const [quant, setQuant] = useState(0);

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const sumPrices = products.reduce((acumulator, product) => {
      const total = product.price * product.quantity;

      return acumulator + total;
    }, 0);
    
    return formatValue(sumPrices);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const totalItems = products.reduce((acumulator, product) => {
      return acumulator + product.quantity;
    }, 0);
    
    return totalItems;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
