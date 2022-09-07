export default interface Payment {
    Entry: number
    Prefix: string,
    Number: number,
    Comments: string,
    PayDate: Date,
    PayTime: Date,
    Type: number,
    Category: number,
    Account: number,
    Ammount: number
    UserSign: number
    CreateDate: Date
    UpdateDate: Date
}