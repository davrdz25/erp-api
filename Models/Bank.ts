import { IResult } from "mssql";
import MSSQLService from "../Services/Database";
import IBank from "../Interfaces/Bank";

interface StoredProcedureOutput {
    ErrNumber: number,
    ProcName: string,
    State: string,
    Message: string;
}

export default class BankModel {
    public static GetAll() {
        const SQLQuery = "SELECT ROW_NUMBER() OVER(ORDER BY \"Entry\") as \"Key\", "
            + "\"Entry\", "
            + "ShortName, "
            + "BussinesName, "
            + "AcctEntry, "
            + "SWIFTBIC, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM Banks"

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Banks) => {
                resolve(_Banks.recordset)
            }).catch((_Err) => {
                console.log(_Err)
                reject({"Message": _Err.Info.message})
            })
        })
    }

    public static Search(_Bank: IBank): Promise<MSSQLService> {
        let Filter: any[] = []

        if (_Bank.Code) {
            Filter.push("BankCode " + (_Bank.ExactValues === 'Y' ? " = '" + _Bank.Code + "' " : "LIKE '%" + _Bank.Code + "%'"))
        }

        if (_Bank.ShortName) {
            Filter.push("ShortName " + (_Bank.ExactValues === 'Y' ? " = '" + _Bank.ShortName + "' " : "LIKE '%" + _Bank.ShortName + "%'"))
        }

        if (_Bank.SWIFTBIC) {
            Filter.push("SWIFTBIC " + (_Bank.SWIFTBIC ? " = '" + _Bank.SWIFTBIC + "' " : "LIKE '%" + _Bank.SWIFTBIC + "%'"))
        }

        return new Promise((resolve, reject) => {
            const SQLQuery = "SELECT ROW_NUMBER() OVER(ORDER BY \"Entry\") as \"Key\", "
                + "\"Entry\", "
                + "ShortName, "
                + "BusisnesName, "
                + "AcctEntry, "
                + "SWIFTBIC, "
                + "UserSign, "
                + "CreateDate, "
                + "UpdateDate "
                + "FROM Banks"
                + "WHERE " + (Filter.join(_Bank.ExactValues === 'Y' ? " AND " : " OR "))

            MSSQLService.RunQuey(SQLQuery).then((_Banks: IResult<MSSQLService>) => {
                if (_Banks.recordset.length !== 0) {
                    resolve(_Banks.recordset)
                } else {
                    reject({ Message: "No banks found" })
                }
            }).catch((_Err) => {
                reject({"Message": _Err.Info.message})
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
            throw ({ Message: "Short Name cannot be empty" })
        }

        return new Promise((resolve, reject) => {
            const SQLQuery = "EXECUTE CreateBank "
                + "'" + _Bank.ShortName + "', "
                + (_Bank.SWIFTBIC ? "'" + _Bank.SWIFTBIC + "', " : "NULL, ")
                + (_Bank.BusinessName ? "'" + _Bank.BusinessName + "', " : "NULL, ")
                + _Bank.AcctEntry + ", "
                + "'" + _Bank.CreateDate + "'"

            MSSQLService.RunQuey(SQLQuery).then((_Created: IResult<StoredProcedureOutput>) => {
                if (_Created.recordset[0].ErrNumber === 500) {
                    reject({ Message: _Created.recordset })
                }
                resolve(_Created.recordset)
            }).catch((_Err) => {
                reject({"Message": _Err.Info.message})
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