import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepostitory = getRepository(Transaction);

    await transactionsRepostitory.delete({ id });

    throw new AppError('', 204);
  }
}

export default DeleteTransactionService;
