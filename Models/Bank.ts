import { IResult } from "mssql";
import MSSQLService from "../Services/Database";
import Bank from "../Interfaces/Bank"

export default class BankModel implements Bank {
    public Entry: number = 0
    public Code: string = ""
    public Name: string = ""
    public ShortName: string = ""
    public BusinessName: string = ""
    public SWIFTBIC: string = ""
    public UserSign: number = -1
    public CreateDate: Date = new Date()
    public UpdateDate: Date = new Date()

    public CreateNew: boolean = false
    public ExactValues: string = 'Y'

    public GetAll() {
        const SQLQuery = "SELECT ROW_NUMBER() OVER(ORDER BY \"Entry\") as \"Key\", "
            + "\"Entry\", "
            + "\"Code\", "
            + "ShortName, "
            + "BusinessName, "
            + "SWIFTBIC, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM Banks"

        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Banks) => {
                resolve(_Banks.recordset)
            }).catch((Err) => {
                reject(Err)
            })
        })
    }

    public Search(): Promise<MSSQLService> {
        let Filter: any[] = []

        if (this.Code) {
            Filter.push("BankCode " + (this.ExactValues  === 'Y' ? " = '" + this.Code + "' " : "LIKE '%" + this.Code + "%'"))
        }

        if (this.ShortName) {
            Filter.push("ShortName " + (this.ExactValues  === 'Y' ? " = '" + this.ShortName + "' " : "LIKE '%" + this.ShortName + "%'"))
        }

        if (this.SWIFTBIC) {
            Filter.push("SWIFTBIC " + (this.SWIFTBIC ? " = '" + this.SWIFTBIC + "' " : "LIKE '%" + this.SWIFTBIC + "%'"))
        }
        
        return new Promise((resolve, reject) => {
            const SQLQuery =  "SELECT ROW_NUMBER() OVER(ORDER BY \"Entry\") as \"Key\", "
            + "\"Entry\", "
            + "\"Code\", "
            + "ShortName, "
            + "BusinessName, "
            + "SWIFTBIC, "
            + "UserSign, "
            + "CreateDate, "
            + "UpdateDate "
            + "FROM Banks "
            + "WHERE " + (Filter.join(this.ExactValues  === 'Y' ? " AND " : " OR "))

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
    
    public ExistCode() {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Banks "
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

    public ExistShortName() {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Banks "
            + "WHERE ShortName = '" + this.ShortName + "'"

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

    public ExistsBusinessName() {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Banks "
            + "WHERE BusinessName = '" + this.BusinessName + "'"

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

    public ExistsSWIFTBIC() {
        const SQLQuery = "SELECT ISNULL(COUNT(*),0) Register "
            + "FROM Banks "
            + "WHERE SWIFTBIC = '" + this.SWIFTBIC + "'"

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
        if (!this.Code) {
            throw({ Message: "Code cannot be empty" })
        }

        if (!this.ShortName) {
            throw({ Message: "Short Name cannot be empty" })
        }

        return new Promise((resolve, reject) => {
            Promise.all([this.ExistCode(), this.ExistShortName(), this.ExistsBusinessName(), this.ExistsSWIFTBIC()]).
            then(([_ExistsCode, _ExistShortName, _ExistsBusinessName, _ExistsSWIFTBIC]) => {
                if (_ExistsCode) {
                    reject({ Message: "Code already exists" })
                }

                if (_ExistShortName) {
                    reject({ Message: "Short Name already exists" })
                }

                if (_ExistsBusinessName) {
                    reject({ Message: "Business Name already exists" })
                }

                if (_ExistsSWIFTBIC) {
                    reject({ Message: "SWIFTBIC already exists" })
                }

                const SQLQuery = "INSERT INTO Banks "
                + "(\"Entry\", "
                + "\"Code\", "
                + "ShortName, "
                + (this.BusinessName ? "BusinessName, " : "")
                + (this.SWIFTBIC ? "SWIFTBIC, " : "")
                + "UserSign, "
                + "CreateDate) "
                + "VALUES "
                + "((SELECT ISNULL(MAX(\"Entry\"), 0) + 1 \"Entry\" FROM Banks), "
                + "'" + this.Code + "', "
                + "'" + this.ShortName + "', "
                + (this.BusinessName ? "'" + this.BusinessName + "', " : "")
                + (this.SWIFTBIC ? "'" + this.SWIFTBIC + "', " : "")
                + (this.UserSign !== 0 ? this.UserSign : -1) + ", "
                + "'" + this.CreateDate + "')"

                console.log(SQLQuery);
                
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
            const SQLQuery = "Update Banks SET "
            + (this.ShortName ? "ShortName = '" + this.ShortName + "', " : "")
            + (this.BusinessName ? "BusinessName = '"  + this.BusinessName + "', " : "")
            + (this.SWIFTBIC ? "SWIFTBIC = '" + this.SWIFTBIC + "', " : "")
            + "UpdateDate = '" + this.UpdateDate + "'"
            + "WHERE \"Code\" = '" + this.Code + "'" 

            Promise.all([this.ExistCode(), this.ExistShortName()])
            .then(([_ExistsCode, _ExistShortName]) => {
                if (!_ExistsCode) {
                    reject({ Message: "Code doesn't exists" })
                }

                if (_ExistShortName) {
                    reject({ Message: "Name already exists" })
                }
                
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
}