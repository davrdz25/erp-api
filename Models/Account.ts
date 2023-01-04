import { IResult, MSSQLError } from "mssql";
import MSSQLService from "../Services/Database";
import IAccount from "../Interfaces/Account";

interface StoredProcedureOutput {
    ErrNumber: number,
    ProcName: string,
    State: string,
    Message: string;
}

export default class AccountModel {
    public static GetAll() {
        const SQLQuery = "SELECT ROW_NUMBER() OVER(ORDER BY \"Entry\") AS \"Key\", "
            + "\"Entry\", "
            + "\"Code\", "
            + "\"Name\", "
            + "\"Level\", "
            + "\"Type\", "
            + "PostableAcct, "
            + "FatherEntry, "
            + "Balance, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM Accounts"

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Accounts: IResult<MSSQLService>) => {
                if (_Accounts.recordset.length !== 0) {
                    resolve(_Accounts.recordset)
                } else {
                    reject({ Message: "No accounts found" })
                }
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }

    public static Search(_Param: IAccount) {
        let Filter: any[] = []

        if (_Param.Name) {
            Filter.push("\"Name\" " + (_Param.ExactValues === 'Y' ? "= '" + _Param.Name + "' " : "LIKE '%" + _Param.Name + "%'"))
        }

        if (Number(_Param.Entry) > 0) {
            Filter.push("\"Entry\" = " + _Param.Entry)
        }

        if (Number(_Param.Father) > 0) {
            Filter.push("Father = " + _Param.Father)
        }

        if (Number(_Param.Level) > 0) {
            Filter.push("Level = " + _Param.Level)
        }

        if (Number(_Param.Type) > 0) {
            Filter.push("Type = " + _Param.Type)
        }

        const SQLQuery = "SELECT ROW_NUMBER() OVER(ORDER BY \"Entry\") AS \"Key\", "
            + "\"Entry\", "
            + "\"Code\", "
            + "\"Name\", "
            + "\"Level\", "
            + "\"Type\", "
            + "PostableAcct, "
            + "FatherEntry, "
            + "Balance, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM Accounts"
            + "WHERE " + (Filter.join(_Param.ExactValues === 'Y' ? " AND " : " OR "))

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Accounts: IResult<MSSQLService>) => {
                console.log(_Accounts)
                if (_Accounts.recordset.length !== 0) {
                    resolve(_Accounts.recordset)
                } else {
                    reject({ Message: "No accounts found" })
                }
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }

    public static EntryExists(_Param: IAccount) {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Accounts "
            + "WHERE \"Entry\" = '" + _Param.Entry + "'"

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

    public static CodeExists(_Code: string | undefined) {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Accounts "
            + "WHERE \"Code\" = '" + _Code + "'"

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

    public static NameExists(_Name: string) {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Accounts "
            + "WHERE  \"Name\" = '" + _Name + "'"

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

    public static FatherExists(_Entry: number) {
        return new Promise((resolve, reject) => {
            const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
                + "FROM Accounts "
                + "WHERE  \"Entry\" = " + _Entry

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

    public static Create(_Account: IAccount) {
        if (!_Account.Name) {
            throw ({ Message: "Name cannot be empty" })
        }

        if (_Account.Code) {
            throw ({ Messge: "Invalid value Code" })
        }

        if (_Account.Name && _Account.Name.length > 100) {
            throw ({ Messge: "Name cannot be more than 100 characters" })
        }

        if (_Account.Father === 0 || _Account.Father < -1) {
            throw ({ Message: "Invalid value Father" })
        }

        if (_Account.Level === 0 && _Account.Level < -1) {
            throw ({ Message: "Invalid value Level" })
        }

        if (_Account.Type === -1 && _Account.PostableAccount === 'Y') {
            throw ({ Message: "Postable account cannot be title type" })
        }

        return new Promise((resolve, reject) => {
            const SQLQuery = "EXECUTE CreateAccount" +
                "'" + _Account.Name + "', "
                + Number(_Account.Level) + ", "
                + Number(_Account.Father) + ", "
                + _Account.Type + ", "
                + (_Account.Balance ? _Account.Balance : 0 + ", ")
                + (_Account.PostableAccount ? "'Y', " : "'N', ")
                + "'" + _Account.CreateDate + "'"

            console.log(SQLQuery)
            MSSQLService.RunQuey(SQLQuery).then((_Created: IResult<StoredProcedureOutput>) => {
                console.log(_Created)
                if (_Created.recordset[0].ErrNumber === 500) {
                    reject({ Message: _Created.recordset })
                }
                resolve(_Created.recordset)
            }).catch((_Err) => {
                console.log(_Err.Info.message)
                reject({"Message": _Err.Info.message})
            })
        })
    }

    // public static Update(_Account: IAccount) {

    //     if (_Account.Name && _Account.Name.length > 100) {
    //         throw ({ Messge: "Name cannot be more than 100 characters" })
    //     }

    //     return new Promise((resolve, reject) => {
    //         const SQLQuery = "UPDATE Accounts SET "
    //             + (_Account.Name ? + "\"Name\" = '" + _Account.Name + "', " : "")
    //             + (_Account.UpdateFather ? "FatherAcct = " + _Account.Father + ", " : "")
    //             + (_Account.UpdateBalance ? "Balance = '" + (_Account.Balance ? _Account.Balance : 0) + ", " : "")
    //             + (_Account.Level !== 0 ? + "\"Level\" = " + _Account.Level + ", " : "")
    //             + "UpdateDate = '" + _Account.UpdateDate + "'"
    //             + "WHERE AcctCode = '" + _Account.Code + "'"

    //         Promise.all(([this.CodeExists(_Account.Code), this.NameExists(_Account.Name)])).then(([_CodeExists, _NameExists]) => {
    //             if (!_CodeExists) {
    //                 throw ({ Message: "Code doesn't exists" })
    //             }

    //             if (_NameExists) {
    //                 throw ({ Message: "Name already exists" })
    //             }

    //             MSSQLService.RunQuey(SQLQuery).then((_Updated) => {
    //                 if (_Updated.rowsAffected[0] !== 0) {
    //                     resolve(true)
    //                 } else {
    //                     resolve(false)
    //                 }
    //             }).catch((_Err) => {
    //                 reject(_Err)
    //             })
    //         }).catch((_Err) => {
    //             reject(_Err)
    //         })
    //     })
    // }
}