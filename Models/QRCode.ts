import IQRCode from "../Interfaces/QRCode"

export default class QRCodeModel{
    public static Get(_Entry: number){
        const SQLQuery = "SELECT ImagePath FROM QRCodes WHERE \"Entry\" = " + _Entry
    }
}