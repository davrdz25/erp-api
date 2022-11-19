import MSSQLService from "../Services/Database";
import IBankAccount from "../Interfaces/BankAccount"

export default class BankAccountModel {
    public static GetAll() {
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

    public static Search(_Bank: IBankAccount) {
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

    public static ExistsCode(_Code: string) {
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

    public static ExistsName(_Name: string) {
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

    public static ExistsSWIFTBIC(_SWIFTBIC: string) {
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

    public static Create(_BankAcct: IBankAccount) {
        if (!_BankAcct.Name) {
            throw ({ Message: "Name can't be empty" })
        }

        if (!_BankAcct.Code) {
            throw ({ Message: "Code can't be empty" })
        }


        if (_BankAcct.Account <= 0) {
            throw ({ Message: "Invalid  account" })
        }

        if (_BankAcct.Bank <= 0) {
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

    public static Update() {
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
