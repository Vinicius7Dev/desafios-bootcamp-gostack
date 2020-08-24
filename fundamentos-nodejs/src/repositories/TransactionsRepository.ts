import Transaction from '../models/Transaction';
import { uuid } from 'uuidv4';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    let incomeSum = 0;
    let outcomeSum = 0;

    this.transactions.forEach(transaction => {
      if(transaction.type === 'income')
        incomeSum += transaction.value;
      else if(transaction.type === 'outcome')
        outcomeSum += transaction.value
    })

    return {
      income: incomeSum,
      outcome: outcomeSum,
      total: incomeSum - outcomeSum
    };
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const transaction: Transaction = {
      id: uuid(),
      title,
      value,
      type
    };

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
