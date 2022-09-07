import Base from "./Base";

export default interface Card extends Base {
    Number: number,
    ValidFromMonth: number,
    ValidFromYear: number,
    ValidUntilMonth: number,
    ValidUntilYear: number,
    Digital: boolean,
    Account: number,
    Bank: number
}