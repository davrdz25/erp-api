import Base from "./Base";

export default interface IBankAccount extends Base {
    BankEntry: number,
    AcctEntry: number,
    SWIFTBIC: string,
    Credit: string,
    CreditLimit: number,
    CreditDebt: number,
    AviableCredit: number,
    CutOffDay: number,
    PayDayLimit: number,
    DebitBalance: number,
}