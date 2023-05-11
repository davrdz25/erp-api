import { IResult, MSSQLError } from "mssql"
import IQRCode from "../Interfaces/QRCode"
import MSSQLService from "../Services/Database"
import QRCode from "qrcode"

export default class QRCodeModel {
    public static Get(_Entry: number) {
        const SQLQuery = "SELECT ImagePath FROM QRCodes WHERE \"Entry\" = " + _Entry

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Created: IResult<any>) => {
                if (_Created.recordset[0].ErrNumber === 500) {
                    reject({ Message: _Created.recordset })
                }
                resolve(_Created.recordset)
            }).catch((_Err) => {
                reject({ "Message": _Err.Info.message })
            })
        })
    }

    public static Create(_NewQRCode: IQRCode) {
        return new Promise((resolve, reject) => {
            QRCode.toFile(".sad/" + _NewQRCode.Name + ".png", "www.google.com").then((w) => {
                const SQLQuery = "INSERT INTO QRCodes (" +
                    "\"Entry\", " +
                    "\"Name\", " +
                    "\"Data\", " +
                    "UserSign, " +
                    "CreateDate) " +
                    "VALUES (" +
                    "(SELECT ISNULL(MAX(\"Entry\"), 0) + 1 \"Entry\" FROM QRCodes) , " +
                    "'" + _NewQRCode.Name + "', " +
                    "'" + -_NewQRCode.Data + "', " +
                    -_NewQRCode.UserSign + ", " +
                    "'" + _NewQRCode.CreateDate + "'" +
                    ")"
                    
                MSSQLService.RunQuey(SQLQuery).then((_Created: IResult<any>) => {
                    if (_Created.recordset[0].ErrNumber === 500) {
                        reject({ Message: _Created.recordset })
                    }
                    resolve(_Created.recordset)
                }).catch((_Err) => {
                    reject({ "Message": _Err.Info.message })
                })
            }).catch((err) => {
                reject(err)
            })
        })
    }
}