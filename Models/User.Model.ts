import { IResult } from "mssql";
import IUser from "../Interfaces/User";
import MSSQLService from "../Services/Database";
import StoredProcedureOutput from "../Interfaces/StoredProcedureOutput";

export default class UserModel {
    public static CreateUser(_NewUser: IUser){
        const SQLQuery: string = `EXECUTE CreateUser  
                                    '${_NewUser.Code}',
                                    '${_NewUser.Name}',
                                    '${_NewUser.Email}',
                                    ${!_NewUser.Comments ? "NULL, " : "'" +  _NewUser.Comments + "', "}
                                    '${process.env.SaltPass}', 
                                    '${_NewUser.Password}', 
                                    -1,
                                    '20230501'
                                    `
        console.log(SQLQuery);
        
        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Created: IResult<StoredProcedureOutput>) => {
                if(_Created.recordset[0].ErrNumber === 500){
                    reject({Message: _Created.output})
                }
                else {
                    resolve(_Created.output)
                }
            }).catch((_Err: any) => {
                reject({"Message": _Err})
            })
        })
    }

    public static ExistsEntry(_Entry: number): Promise<boolean>{
        const SQLQuery = `SELECT COUNT("Entry") "Contar" FROM Users WHERE "Entry" = ${_Entry}`
        console.log(SQLQuery);
        
        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Result: IResult<any>) => {
                if(_Result.recordset[0].Contar === 0){
                    resolve(false)
                }
                else {
                    resolve(true)
                }
            }).catch((_Err) => {
                reject({Message: _Err})
            })
        })
    }

    public static ExistsCode(_Code: string): Promise<boolean>{
        const SQLQuery = `SELECT COUNT("Code") "Contar" FROM Users WHERE "Code" = ${_Code}`
        console.log(SQLQuery);
        
        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Result: IResult<any>) => {
                if(_Result.recordset[0].Contar === 0){
                    resolve(false)
                }
                else {
                    resolve(true)
                }
            }).catch((_Err) => {
                reject({Message: _Err})
            })
        })
    }

    public static Search(_Param: number | IUser){
        if(typeof(_Param) === "number"){
            return new Promise((resolve, reject) => {
                this.ExistsEntry(_Param as number).then((_Exists: boolean) => {
                    if(!_Exists){
                        reject({Message: "No users fond"})
                    } else {
                        const SQLQuery = `SELECT "Entry",
                                         "Code",
                                         "Name",
                                         Email,
                                         Comments,
                                         isLocked,
                                         isActive,
                                         isLoggedIn,
                                         CreateDate,
                                         UpdateDate,
                                         UserSign 
                                         FROM Users 
                                         WHERE "Entry" = ${_Param}`
    
                        MSSQLService.RunQuey(SQLQuery).then((_Result: IResult<IUser>) => {
                            resolve(_Result.recordset[0])
                        }).catch((_Err) => {
                            resolve(_Err)
                        })
                    }
                }).catch((_Err) => {
                    reject(_Err)
                })
            })
        }
        else {
            return new Promise((resolve, reject) => {
                this.ExistsEntry(_Param.Entry).then((_Exists: boolean) => {
                    if(!_Exists){
                        reject({Message: "No users fond"})
                    } else {
                        const SQLQuery = `SELECT "Entry",
                                         "Code",
                                         "Name",
                                         Comments,
                                         isLocked,
                                         isActive,
                                         isLoggedIn,
                                         CreateDate,
                                         UpdateDate,
                                         UserSign 
                                         FROM Users 
                                         WHERE "Entry" = ${_Param}`
    
                        MSSQLService.RunQuey(SQLQuery).then((_Result: IResult<any>) => {
                            resolve(_Result.recordset)
                        }).catch((_Err) => {
                            resolve(_Err)
                        })
                    }
                }).catch((_Err) => {
                    reject(_Err)
                })
            })  
        }
    }
}