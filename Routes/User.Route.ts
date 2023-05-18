import { Body, JsonController, Post, Res } from "routing-controllers";
import IUser from "../Interfaces/User";
import UserModel from "../Models/User.Model";
import StoredProcedureOutput from "../Interfaces/StoredProcedureOutput";

@JsonController('Users')
export default class UserRoute {
    @Post()
    public Add(@Body({required: true}) NewUser: IUser, @Res() response: any){
        return UserModel.CreateUser(NewUser).then((_User: any) => {
            return response.status(200).send(NewUser)
        }).catch((_Err: any) => {
            return response.status(500).send(_Err)
        })
    }
}