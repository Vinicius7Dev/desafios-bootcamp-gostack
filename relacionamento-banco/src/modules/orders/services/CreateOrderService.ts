import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const custumerFind = await this.customersRepository.findById(customer_id);

    if(!custumerFind) {
      throw new AppError('Customer not found.');
    }

    const productsFind = await this.productsRepository.findAllById(products);
    
    if(!productsFind.length) {
      throw new AppError('Product(s) not found.');
    }

    const productsId = productsFind.map(product => product.id);

    const compareIds = productsId.filter(
      idCompare => !productsId.includes(idCompare)
    );
    
    if(compareIds.length) {
      throw new AppError('Have one o more inexisting products.');
    }

    const productsNotAvailebleQuant = products.filter(
      product =>
        productsFind.filter(prod => prod.id === product.id)[0].quantity < product.quantity
    );

    if(productsNotAvailebleQuant.length) {
      throw new AppError('No have quantity availeble of the product.');
    }

    const productsObject = products.map( product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: productsFind.filter(prod => prod.id === product.id)[0].price
    }));

    const order = await this.ordersRepository.create({
      customer: custumerFind,
      products: productsObject
    });

    const { order_products } = order;
    
    const quantityOrderProducts = order_products.map(product => ({
      id: product.product_id,
      quantity: productsFind.filter(prod => prod.id === product.product_id)[0].quantity - product.quantity,
    }));

    await this.productsRepository.updateQuantity(quantityOrderProducts);

    return order;
  }
}

export default CreateOrderService;
