import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if(type === 'outcome'){
      const { total } = await transactionRepository.getBalance();

      if(value > total)
        throw new AppError('You do not have enough money.', 400);
    }

    let category_id = '';

    const categoryExists = await categoriesRepository.findOne({
      where: { title: category }
    });

    if(!categoryExists) {
      const newCategory = categoriesRepository.create({
        title: category
      });

      const savedCategory = await categoriesRepository.save(newCategory);

      category_id = savedCategory.id;
    }else {
      category_id = categoryExists.id;
    }

    const transaction = transactionRepository.create({
      title,
      category_id,
      type,
      value
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
