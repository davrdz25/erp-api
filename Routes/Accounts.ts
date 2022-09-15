import { Body, Get, JsonController, Post, Put, QueryParams,Res } from "routing-controllers";
import IAccount from "../Interfaces/Account";
import AccountModel from "../Models/Account";

interface StoredProcedureOutput {
    ErrNumber: number,
    ProcName: string,
    State: string,
    Message: string; 
}

@JsonController('Accounts')
export default class AccountRoute {

    @Get()
    public Search(@QueryParams({ required: false }) Account: IAccount, @Res() response: any){
        if ((Account.Entry !== 0 && Account.Entry >= 1 ) || Account.Code || Account.Name || Account.Level > 0) {
            return AccountModel.Search(Account).then((_Account) => {
                return response.status(200).send(_Account)
            }).catch((_Err) => {
                return  response.status(500).send(_Err)
            })
        } else {
            return AccountModel.GetAll().then((_Accounts) => {
                return response.status(200).send(_Accounts)
            }).catch((_Err) => {
                return response.status(500).send(_Err)
            })
        }
    }

    @Post()
    public Add(@Body({ required: true }) NewAccount: IAccount, @Res() response: any){
        return AccountModel.Create(NewAccount).then((_Created: any) => {
                return response.status(200).send(_Created)
        }).catch((_Err: StoredProcedureOutput) => {
            return response.status(500).send(_Err)
        })
    }

    @Put()
    public Mofify(@Body({ required: true }) Account: IAccount, @Res() response: any){
        return AccountModel.Update(Account).then((_Updated) => {
            if (_Updated) {
                return response.status(200).send({ Message: "Account updated" })
            } else {
                return response.status(400).send({ Message: "Account can't be updated" })
            }
        }).catch((_Err) => {
            return response.status(500).send(_Err)
        })
    }
}