import MSSQLService from "../Services/Database";
import IBankAccount from "../Interfaces/BankAccount"
import { IResult } from "mssql";

interface StoredProcedureOutput {
    ErrNumber: number,
    ProcName: string,
    State: string,
    Message: string;
}

export default class BankAccountModel {
    public static GetAll() {
        const SQLQuery = "SELECT "
            + "\"Entry\", "
            + "\"Name\", "
            + "BankEntry, "
            + "AcctEntry, "
            + "SWIFTBIC, "
            + "Account, "
            + "Credit, "
            + "CreditLimit, "
            + "CreditDebt, "
            + "AviableCredit, "
            + "CutOffDay, "
            + "PayDayLimit, "
            + "DebitBalance, "
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
            Filter.push("\"Code\"" + (_Bank.ExactValues === 'Y' ? " = '" + _Bank.Code + "' " : "LIKE '%" + _Bank.Code + "%'"))
        }

        if (_Bank.Name) {
            Filter.push("\"Name\"" + (_Bank.ExactValues === 'Y' ? " = '" + _Bank.Name + "' " : "LIKE '%" + _Bank.Code + "%'"))
        }

        if (_Bank.SWIFTBIC) {
            Filter.push("SWIFTBIC" + (_Bank.ExactValues === 'Y' ? " = '" + _Bank.SWIFTBIC + "' " : "LIKE '%" + _Bank.Code + "%'"))
        }

        if (_Bank.AcctEntry) {
            Filter.push("Account" + (_Bank.ExactValues === 'Y' ? " = '" + _Bank.AcctEntry + "' " : "LIKE '%" + _Bank.Code + "%'"))
        }

        const SQLQuery = "SELECT "
            + "\"Entry\", "
            + "\"Name\", "
            + "BankEntry, "
            + "AcctEntry, "
            + "SWIFTBIC, "
            + "Account, "
            + "Credit, "
            + "CreditLimit, "
            + "CreditDebt, "
            + "AviableCredit, "
            + "CutOffDay, "
            + "PayDayLimit, "
            + "DebitBalance, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM BankAccounts "
            + "WHERE " + (Filter.join(_Bank.ExactValues === 'Y' ? " AND " : " OR "))

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
        return new Promise((resolve, reject) => {
            const SQLQuery = "EXECUTE CreateBankAccount "
                + "'" + _BankAcct.Name + "', "
                + _BankAcct.BankEntry + ", "
                + _BankAcct.AcctEntry + ", "
                + (_BankAcct.SWIFTBIC ? "'" + _BankAcct.SWIFTBIC + "', " : "NULL, ")
                + "'" + _BankAcct.Credit + "', "
                + _BankAcct.CreditLimit + ", "
                + _BankAcct.CreditDebt + ", "
                + _BankAcct.AviableCredit + ", "
                + _BankAcct.CutOffDay + ", "
                + _BankAcct.PayDayLimit + ", "
                + _BankAcct.DebitBalance + ", "
                + "'" + _BankAcct.CreateDate + "'"

                MSSQLService.RunQuey(SQLQuery).then((_Created: IResult<StoredProcedureOutput>) => {
                    if (_Created.recordset[0].ErrNumber === 500) {
                        reject({ Message: _Created.recordset })
                    }
                    resolve(_Created.recordset)
                }).catch((_Err) => {
                    reject(_Err)
                })
        })
    }

    public static Update(_BankAcct: IBankAccount) {
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
