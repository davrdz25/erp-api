import { IResult } from "mssql";
import Payment from "../Interfaces/Payment";
import MSSQLService from "../Services/Database";

export default class PaymentModel implements Payment{
    public Entry: number = -1
    public Prefix: string = ""
    public Number: number = -1
    public Comments: string = ""
    public PayDate: Date = new Date()
    public PayTime: Date = new Date()
    public Type: number = -1
    public Category: number = -1
    public Account: number = -1
    public Ammount: number = -1
    public UserSign: number = -1
    public CreateDate: Date = new Date()
    public UpdateDate: Date = new Date()
    public ExactValues: string = 'Y'

    public GetAll() {
        const sqlQuery = "SELECT ROW_NUMBER() OVER(ORDER BY \"Entry\") as \"Key\", "
            + "\"Entry\", "
            + "Prefix, "
            + "\"Number\", "
            + "PayDate, "
            + "PayTime, "
            + "Type, "
            + "Category, "
            + "Account, "
            + "Ammount, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM Payments"

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(sqlQuery).then((_Banks) => {
                resolve(_Banks.recordset)
            }).catch((Err) => {
                reject(Err)
            })
        })
    }

    public Search(): Promise<MSSQLService> {
        let Filter: any[] = []

        if (this.Prefix) {
            Filter.push("Prefix " + (this.ExactValues  === 'Y' ? " = '" + this.Prefix + "' " : "LIKE '%" + this.Prefix + "%'"))
        }

        if (this.Number !== -1) {
            Filter.push("Numver =  " + this.Number)
        }

        if(this.Account !== -1) {
            Filter.push("Account = " + this.Account)
        }

        if(this.Category !== -1) {
            Filter.push("Category = " + this.Category)
        } 

        const SQLQuery =  "SELECT ROW_NUMBER() OVER(ORDER BY \"Entry\") as \"Key\", "
        + "\"Entry\", "
        + "Prefix, "
        + "\"Number\", "
        + "PayDate, "
        + "PayTime, "
        + "Type, "
        + "Category, "
        + "Account, "
        + "Ammount, "
        + "UserSign, "
        + "CreateDate, "
        + "UpdateDate "
        + "FROM Payments"
        + "WHERE " + (Filter.join(this.ExactValues  === 'Y' ? " AND " : " OR "))

        return new Promise((resolve, reject) => {
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

    public ExistsPrefixNumber() {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Payments "
            + "WHERE Prefix = '" + this.Prefix + "' AND \"Number\" = " + this.Number
            
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

    public ExistsPrefix() {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Payments "
            + "WHERE Prefix = '" + this.Prefix + "'"

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
    
    public Create() {
        return new Promise((resolve, reject) => {
            const SQLQuery = "INSERT INTO Payments "
                + "(\"Entry\", "
                + "Prefix, "
                + "Number, "
                + (this.Comments ? "Comments, " : "")
                + "PayDate, "
                + "PayTime, "
                + "Type, "
                + "Category, "
                + "Account, "
                + "Ammount, "
                + "UserSign, "
                + "CreateDate) "
                + "VALUES "
                + "((SELECT ISNULL(MAX(\"Entry\"), 0) + 1 \"Entry\" FROM Payments), "
                + "'" + this.Prefix + "', "
                + this.Number + ", "
                + (this.Comments ? "'" + this.Comments + "', " : "")
                + "'" + this.PayDate + "', "
                + "'" + this.PayTime + "', "
                + this.Type + ", "
                + this.Category + ", "
                + this.Account + ", "
                + this.Ammount + ", "
                + (this.UserSign !== 0 ? this.UserSign : -1) + ", "
                + "'" + this.CreateDate + "')"
                
            this.ExistsPrefixNumber().then((_Exists) => {
                if(_Exists){
                    reject({Message: "Prefix and number already exists"})
                }

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
            const SQLQuery = "UPDATE Payments "
            + (this.Comments ? "Comments = '" + this.Comments + "', " : "")
            + (this.Prefix ? "Prefix = '" + this.Prefix + "', " : "")
            + (this.Number !== -1 ? "\"Number\" = " + this.Number + ", " : "")
            + (this.Ammount !== -1 ? "Ammount = " + this.Ammount + ", " : "")
            + "UpdateDate = '" + this.UpdateDate + "'"

            if(this.Prefix && this.Number !== -1){
                Promise.all([this.ExistsPrefix(), this.ExistsPrefix()]).then(([_ExistsPrefix, _ExistsPrefixNumber]) => {
                    if(!_ExistsPrefix){
                        reject({Message: "Prefix doesn't exists"})
                    }
    
                    if(_ExistsPrefixNumber){
                        reject({Message: "Prefix an number already exists"})
                    }
                }).catch((_Err) => {
                    reject(_Err)
                })
            }

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
}