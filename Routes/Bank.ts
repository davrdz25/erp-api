import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParams, Res } from "routing-controllers";
import BankModel from "../Models/Bank";
import IBank from "../Interfaces/Bank";

@JsonController('Banks')
export default class BankRoute {
    @Get()
    public Search(@QueryParams({ required: false }) _Bank: IBank, @Res() response: any) {
        if (_Bank.Code || _Bank.Name) {
            return BankModel.Search(_Bank).then((_Banks) => {
                return response.status(200).send(_Banks)
            }).catch((_Err) => {
                return  response.status(500).send(_Err)
            })
        } else {
            return BankModel.GetAll().then((_Banks) => {
                return response.status(200).send(_Banks)
            }).catch((_Err) => {
                return response.status(500).send(_Err)
            })
        }
    }

    @Post()
    public Add(@Body({ required: true }) _Bank: IBank, @Res() response: any) {
        return BankModel.Create(_Bank).then((_Created) => {
            if (_Created) {
                return response.status(200).send({ Message: "Bank Created" })
            } else {
                return response.status(400).send({ Message: "Bank can't be created" })
            }
        }).catch((_Err) => {
            return response.status(500).send(_Err)
        })
    }

    // @Put()
    // public Modify(@Body({ required: true }) Bank: BankModel,@Res() response: any) {
    //     return Bank.Update().then((_Updated) => {
    //         if (_Updated) {
    //             return response.status(200).send({ Message: "Bank updated" })
    //         } else {
    //             return response.status(400).send({ Message: "Bank can't be updated" })
    //         }
    //     }).catch((_Err) => {
    //         return response.status(500).send(_Err)
    //     })
    // }
}