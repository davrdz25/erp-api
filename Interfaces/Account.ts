import Base from "./Base";

enum Type {
    Title = -1,
    Cash = 1,
    CreditCard = 2,
    DebitCard = 3,
    Banks = 4,
    BankAccount = 5,
    Transfer = 6,
    Expenses = 7,
    Incomes = 8,
    Debits =  9,
    Investments = 10
}

export default interface IAccount extends Base {
    Level: number
    Father: number
    Balance: number
    Type: number
    PostableAccount: string
    UpdateFather: boolean
    UpdateBalance: boolean
}
