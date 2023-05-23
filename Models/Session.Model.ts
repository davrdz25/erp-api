import { IResult } from "mssql";
import ISession from "../Interfaces/Session";
import MSSQLService from "../Services/Database";
import StoredProcedureOutput from "../Interfaces/StoredProcedureOutput";

export default class SessionModel {
    public static Create(_Session: ISession){
        const SQLQuery = `EXECUTE CreateSession
        ${_Session.Entry},
        '${_Session.Code}',
        '${_Session.Password}', 
        '${process.env.SaltPass}',
        -1,
        '${_Session.LoginDate}'
        `
        console.log(SQLQuery);
        
        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Created) => {
                if(_Created.recordset.ErrNumber !== 200)
                    reject(_Created.recordset)

                resolve(_Created)
            }).catch((_Err: IResult<any>) => {
                reject(_Err.recordset)
            })
        })
    }
}