import { IResult } from "mssql";
import MSSQLService from "../Services/Database";
import IAccount from "../Interfaces/Account";

export default class AccountModel {

    public static GetAll() {
        const SQLQuery = "SELECT ROW_NUMBER() OVER(ORDER BY \"Entry\") AS \"Key\", "
            + "\"Entry\", "
            + "\"Code\", "
            + "\"Name\", "
            + "\"Level\", "
            + "\"Father\", "
            + "\"Type\", "
            + "PostableAccount, "
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

        if (_Param.Code) {
            Filter.push("\"Code\" " + (_Param.ExactValues === 'Y' ? "= '" + _Param.Code + "' " : "LIKE '%" + _Param.Code + "%'"))
        }

        if (_Param.Name) {
            Filter.push("\"Name\" " + (_Param.ExactValues === 'Y' ? "= '" + _Param.Name + "' " : "LIKE '%" + _Param.Name + "%'"))
        }

        if (_Param.Entry > 0) {
            Filter.push("\"Entry\" = " + _Param.Entry)
        }

        if (_Param.Father > 0) {
            Filter.push("Father = " + _Param.Father)
        }

        if (_Param.Level > 0) {
            Filter.push("Level = " + _Param.Level)
        }

        const SQLQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Entry) AS \"Key\", "
            + "\"Entry\", "
            + "\"Code\", "
            + "\"Name\", "
            + "\"Level\", "
            + "\"Father\", "
            + "\"Type\", "
            + "PostableAccount, "
            + "Balance, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM Accounts "
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

    public static CodeExists(_Code: string) {
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
        if (!_Account.Code) {
            throw ({ Message: "Code cannot be empty" })
        }

        if (!_Account.Name) {
            throw ({ Message: "Name cannot be empty" })
        }

        if (_Account.Code && _Account.Code.length > 25) {
            throw ({ Messge: "Code cannot be more than 25 characters" })
        }

        if (_Account.Name && _Account.Name.length > 100) {
            throw ({ Messge: "Name cannot be more than 100 characters" })
        }

        if (_Account.Father === 0 || _Account.Father < -1) {
            throw ({ Message: "Invalid value Father" })
        }

        if (_Account.Level < 1) {
            throw ({ Message: "Invalid value Level" })
        }

        if(_Account.Type > 0 && _Account.PostableAccount === "N"){
            throw({Message: "Not title type must be postable"})
        }

        if(_Account.Type === -1 && _Account.PostableAccount === 'Y'){
            throw({Message: "Postable account cannot be title type" })
        }
        return new Promise((resolve, reject) => {
            Promise.all(([this.CodeExists(_Account.Code), this.NameExists(_Account.Name), this.FatherExists(_Account.Father) ])).
            then(([_CodeExists, _NameExists, _FatherExists]) => {
                if (_CodeExists) {
                    throw({ Message: "Code already exists" })
                }

                if (_NameExists) {
                    throw({ Message: "Name already exists" })
                }
                
                if(_Account.Father !== -1 && _Account.Level !== 1){
                    if (!_FatherExists) {
                        throw({ Message: "Father doesn't exists" })
                    }
                }

                const SQLQuery = "INSERT INTO Accounts "
                    + "( \"Entry\", "
                    + "\"Code\", "
                    + "\"Name\", "
                    + "\"Level\", "
                    + "Father, "
                    + "\"Type\", "
                    + "PostableAccount, "
                    + "Balance, "
                    + "UserSign, "
                    + "CreateDate "
                    + ") VALUES ("
                    + "(SELECT ISNULL(MAX(\"Entry\"), 0) + 1 \"Entry\" FROM Accounts), "
                    + "'" + _Account.Code + "', "
                    + "'" + _Account.Name + "', "
                    + _Account.Level + ", "
                    + _Account.Father + ", "
                    + _Account.Type + ", "
                    + (_Account.PostableAccount ? "'Y', " : "'N', ")
                    + (_Account.Balance ? _Account.Balance :  0 ) + ", "
                    + _Account.UserSign + ", "
                    + "'" + _Account.CreateDate + "'"
                    + ")"
                console.log(SQLQuery)
                MSSQLService.RunQuey(SQLQuery).then((_Created) => {
                    if (_Created.rowsAffected[0] === 1) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }).catch((_Err) => {
                    reject(_Err)
                })

            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }

    public static Update(_Account: IAccount) {
        if (!_Account.Code) {
            throw ({ Message: "Code cannot be empty" })
        }

        if (_Account.Code && _Account.Code.length > 20) {
            throw ({ Messge: "Code cannot be more than 20 characters" })
        }

        if (_Account.Name && _Account.Name.length > 100) {
            throw ({ Messge: "Name cannot be more than 100 characters" })
        }

        if (_Account.Father !== -1) {
            if (_Account.Father === 0 || _Account.Father < -1) {
                throw ({ Message: "Invalid value Father" })
            }
        }

        if (_Account.Level !== -1) {
            if (_Account.Level < 1) {
                throw ({ Message: "Invalid value Level" })
            }
        }

        if (_Account.Level !== -1 && _Account.Father !== 1) {
            if (_Account.Level >= 1 && _Account.Father === -1) {
                throw ({ Message: "If account level is greater than 1, account must have a father" })
            }
        }

        if(_Account.PostableAccount && _Account.Type === -1){
            throw({Message: "Account cannot be postable if type is None"})
        }

        if(_Account.Type === -1 && !_Account.PostableAccount){
            throw({Message: "If Type is None account must be postable"})
        }

        return new Promise((resolve, reject) => {
            const SQLQuery = "UPDATE Accounts SET "
                + (_Account.Name ? + "\"Name\" = '" + _Account.Name + "', " : "")
                + (_Account.UpdateFather ? "FatherAcct = " + _Account.Father + ", " : "")
                + (_Account.UpdateBalance ? "Balance = '" + (_Account.Balance ? _Account.Balance : 0) + ", " : "")
                + (_Account.Level !== 0 ? + "\"Level\" = " + _Account.Level + ", " : "")                
                + "UpdateDate = '" + _Account.UpdateDate + "'"
                + "WHERE AcctCode = '" + _Account.Code + "'"

            Promise.all(([this.CodeExists(_Account.Code), this.NameExists(_Account.Name)])).then(([_CodeExists, _NameExists]) => {
                if (!_CodeExists) {
                    throw({ Message: "Code doesn't exists" })
                }

                if (_NameExists) {
                    throw({ Message: "Name already exists" })
                }

                MSSQLService.RunQuey(SQLQuery).then((_Updated) => {
                    if (_Updated.rowsAffected[0] !== 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }).catch((_Err) => {
                    reject(_Err)
                })
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }
}