import Base from "./Base";

export default interface IAccount extends Base {
    Level: number
    Father: number
    Balance: number
    Type: number
    PostableAccount: boolean

    UpdateFather: boolean
    UpdateBalance: boolean
}