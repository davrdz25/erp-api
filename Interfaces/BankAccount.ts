import Base from "./Base";

export default interface BankAccount extends Base {
    Bank: number,
    SWIFTBIC: string,
    Account: number,
    Credit: boolean,
    DebitBalance: number,
    CreditDebt: number,
    AviableCredit: number,
    CutOffDay: number,
    PayDayLimit: number
}