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
        '${process.env.SaltPass}, '
        -1,
        '${_Session.LoginDate}'
        `
        return new Promise((resolve, reject) => {
            MSSQLService.RunQuey(SQLQuery).then((_Created: IResult<StoredProcedureOutput>) => {
                resolve(_Created.output)
            }).catch((_Err: IResult<StoredProcedureOutput>) => {
                reject(_Err.output)
            })
        })
    } 
    
    public static Update(_Session: ISession){

    }
}