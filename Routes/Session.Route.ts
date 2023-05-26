import { Body, JsonController, Post, Res } from "routing-controllers";
import ISession from "../Interfaces/Session";
import SessionModel from "../Models/Session.Model";
import StoredProcedureOutput from "../Interfaces/StoredProcedureOutput";

@JsonController("Login")
export default class SessionRoute {
    @Post()
    public Add(@Body({required: true}) _Session: ISession, @Res() response: any ){
        return SessionModel.Create(_Session).then((_Created) => {
            return response.status(200).send(_Created)
        }).catch((_Err: StoredProcedureOutput) => {
            return response.status(500).send(_Err)
        })
    }
}