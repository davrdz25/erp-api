import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParams, Res } from "routing-controllers";
import BankModel from "../Models/Bank";

@JsonController('Banks')
export default class BankRoute {
    @Get()
    public Search(@QueryParams({ required: false }) Bank: BankModel, @Res() response: any) {
        if (Bank.Code || Bank.Name) {
            return Bank.Search().then((_Banks) => {
                return response.status(200).send(_Banks)
            }).catch((_Err) => {
                return  response.status(500).send(_Err)
            })
        } else {
            return Bank.GetAll().then((_Banks) => {
                return response.status(200).send(_Banks)
            }).catch((_Err) => {
                return response.status(500).send(_Err)
            })
        }
    }

    @Post()
    public Add(@Body({ required: true }) NewBank: BankModel, @Res() response: any) {
        return NewBank.Create().then((_Created) => {
            if (_Created) {
                return response.status(200).send({ Message: "Bank Created" })
            } else {
                return response.status(400).send({ Message: "Bank can't be created" })
            }
        }).catch((_Err) => {
            return response.status(500).send(_Err)
        })
    }

    @Put()
    public Modify(@Body({ required: true }) Bank: BankModel,@Res() response: any) {
        return Bank.Update().then((_Updated) => {
            if (_Updated) {
                return response.status(200).send({ Message: "Bank updated" })
            } else {
                return response.status(400).send({ Message: "Bank can't be updated" })
            }
        }).catch((_Err) => {
            return response.status(500).send(_Err)
        })
    }
}