import fs from 'fs';
import csvParse from 'csv-parse';
import path from 'path';

import uploadConfig from '../config/uploadConfig';

import Transaction from '../models/Transaction';
import CreateTransactionService from '../services/CreateTransactionService';

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const filePath = path.resolve(uploadConfig.directory, fileName);

    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    let lines: string[] = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const createTransaction = new CreateTransactionService();

    let transactions = [];

    for(let i in lines) {
      let transactionType: 'income' | 'outcome' = 'income';

      if(lines[i][1] === 'outcome')
        transactionType = 'outcome';

      const transaction: Transaction = await createTransaction.execute({
        title: lines[i][0],
        value: Number(lines[i][2]),
        type: transactionType,
        category: lines[i][3]
      });

      transactions.push(transaction);
    }
    return transactions;
  }
}

export default ImportTransactionsService;
