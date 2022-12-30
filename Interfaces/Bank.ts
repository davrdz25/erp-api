import Base from "./Base";

export default interface IBank extends Base {
    ShortName: string,
    BusinessName: string,
    SWIFTBIC: string,
    AcctEntry: number
}