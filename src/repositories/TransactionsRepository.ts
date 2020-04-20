import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface ListTransactionsDTO {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balance: Balance;

  private listTransactions: ListTransactionsDTO;

  constructor() {
    this.transactions = [];
    this.balance = { income: 0, outcome: 0, total: 0 };
    this.listTransactions = {
      transactions: this.transactions,
      balance: this.balance,
    };
  }

  public all(): ListTransactionsDTO {
    this.balance = this.getBalance();

    this.listTransactions = {
      transactions: this.transactions,
      balance: this.balance,
    };

    return this.listTransactions;
  }

  public getBalance(): Balance {
    const incomeTotal = this.transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((prev, cur) => {
        return prev + cur.value;
      }, 0);

    const outcomeTotal = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((prev, cur) => {
        return prev + cur.value;
      }, 0);

    this.balance = {
      income: incomeTotal,
      outcome: outcomeTotal,
      total: incomeTotal - outcomeTotal,
    };

    return this.balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
