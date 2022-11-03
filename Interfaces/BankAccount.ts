import Base from "./Base";

export default interface IBankAccount extends Base {
    BankEntry: number,
    BankCode: string,
    SWIFTBIC: string,
    Account: number,
    Credit: boolean,
    DebitBalance: number,
    CreditDebt: number,
    AviableCredit: number,
    CutOffDay: number,
    PayDayLimit: number
}
