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

    public Search(_Bank: IBankAccount) {
        let Filter: string[] = []

        if (_Bank.Code) {
            Filter.push("\"Code\"" + (this.ExactValues === 'Y' ? " = '" + this.Code + "' " : "LIKE '%" + this.Code + "%'"))
        }

        if (_IBank.Name) {
            Filter.push("\"Name\"" + (this.ExactValues === 'Y' ? " = '" + this.Name + "' " : "LIKE '%" + this.Code + "%'"))
        }

        if (_Bank.SWIFTBIC) {
            Filter.push("SWIFTBIC" + (this.ExactValues === 'Y' ? " = '" + this.SWIFTBIC + "' " : "LIKE '%" + this.Code + "%'"))
        }
        
        if (_Bank.Account) {
            Filter.push("Account" + (this.ExactValues === 'Y' ? " = '" + _IBank.Account + "' " : "LIKE '%" + this.Code + "%'"))
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
            + "WHERE " + (Filter.join(this.ExactValues === 'Y' ? " AND " : " OR "))

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_BankAccounts) => {
                resolve(_BankAccounts.recordset)
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }

    public ExistsCode(_Code: string) {
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


        if (this.Account <= 0) {
            throw ({ Message: "Invalid  account" })
        }

        if (this.Bank <= 0) {
            throw ({ Message: "Invalid  bank" })
        }

        if (this.Credit && (this.CutOffDay < 1 || this.CutOffDay > 31)) {
            throw ({ Message: "Invalid cut off day" })
        }

        if (this.Credit && (this.PayDayLimit < 1 || this.PayDayLimit > 31)) {
            throw ({ Message: "Invalid Pay day limit" })
        }


        return new Promise((resolve, reject) => {
            const SQLQuery = "INSERT INTO BankAccounts ("
                + "\"Entry\", "
                + "\"Code\", "
                + "\"Name\", "
                + "Bank, "
                + (this.SWIFTBIC ? "SWIFTBIC, " : "")
                + "Account, "
                + "Credit ,"
                + (this.DebitBalance !== -1 ? "DebitBalance, " : "")
                + (this.Credit ? "CreditDebt, " : "")
                + (this.Credit ? "AviableCredit, " : "")
                + (this.Credit ? "CutOffDate, " : "")
                + (this.Credit ? "PayDayLimit, " : "")
                + "UserSign, "
                + "CreateDate"
                + ") VALUES ("
                + "(SELECT ISNULL(MAX(\"Entry\"), 0) + 1 \"Entry\" FROM BankAccounts),"
                + "'" + this.Code + "', "
                + "'" + this.Name + "', "
                + this.Bank + ", "
                + this.Account + ", "
                + (this.SWIFTBIC ? "'" + this.SWIFTBIC + "', " : "")
                + (this.Credit ? "1, " : "0, ")
                + (this.DebitBalance !== -1 ? this.DebitBalance + ", " : "")
                + (this.Credit ? this.CreditDebt + ", " : "")
                + (this.Credit ? this.AviableCredit + ", " : "")
                + (this.Credit ? this.CutOffDay + ", " : "")
                + (this.Credit ? this.PayDayLimit + ", " : "")
                + this.UserSign + ", "
                + "'" + this.CreateDate + "')"

            Promise.all([this.ExistsCode(), this.ExistsName(), this.SWIFTBIC ? this.ExistsSWIFTBIC() : ""]).then(([_ExistsCode, _ExistsName, _ExistsSWIFTBIC]) => {
                if (_ExistsCode) {
                    reject({ Message: "Code already exists" })
                }

                if (_ExistsName) {
                    reject({ Message: "Name already exists" })
                }

                if (this.SWIFTBIC) {
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

    public Update() {
        return new Promise((resolve, reject) => {
            const SQLQuery = "Update BankAccounts SET"
                + (this.Name ? "\"Name\" = '" + "'" + this.Name + "', " : "")
                + (this.Bank !== 0 ? "Bank = " + this.Bank + ", " : "")
                + (this.SWIFTBIC ? "SWIFTBIC = '" + "'" + this.SWIFTBIC + "', " : "")
                + "Credit = " + (this.Credit ? "1, " : "0, ")
                + (this.DebitBalance !== -1 ? "DebitBalance = " + this.DebitBalance + ", " : "")
                + ((this.Credit && this.CreditDebt !== -1) ? "CreditDebt = " + this.CreditDebt + ", " : "")
                + ((this.Credit && this.AviableCredit !== -1) ? "AviableCredit, " + this.AviableCredit + ", " : "")
                + ((this.Credit && this.CutOffDay !== -1) ? "CutOffDate, " + this.CutOffDay + ", " : "")
                + ((this.Credit && this.PayDayLimit !== -1) ? "PayDayLimit, " + this.PayDayLimit + ", " : "")
                + "UpdateDate = '" + this.UpdateDate + "' "
                + "WHERE \"Code\" = '" + this.Code + "'"

            Promise.all([this.ExistsCode(), this.ExistsName(), this.SWIFTBIC ? this.ExistsSWIFTBIC() : ""]).then(([_ExistsCode, _ExistsName, _ExistsSWIFTBIC]) => {
                if (!_ExistsCode) {
                    reject({ Message: "Code doesn't exists" })
                }

                if (_ExistsName) {
                    reject({ Message: "Name already exists" })
                }

                if (this.SWIFTBIC) {
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
