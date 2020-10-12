import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';
import AppError from '@shared/errors/AppError';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = await this.ormRepository.create({
      name,
      price,
      quantity
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const productFind = await this.ormRepository.findOne({
      where: {
        name
      }
    });

    return productFind;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    let productsFind: Product[] = [];
    
    for(let i = 0; i < products.length; i++) {
      let product = await this.ormRepository.findOne({
        where: {
          id: products[i].id
        }
      });
      
      if(!product) {
        continue;
      }

      productsFind.push(product);
    }

    return productsFind;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    return await this.ormRepository.save(products);
  }
}

export default ProductsRepository;
