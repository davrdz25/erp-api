import { IResult } from "mssql";
import MSSQLService from "../Services/Database";
import IAccount from "../Interfaces/Account";
import StoredProcedureOutput from "../Interfaces/StoredProcedureOutput";

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
            
            MSSQLService.RunQuey(SQLQuery).then((_Accounts) => {              
                if (_Accounts.recordset.length !== 0) {      
                    _Accounts.recordsets[0].map((_acct: any) => {
                        if(_acct.PostableAcct === 'Y'){
                            _acct.PostableAcct = true
                        } else {
                            _acct.PostableAcct = false
                        }
                    })

                    resolve( _Accounts.recordset)
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
            + "FROM Accounts "
            + "WHERE " + (Filter.join(_Param.ExactValues === 'Y' ? " AND " : " OR "))

            console.log(SQLQuery)
        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Accounts) => {
                if (_Accounts.recordset.length !== 0) {
                    _Accounts.recordsets[0].map((_acct: any) => {
                        if(_acct.PostableAcct === 'Y'){
                            _acct.PostableAcct = true
                        } else {
                            _acct.PostableAcct = false
                        }
                    })
                    resolve(_Accounts.recordset)
                } else {
                    reject({ Message: "No accounts found" })
                }
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }

    public static SearchParams(_Param: string) {
        let Filter: any[] = []

        if (_Param.includes('Name')) {
            Filter.push("\"Name\" = '" + _Param + "' ")
        }

        if (_Param.includes('Code')) {
            Filter.push("\"Code\" = '" + _Param + "' ")
        }
        
        if (_Param.includes('Level')) {
            Filter.push("\"Level\" = " + _Param  + " ")
        }

        if (_Param.includes('Father')) {
            Filter.push("\"Father\" = " + _Param  + " ")
        }

        if (_Param.includes('PostableAcct')) {
            Filter.push("\"PostableAcct\" = " + _Param  + " ")
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
            + "FROM Accounts "
            + "WHERE " + (Filter.join(" AND "))

            console.log(SQLQuery)
        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Accounts) => {
                if (_Accounts.recordset.length !== 0) {
                    _Accounts.recordsets[0].map((_acct: any) => {
                        if(_acct.PostableAcct === 'Y'){
                            _acct.PostableAcct = true
                        } else {
                            _acct.PostableAcct = false
                        }
                    })
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
            console.log( `Name`)
            throw ({ Message: "Name cannot be empty" })
        }

        if (_Account.Name && _Account.Name.length > 100) {
            console.log( `Name 1`)

            throw ({ Messge: "Name cannot be more than 100 characters" })
        }

        if (_Account.Father === 0 || _Account.Father < -1) {
            console.log( `Father`)
            throw ({ Message: "Invalid value Father" })
        }

        if (_Account.Level === 0 && _Account.Level < -1 || _Account.Level === null || _Account.Level === undefined) {
            console.log( `Level`)

            throw ({ Message: "Invalid value Level" })
        }

        if (_Account.Type === -1 && _Account.PostableAcct) {
            console.log( `Postable`)

            throw ({ Message: "Postable account cannot be title type" })
        }

        return new Promise((resolve, reject) => {
            const SQLQuery = "EXECUTE CreateAccount" +
                "'" + _Account.Name + "', "
                + Number(_Account.Level) + ", "
                + Number(_Account.Father) + ", "
                + _Account.Type + ", "
                + (_Account.Balance ? _Account.Balance : 0 + ", ")
                + (_Account.PostableAcct ? "'Y', " : "'N', ")
                + "'" + _Account.CreateDate + "'"

            console.log( _Account, SQLQuery)
            MSSQLService.RunQuey(SQLQuery).then((_Created: IResult<StoredProcedureOutput>) => {
                if (_Created.recordset[0].ErrNumber === 500) {
                    reject({ Message: _Created.recordset })
                }
                resolve(_Created.recordset)
            }).catch((_Err) => {
                console.log("Catch", _Err)
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