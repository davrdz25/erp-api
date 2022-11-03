import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParams, Res } from "routing-controllers";
import BankAccountModel from "../Models/BankAccount";

@JsonController('BankAccounts')
export default class BankAccountRoute {
    @Get()
    public Search(@QueryParams({ required: false }) BankAccount: BankAccountModel, @Res() response: any) {
        if (BankAccount.Code || BankAccount.Name) {
            return BankAccount.Search().then((_Banks) => {
                return response.status(200).send(_Banks)
            }).catch((_Err) => {
                return  response.status(500).send(_Err)
            })
        } else {
            return BankAccount.GetAll().then((_Banks) => {
                return response.status(200).send(_Banks)
            }).catch((_Err) => {
                return response.status(500).send(_Err)
            })
        }
    }

    @Post()
    public Add(@Body({ required: true }) NewBank: BankAccountModel, @Res() response: any) {
        return NewBank.Create().then((_Created) => {
            if (_Created) {
                return response.status(200).send({ Message: "Bank Account Created" })
            } else {
                return response.status(400).send({ Message: "Bank account can't be created" })
            }
        }).catch((_Err) => {
            return response.status(500).send(_Err)
        })
    }

    @Put()
    public Modify(@Body({ required: true }) Bank: BankAccountModel,@Res() response: any) {
        return Bank.Update().then((_Updated) => {
            if (_Updated) {
                return response.status(200).send({ Message: "Bank account updated" })
            } else {
                return response.status(400).send({ Message: "Bank account can't be updated" })
            }
        }).catch((_Err) => {
            return response.status(500).send(_Err)
        })
    }
}
