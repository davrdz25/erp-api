import { IResult } from "mssql";
import Card from "../Interfaces/Card";
import MSSQLService from "../Services/Database";

export default class CardModel implements Card {
    public Entry: number = -1
    public Code: string = ""
    public Name: string = ""
    public Number: number = -1
    public ValidFromMonth: number = -1
    public ValidFromYear: number = -1
    public ValidUntilMonth: number = -1
    public ValidUntilYear: number = -1
    public Digital: boolean = false
    public Account: number = -1
    public Bank: number = -1
    public UserSign: number = -1
    public CreateDate: Date = new Date()
    public UpdateDate: Date = new Date()

    public CreateNew: boolean = false
    public ExactValues: string = 'Y'

    constructor(_Card?: Card){
        if(_Card !== undefined){
            this.Entry = _Card.Entry
            this.Code = _Card.Code
            this.Name = _Card.Name
            this.ValidFromMonth = _Card.ValidFromMonth
            this.ValidFromYear = _Card.ValidFromYear
            this.ValidUntilMonth = _Card.ValidUntilMonth
            this.ValidUntilYear = _Card.ValidUntilYear
            this.Digital = _Card.Digital
            this.Account = _Card.Account
            this.Bank = _Card.Bank
            this.UserSign = _Card.UserSign
            this.CreateDate = _Card.CreateDate
            this.UpdateDate = _Card.UpdateDate

            this.CreateNew = _Card.CreateNew
            this.ExactValues = _Card.ExactValues
        }
    }
    public GetAll() {
        const SQLQuery = "SELECT "
            + "\"Entry\", "
            + "\"Code\", "
            + "\"Name\", "
            + "\"Number\", "
            + "ValidFromMonth, "
            + "ValidFromYear, "
            + "ValidUntilMonth, "
            + "ValidUntilYear, "
            + "Bank, "
            + "Account, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM Cards "

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Cards) => {
                resolve(_Cards.recordset[0])
            }).catch((Err) => {
                reject(Err)
            })

        })
    }

    public Search(): Promise<MSSQLService> {
        return new Promise((resolve, reject) => {
            let Filter: any[] = []

            if (this.Code) {
                Filter.push("CardCode " + (this.ExactValues  === 'Y' ? "= '" + this.Code + "' " : "LIKE '%" + this.Code + "%'"))
            }

            if (this.Name) {
                Filter.push("CardName " + (this.ExactValues  === 'Y' ? "= '" + this.Name + "' " : "LIKE '%" + this.Name + "%'"))
            }

            if (this.Bank) {
                Filter.push("Bank = " + this.Bank + " ")
            }

            if (this.Number) {
                Filter.push("CardNumber " + (this.ExactValues  === 'Y' ? "= '" + this.Number + "' " : "LIKE '%" + this.Number + "%'"))
            }

            const SQLQuery = "SELECT "
                + "\"Entry\", "
                + "\"Code\", "
                + "\"Name\", "
                + "\"Number\", "
                + "ValidFromMonth, "
                + "ValidFromYear, "
                + "ValidUntilMonth, "
                + "ValidUntilYear, "
                + "Bank, "
                + "Account, "
                + "UserSign, "
                + "CreateDate, "
                + "UpdateDate "
                + "FROM Cards "
                + "WHERE " + (Filter.join(this.ExactValues  === 'Y' ? " AND " : " OR "))

            MSSQLService.RunQuey(SQLQuery).then((_Banks: IResult<MSSQLService>) => {
                if (_Banks.recordset.length !== 0) {
                    resolve(_Banks.recordset)
                } else {
                    reject({ Message: "No cards found" })
                }
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }

    public Create() {
        return new Promise((resolve, reject) => {
            Promise.all([this.ExistsCode(), this.ExistsName(), this.ExistsNumber()]).then(([_ExistsCode, _ExistsName, _ExistsNumber]) => {
                if (_ExistsCode) {
                    reject({ Message: "Code already exists" })
                }

                if (_ExistsName) {
                    reject({ Message: "Name already exists" })
                }

                if (_ExistsNumber) {
                    reject({ Message: "Number already exists" })
                }

                const SQLQuery = "INSERT INTO Cards ("
                    + "CardEntry, "
                    + "CardCode, "
                    + "CardName, "
                    + "CardNumber, "
                    + "ValidThruMonth, "
                    + "ValidThruYear, "
                    + "Bank, "
                    + "Account, "
                    + "Credit, "
                    + "IsActive, "
                    + "DigitalCard, "
                    + "UserSign, "
                    + "CreateDate "
                    + ") "
                    + "VALUES "
                    + "( (SELECT ISNULL(MAX(CardEntry), 0) + 1 CardEntry FROM Cards), "
                    
                    + this.UserSign + ", "
                    + "'" + this.CreateDate + "' "
                    + ")"

                MSSQLService.RunQuey(SQLQuery).then((_Created) => {
                    if (_Created.rowsAffected[0] !== 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }).catch((Err) => {
                    reject(Err)
                })
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }


    public Update() {
        return new Promise((resolve, reject) => {
            Promise.all([this.ExistsCode(), this.ExistsName(), this.ExistsNumber(), this.Active()]).then(([_ExistsCode, _ExistsName, _ExistsNumber, _isActive]) => {
                if (!_ExistsCode) {
                    reject({ Message: "Code doesn't exists" })
                }

                if (_ExistsName) {
                    reject({ Message: "Name already exists" })
                }

                if (_ExistsNumber) {
                    reject({ Message: "Number already exists" })
                }

                const SQLQuery = "UPDATE Cards SET "
                    + (this.Name ? "CardName = '" + this.Name + "', " : "")
                    + (this.Number ? "CardNumber = '" + this.Number + "', " : "")
                    + (((this.Bank != undefined) || this.Bank !== 0) ? "Bank = " + this.Bank + ", " : "")
                   
                    + "UpdateDate = '" + this.UpdateDate + "'"
                    + "WHERE CardCode = '" + this.Code + "'"

                MSSQLService.RunQuey(SQLQuery).then((_Updated) => {

                    if (_Updated.rowsAffected[0] !== 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }).catch((Err) => {
                    reject(Err)
                })
            }).catch((_Err) => {
                reject(_Err)
            })

        })
    }

    public ExistsCode() {
        return new Promise((resolve, reject) => {
            const SQLQuery = "SELECT ISNULL(COUNT(*), 0) Register "
                + "FROM Cards "
                + "WHERE CardCode = '" + this.Code + "'"

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

    public ExistsName() {
        return new Promise((resolve, reject) => {
            const SQLQuery = "SELECT ISNULL(COUNT(*), 0) Register "
                + "FROM Cards WHERE "
                + "CardName = '" + this.Name + "'"

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

    public ExistsNumber() {
        return new Promise((resolve, reject) => {
            const SQLQuery = "SELECT ISNULL(COUNT(*), 0) Register "
                + "FROM Cards "
                + "WHERE CardCode = '" + this.Number + "'"

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

    public Active() {
        return new Promise((resolve, reject) => {
            const SQLQuery = "SELECT IsActive Active "
                + "FROM Cards "
                + "WHERE CardCode = '" + this.Code + "'"

            MSSQLService.RunQuey(SQLQuery).then((_isActive) => {
                if (_isActive.recordset.Active === "Y") {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }).catch((Err) => {
                (Err)
                reject(Err)
            })
        })
    }
}