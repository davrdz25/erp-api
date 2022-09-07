import { IResult } from "mssql";
import PaymentCategory from "../Interfaces/PaymentCategory";
import MSSQLService from "../Services/Database";

export default class PaymentCategoryModel implements PaymentCategory {
    public Entry: number = 0
    public Code: string = ""
    public Name: string = ""
    public Account: number = -1
    public UserSign: number = -1
    public CreateDate: Date = new Date()
    public UpdateDate: Date = new Date()

    public CreateNew: boolean = false
    public ExactValues: string = 'Y'

    private PymntCategories: PaymentCategory[] = []

    public GetAll() {
        const SQLQuery = "SELECT ROW_NUMBER() OVER(ORDER BY \"Entry\") AS \"Key\", "
            + "\"Entry\", "
            + "\"Code\", "
            + "\"Name\", "
            + "Account, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM PaymentCategories"

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_PymntCategories: IResult<MSSQLService>) => {
                if (_PymntCategories.recordset.length !== 0) {
                    resolve(_PymntCategories.recordset)
                } else {
                    reject({ Message: "No cards found" })
                }
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }

    public Search() {
        let Filter: any[] = []

        if (this.Code) {
            Filter.push("\"Code\" " + (this.ExactValues  === 'Y' ? "= '" + this.Code + "' " : "LIKE '%" + this.Code + "%'"))
        }

        if (this.Name) {
            Filter.push("\"Name\" " + (this.ExactValues  === 'Y' ? "= '" + this.Name + "' " : "LIKE '%" + this.Name + "%'"))
        }

        if(this.Entry > 0){
            Filter.push("\"Entry\" = ")
        }

        const SQLQuery = "SELECT ROW_NUMBER() OVER(ORDER BY \"Entry\") AS \"Key\", "
        + "\"Entry\", "
        + "\"Code\", "
        + "\"Name\", "
        + "Account, "
        + "UserSign, "
        + "CreateDate, "
        + "UpdateDate "
        + "FROM PaymentCategories "
        + "WHERE " + (Filter.join(this.ExactValues  === 'Y' ? " AND " : " OR "))

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Accounts: IResult<MSSQLService>) => {
                if (_Accounts.recordset.length !== 0) {
                    resolve(_Accounts.recordset)
                } else {
                    reject({ Message: "No payment categories found" })
                }
            }).catch((_Err) => {
                reject(_Err)
            })
        })
    }

    public CodeExists() {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM PaymentCategories "
            + "WHERE \"Code\" = '" + this.Code + "'"

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

    public NameExists() {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM PaymentCategories "
            + "WHERE  \"Name\" = '" + this.Name + "'"

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

    public Create(){
        if (!this.Code) {
            throw({ Message: "Code cannot be empty" })
        }

        if (!this.Name) {
            throw({ Message: "Name cannot be empty" })
        }

        if (this.Code && this.Code.length > 20) {
            throw({ Messge: "Code cannot be more than 20 characters" })
        }

        if (this.Name && this.Name.length > 100) {
            throw({ Messge: "Name cannot be more than 100 characters" })
        }

        if (this.Account <= -1) {
            throw({ Message: "Invalid value for account: "  + this.Account})
        }

        return new Promise((resolve, reject) => {
            const SQLQuery = "INSERT INTO PaymentCategories ("
            + "\"Entry\", "
            + "\"Code\", "
            + "\"Name\", "
            + "Account, "
            + "UserSign, "
            + "CreateDate "
            + ") VALUES ("
            + "(SELECT ISNULL(MAX(\"Entry\"), 0) + 1 \"Entry\" FROM PaymentCategories), "
            + "'" + this.Code + "', "
            + "'" + this.Name + "', "
            + this.Account + ", "
            + this.UserSign + ", "
            + "'" + this.CreateDate + "')"
            
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

    public Update(){
        if (this.Name && this.Name.length > 100) {
            throw({ Messge: "Name cannot be more than 100 characters" })
        }

        return new Promise((resolve, reject) => {
            Promise.all([this.CodeExists(), this.NameExists()]).then(([_CodeExists, _NameExists]) => {

            }).catch((_Err) => {
                reject(_Err)
            })
            
            const SQLQuery = "UPDATE PaymentCategories SET "
                + (this.Name ? "\"Name\" = '" + this.Name + "', " : "")
                + (this.Account !== -1 ? "Account = " + this.Account + ", " : "")
                + ("'" + this.UpdateDate.toString() + "' ")
                + "WHERE "+ (this.Code ? "Code = '" + this.Code + "'" : "\"Entry\" = " + this.Entry)            
        })
    }
}