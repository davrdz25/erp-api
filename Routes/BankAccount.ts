import { Body, Get, JsonController, Param, Post, Put, QueryParams, Res } from "routing-controllers";
import IBankAccount from "../Interfaces/BankAccount";
import BankAccountModel from "../Models/BankAccount";

@JsonController('BankAccounts')
export default class BankAccountRoute {
    @Get()
    public static Search(@QueryParams({ required: false }) BankAccount: IBankAccount, @Res() response: any) {
        if (BankAccount.Code || BankAccount.Name) {
            return BankAccountModel.Search(BankAccount).then((_Banks) => {
                return response.status(200).send(_Banks)
            }).catch((_Err: any) => {
                return  response.status(500).send(_Err)
            })
        } else {
            return BankAccountModel.GetAll().then((_Banks) => {
                return response.status(200).send(_Banks)
            }).catch((_Err) => {
                return response.status(500).send(_Err)
            })
        }
    }

    @Post()
    public static Add(@Body({ required: true }) _NewBank: IBankAccount, @Res() response: any) {
        return BankAccountModel.Create(_NewBank).then((_Created) => {
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
    public static Modify(@Body({ required: true }) _Bank: IBankAccount,@Res() response: any) {
        return BankAccountModel.Update(_Bank).then((_Updated) => {
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
