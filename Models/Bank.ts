import { IResult } from "mssql";
import MSSQLService from "../Services/Database";
import Bank from "../Interfaces/Bank"
import IBank from "../Interfaces/Bank";

export default class BankModel {
    public static GetAll() {
        const SQLQuery = "SELECT ROW_NUMBER() OVER(ORDER BY \"Entry\") as \"Key\", "
            + "\"Entry\", "
            + "\"Code\", "
            + "ShortName, "
            + "BusinessName, "
            + "AcctEntry, "
            + "SWIFTBIC, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM Banks"

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Banks) => {
                resolve(_Banks.recordset)
            }).catch((Err) => {
                reject(Err)
            })
        })
    }

    public static Search(_Bank: IBank): Promise<MSSQLService> {
        let Filter: any[] = []

        if (_Bank.Code) {
            Filter.push("BankCode " + (_Bank.ExactValues  === 'Y' ? " = '" + _Bank.Code + "' " : "LIKE '%" + _Bank.Code + "%'"))
        }

        if (_Bank.ShortName) {
            Filter.push("ShortName " + (_Bank.ExactValues  === 'Y' ? " = '" + _Bank.ShortName + "' " : "LIKE '%" + _Bank.ShortName + "%'"))
        }

        if (_Bank.SWIFTBIC) {
            Filter.push("SWIFTBIC " + (_Bank.SWIFTBIC ? " = '" + _Bank.SWIFTBIC + "' " : "LIKE '%" + _Bank.SWIFTBIC + "%'"))
        }
        
        return new Promise((resolve, reject) => {
            const SQLQuery = "SELECT ROW_NUMBER() OVER(ORDER BY \"Entry\") as \"Key\", "
            + "\"Entry\", "
            + "\"Code\", "
            + "ShortName, "
            + "BusinessName, "
            + "AcctEntry, "
            + "SWIFTBIC, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM Banks"
            + "WHERE " + (Filter.join(_Bank.ExactValues  === 'Y' ? " AND " : " OR "))

            MSSQLService.RunQuey(SQLQuery).then((_Banks: IResult<MSSQLService>) => {
                if (_Banks.recordset.length !== 0) {
                    resolve(_Banks.recordset)
                } else {
                    reject({ Message: "No banks found" })
                }
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }

    public static ExistShortName(_ShtName: string) {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Banks "
            + "WHERE ShortName = '" + _ShtName + "'"

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Count) => {
                if (_Count.recordset[0].Register !== 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }).catch((Err) => {
                reject(Err)
            })
        })
    }

    public static ExistsBusinessName(_BssnsName: string) {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Banks "
            + "WHERE BusinessName = '" + _BssnsName + "'"

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Count) => {
                if (_Count.recordset[0].Register !== 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }).catch((Err) => {
                reject(Err)
            })
        })
    }

    public static ExistsSWIFTBIC(_SWIFTBIC: string) {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Banks "
            + "WHERE SWIFTBIC = '" + _SWIFTBIC + "'"

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Count) => {
                if (_Count.recordset[0].Register !== 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }).catch((Err) => {
                reject(Err)
            })
        })
    }

    public static Create(_Bank: IBank) {
        if (!_Bank.ShortName) {
            throw({ Message: "Short Name cannot be empty" })
        }

        return new Promise((resolve, reject) => {
                const SQLQuery = "INSERT INTO Banks "
                + "(\"Entry\", "
                + "\"Code\", "
                + "ShortName, "
                + (_Bank.BusinessName ? "BusinessName, " : "")
                + (_Bank.SWIFTBIC ? "SWIFTBIC, " : "")
                + "UserSign, "
                + "CreateDate) "
                + "VALUES "
                + "((SELECT ISNULL(MAX(\"Entry\"), 0) + 1 \"Entry\" FROM Banks), "
                + "'" + _Bank.Code + "', "
                + "'" + _Bank.ShortName + "', "
                + (_Bank.BusinessName ? "'" + _Bank.BusinessName + "', " : "")
                + (_Bank.SWIFTBIC ? "'" + _Bank.SWIFTBIC + "', " : "")
                + (_Bank.UserSign !== 0 ? _Bank.UserSign : -1) + ", "
                + "'" + _Bank.CreateDate + "')"

                MSSQLService.RunQuey(SQLQuery).then((_Created) => {
                    if (_Created.rowsAffected[0] !== 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }).catch((Err) => {
                    reject(Err)
                })

            })
    }

    // public static Update() {
    //     return new Promise((resolve, reject) => {
    //         const SQLQuery = "Update Banks SET "
    //         + (this.ShortName ? "ShortName = '" + this.ShortName + "', " : "")
    //         + (this.BusinessName ? "BusinessName = '"  + this.BusinessName + "', " : "")
    //         + (this.SWIFTBIC ? "SWIFTBIC = '" + this.SWIFTBIC + "', " : "")
    //         + "UpdateDate = '" + this.UpdateDate + "'"
    //         + "WHERE \"Code\" = '" + this.Code + "'" 

    //         Promise.all([this.ExistCode(), this.ExistShortName()])
    //         .then(([_ExistsCode, _ExistShortName]) => {
    //             if (!_ExistsCode) {
    //                 reject({ Message: "Code doesn't exists" })
    //             }

    //             if (_ExistShortName) {
    //                 reject({ Message: "Name already exists" })
    //             }
                
    //             MSSQLService.RunQuey(SQLQuery).then((_Updated) => {
    //                 if (_Updated.rowsAffected[0] !== 0) {
    //                     resolve(true)
    //                 } else {
    //                     resolve(false)
    //                 }
    //             }).catch((Err) => {
    //                 reject(Err)
    //             })

    //         }).catch((_Err) => {
    //             reject(_Err)
    //         })
    //     })
    // }
}