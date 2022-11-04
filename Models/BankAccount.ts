import MSSQLService from "../Services/Database";
import IBankAccount from "../Interfaces/BankAccount"

export default class BankAccountModel {
    public GetAll() {
        const SQLQuery = "SELECT "
            + "\"Entry\", "
            + "\"Code\", "
            + "\"Name\", "
            + "Bank, "
            + "SWIFTBIC, "
            + "Account, "
            + "Credit, "
            + "DebitBalance, "
            + "CreditDebt, "
            + "AviableCredit, "
            + "CutOffDay, "
            + "PayDayLimit, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM BankAccounts"

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_BankAccounts) => {
                resolve(_BankAccounts.recordset)
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }

    public Search(_BankAcct: IBankAccount) {
        let Filter: string[] = []

        if (_BankAcct.Code) {
            Filter.push("\"Code\"" + (_BankAcct.ExactValues === 'Y' ? " = '" + _BankAcct.Code + "' " : "LIKE '%" + _BankAcct.Code + "%'"))
        }

        if (_BankAcct.Name) {
            Filter.push("\"Name\"" + (_BankAcct.ExactValues === 'Y' ? " = '" + _BankAcct.Name + "' " : "LIKE '%" + _BankAcct.Code + "%'"))
        }

        if (_BankAcct.SWIFTBIC) {
            Filter.push("SWIFTBIC" + (_BankAcct.ExactValues === 'Y' ? " = '" + _BankAcct.SWIFTBIC + "' " : "LIKE '%" + _BankAcct.Code + "%'"))
        }
        
        if (_BankAcct.Account) {
            Filter.push("Account" + (_BankAcct.ExactValues === 'Y' ? " = '" + _BankAcct.Account + "' " : "LIKE '%" + _BankAcct.Code + "%'"))
        }

        const SQLQuery = "SELECT "
            + "\"Entry\", "
            + "\"Code\", "
            + "\"Name\", "
            + "Bank, "
            + "SWIFTBIC, "
            + "Account, "
            + "Credit, "
            + "DebitBalance"
            + "CreditDebt, "
            + "AviableCredit, "
            + "CutOffDay, "
            + "PayDayLimit, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM BankAccounts "
            + "WHERE " + (Filter.join(_BankAcct.ExactValues === 'Y' ? " AND " : " OR "))

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_BankAccounts) => {
                resolve(_BankAccounts.recordset)
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }

