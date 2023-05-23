import { Body, Get, Header, JsonController, Param, Post, QueryParam, Res } from "routing-controllers";
import IUser from "../Interfaces/User";
import UserModel from "../Models/User.Model";
import SessionModel from "../Models/Session.Model";
import ISession from "../Interfaces/Session";

@JsonController("Users")
export default class UserRoute {
    @Get("/:Entry")
    public Search(@Res() response: any, @Param("Entry") _Entry: number ){
        return UserModel.Search(_Entry).then((_User) => {
            return response.status(200).send(_User)
        }).catch((_Err) => {
            return response.status(500).send(_Err)
        })
    }

    @Post()
    public Add(@Body({required: true}) NewUser: IUser, @Res() response: any){
        return UserModel.CreateUser(NewUser).then((_User: any) => {
            return response.status(200).send(NewUser)
        }).catch((_Err: any) => {
            return response.status(500).send(_Err)
        })
    }
}