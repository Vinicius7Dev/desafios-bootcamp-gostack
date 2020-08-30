import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find();

    let income = 0, outcome = 0;

    transactions.forEach(transaction => {
      if(transaction.type == 'income')
        income += transaction.value;
      else
        outcome += transaction.value;
    });

    return {
      income,
      outcome,
      total: income - outcome
    };
  }
}

export default TransactionsRepository;
