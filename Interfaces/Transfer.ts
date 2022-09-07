import Base from "./Base";

export default interface Transfer extends Base {
    Prefix: string,
    Number: number,
    TransDate: Date
    TransTime: Date,
    OrigAcct: number,
    DestAcct: number,
    Ammount: number
}