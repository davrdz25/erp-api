import Base from "./Base";

export default interface Bank extends Base {
    ShortName: string,
    BusinessName: string,
    SWIFTBIC: string,
}