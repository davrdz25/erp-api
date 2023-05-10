import { ConnectionPool, IResult, MSSQLError } from "mssql";

export default class MSSQLService{
    public static RunQuey(Query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ConnectPool().then((conn) => {
                conn.query(Query).then((results: IResult<any>) => {
                    resolve(results)
                    conn.close()
                }).catch((err) => {           
                    reject({Code: err.code,  Name: err.name, Info: err.originalError.info})
                    conn.close()
                } )
            }).catch((Err) => {
                reject(Err)
            })
        })
    }

    private static ConnectPool():Promise<ConnectionPool> {
        const mssqlPool = {
            server: String(process.env.DBServer),
            user: process.env.DBUser,
            password: process.env.DBPassword,
            database: process.env.DBName,
            encrypt: false,
            'options.encrypt': false,
            options: {
                "enableArithAbort": true,
                trustServerCertificate: true,
            }
        }

        return new Promise((resolve, reject) => {
            new ConnectionPool(mssqlPool).connect().then((conn: ConnectionPool) => {
                if(conn.connected){
                    resolve(conn)
                }
            }).catch((err: MSSQLError) => {
                reject(err.originalError)
            })
        })
    }
}