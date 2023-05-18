import { IResult } from "mssql";
import IUser from "../Interfaces/User";
import MSSQLService from "../Services/Database";
import StoredProcedureOutput from "../Interfaces/StoredProcedureOutput";

export default class UserModel {
    public static CreateUser(_NewUser: IUser){
        const SQLQuery: string = `EXECUTE CreateUser  
                                    '${_NewUser.Code}',
                                    '${_NewUser.Name}',
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
                    reject({Message: _Created.recordset})
                }
                else
                    resolve(_Created.recordset)
            }).catch((_Err: any) => {
                reject({"Message": _Err})
            })
        })
    }
}