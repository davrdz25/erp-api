import IQRCode from "../Interfaces/QRCode"
import MSSQLService from "../Services/Database"
import QRCode from "qrcode"
import RandomNameGeneration from "../Utilities/RandomNameGeneration"
import {existsSync, mkdirSync} from 'fs'

export default class QRCodeModel {
    public static Get(_Entry: number) {
        const SQLQuery = "SELECT * FROM QRCodes"

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_QRCodes) => {
                if (_QRCodes.recordset.length !== 0) {
                    resolve(_QRCodes.recordset)
                } else {
                    reject({ Message: "No QR codes found" })
                }
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }

    public static Create(_NewQRCode: IQRCode) {
        return new Promise((resolve, reject) => {
            const folder = RandomNameGeneration.generateRandomString(2)
            const name = RandomNameGeneration.generateRandomString(10)

            if(!existsSync("./QRCodes/" + folder ))
                mkdirSync("./QRCodes/" + folder)

            QRCode.toFile("./QRCodes/" + folder + "/" + name + ".svg", _NewQRCode.Data, {
                type: "svg",
                version: 10,
                errorCorrectionLevel: "high",
                maskPattern: 7,
                margin: 2,                
            }).then(() => {
                const SQLQuery = "INSERT INTO QRCodes (" +
                                 "\"Entry\", " +
                                 "\"Name\", " +
                                 "\"Data\", " +
                                 "ImagePath, " +
                                 "UserSign, " +
                                 "CreateDate) " +
                                 "VALUES (" +
                                 "(SELECT ISNULL(MAX(\"Entry\"), 0) + 1 \"Entry\" FROM QRCodes) , " +
                                 "'" + name + "', " +
                                 "'" + _NewQRCode.Data + "', " +
                                 "'" + "./QRCodes/" + name + ".svg', " +
                                 _NewQRCode.UserSign + ", " +
                                 "'" + _NewQRCode.CreateDate + "'" +
                                 ")"                                 
                console.log(SQLQuery);
                                 
                MSSQLService.RunQuey(SQLQuery).then((_Created) => {
                    if (_Created.rowsAffected[0] !== 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }).catch((Err) => {
                    reject(Err)
                })
            }).catch((err) => {
                reject(err);
            })
        })
    }
}