import Base from "./Base";

export default interface IAccount extends Base {
    Level: number
    Father: number
    Balance: number
    Type: number
    PostableAccount: string
    UpdateFather: boolean
    UpdateBalance: boolean
}
