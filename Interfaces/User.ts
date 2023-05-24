export default interface IUser {
    Entry: number
    Code: string
    Name: string
    Email: string,
    Comments: string
    isLocked: boolean
    isActive: boolean
    isLoggedIn: boolean
    Password: string
    Salt: string
    CreateDate: string
    UpdateDate: string
    UserSign: string
}