    public ExistsCode(_Code: string | undefined) {
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

    public ExistsName(_Name: string) {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Accounts "
            + "WHERE \"Name\" = '" + _Name + "'"

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

    public ExistsSWIFTBIC(_SWIFTBIC: string) {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Accounts "
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

    public Create(_BankAcct: IBankAccount) {
        if (!_BankAcct.Name) {
            throw ({ Message: "Name can't be empty" })
        }

        if (!_BankAcct.Code) {
            throw ({ Message: "Code can't be empty" })
        }


        if (_BankAcct.Account <= 0) {
            throw ({ Message: "Invalid  account" })
        }

        if (_BankAcct.BankEntry <= 0) {
            throw ({ Message: "Invalid  bank" })
        }

        if (_BankAcct.Credit === 'Y' && (_BankAcct.CutOffDay < 1 || _BankAcct.CutOffDay > 31)) {
            throw ({ Message: "Invalid cut off day" })
        }

        if (_BankAcct.Credit === 'Y' && (_BankAcct.PayDayLimit < 1 || _BankAcct.PayDayLimit > 31)) {
            throw ({ Message: "Invalid Pay day limit" })
        }

        return new Promise((resolve, reject) => {
            const SQLQuery = "INSERT INTO BankAccounts ("
                + "\"Entry\", "
                + "\"Code\", "
                + "\"Name\", "
                + "Bank, "
                + (_BankAcct.SWIFTBIC ? "SWIFTBIC, " : "")
                + "Account, "
                + "Credit ,"
                + (_BankAcct.DebitBalance !== -1 ? "DebitBalance, " : "")
                + (_BankAcct.Credit ? "CreditDebt, " : "")
                + (_BankAcct.Credit ? "AviableCredit, " : "")
                + (_BankAcct.Credit ? "CutOffDate, " : "")
                + (_BankAcct.Credit ? "PayDayLimit, " : "")
                + "UserSign, "
                + "CreateDate"
                + ") VALUES ("
                + "(SELECT ISNULL(MAX(\"Entry\"), 0) + 1 \"Entry\" FROM BankAccounts),"
                + "'" + _BankAcct.Code + "', "
                + "'" + _BankAcct.Name + "', "
                + _BankAcct.BankEntry + ", "
                + _BankAcct.Account + ", "
                + (_BankAcct.SWIFTBIC ? "'" + _BankAcct.SWIFTBIC + "', " : "")
                + (_BankAcct.Credit ? "1, " : "0, ")
                + (_BankAcct.DebitBalance !== -1 ? _BankAcct.DebitBalance + ", " : "")
                + (_BankAcct.Credit ? _BankAcct.CreditDebt + ", " : "")
                + (_BankAcct.Credit ? _BankAcct.AviableCredit + ", " : "")
                + (_BankAcct.Credit ? _BankAcct.CutOffDay + ", " : "")
                + (_BankAcct.Credit ? _BankAcct.PayDayLimit + ", " : "")
                + _BankAcct.UserSign + ", "
                + "'" + _BankAcct.CreateDate + "')"

            Promise.all([this.ExistsCode(_BankAcct.Code), this.ExistsName(_BankAcct.Name), _BankAcct.SWIFTBIC ? this.ExistsSWIFTBIC(_BankAcct.SWIFTBIC) : ""]).then(([_ExistsCode, _ExistsName, _ExistsSWIFTBIC]) => {
                if (_ExistsCode) {
                    reject({ Message: "Code already exists" })
                }

                if (_ExistsName) {
                    reject({ Message: "Name already exists" })
                }

                if (_BankAcct.SWIFTBIC) {
                    if (_ExistsSWIFTBIC) {
                        reject({ Message: "SWIFTBIC already exists" })
                    }
                }
            }).catch((_Err) => {
                reject(_Err)
            })

            MSSQLService.RunQuey(SQLQuery).then((_Created) => {
                if (_Created.rowsAffected[0] === 1) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }

    public Update(_BankAcct: IBankAccount) {
        return new Promise((resolve, reject) => {
            const SQLQuery = "Update BankAccounts SET"
                + (_BankAcct.Name ? "\"Name\" = '" + "'" + _BankAcct.Name + "', " : "")
                + (_BankAcct.BankEntry !== 0 ? "Bank = " + _BankAcct.BankEntry + ", " : "")
                + (_BankAcct.SWIFTBIC ? "SWIFTBIC = '" + "'" + _BankAcct.SWIFTBIC + "', " : "")
                + "Credit = " + (_BankAcct.Credit ? "1, " : "0, ")
                + (_BankAcct.DebitBalance !== -1 ? "DebitBalance = " + _BankAcct.DebitBalance + ", " : "")
                + ((_BankAcct.Credit && _BankAcct.CreditDebt !== -1) ? "CreditDebt = " + _BankAcct.CreditDebt + ", " : "")
                + ((_BankAcct.Credit && _BankAcct.AviableCredit !== -1) ? "AviableCredit, " + _BankAcct.AviableCredit + ", " : "")
                + ((_BankAcct.Credit && _BankAcct.CutOffDay !== -1) ? "CutOffDate, " + _BankAcct.CutOffDay + ", " : "")
                + ((_BankAcct.Credit && _BankAcct.PayDayLimit !== -1) ? "PayDayLimit, " + _BankAcct.PayDayLimit + ", " : "")
                + "UpdateDate = '" + _BankAcct.UpdateDate + "' "
                + "WHERE \"Code\" = '" + _BankAcct.Code + "'"

            Promise.all([this.ExistsCode(_BankAcct.Code), this.ExistsName(_BankAcct.Name), _BankAcct.SWIFTBIC ? this.ExistsSWIFTBIC(_BankAcct.SWIFTBIC) : ""]).then(([_ExistsCode, _ExistsName, _ExistsSWIFTBIC]) => {
                if (!_ExistsCode) {
                    reject({ Message: "Code doesn't exists" })
                }

                if (_ExistsName) {
                    reject({ Message: "Name already exists" })
                }

                if (_BankAcct.SWIFTBIC) {
                    if (_ExistsSWIFTBIC) {
                        reject({ Message: "SWIFTBIC already exists" })
                    }
                }
            }).catch((_Err) => {
                reject(_Err)
            })

            MSSQLService.RunQuey(SQLQuery).then((_Updated) => {
                if (_Updated.rowsAffected[0] === 1) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }
}
