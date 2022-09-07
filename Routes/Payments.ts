import { Body, Get, JsonController, Post, Put, QueryParams, Res } from "routing-controllers";
import PaymentModel from "../Models/PaymentModel";

@JsonController('Payments')
export default class PaymentRoute {
    @Get()
    public Search(@QueryParams({ required: false }) Payment: PaymentModel, @Res() response: any) {
        if (Payment.Prefix || Payment.Number !== -1 || Payment.Category !== -1 || Payment.Account !== -1) {
            return Payment.Search().then((_Banks) => {
                return response.status(200).send(_Banks)
            }).catch((_Err) => {
                return  response.status(500).send(_Err)
            })
        } else {
            return Payment.GetAll().then((_Banks) => {
                return response.status(200).send(_Banks)
            }).catch((_Err) => {
                return response.status(500).send(_Err)
            })
        }
    }

    @Post()
    public Add(@Body({ required: true }) NewPayment: PaymentModel, @Res() response: any) {
        return NewPayment.Create().then((_Created) => {
            if (_Created) {
                return response.status(200).send({ Message: "Payment Created" })
            } else {
                return response.status(400).send({ Message: "Payment can't be created" })
            }
        }).catch((_Err) => {
            return response.status(500).send(_Err)
        })
    }

    @Put()
    public Modify(@Body({ required: true }) Payment: PaymentModel,@Res() response: any) {
        return Payment.Update().then((_Updated) => {
            if (_Updated) {
                return response.status(200).send({ Message: "Payment updated" })
            } else {
                return response.status(400).send({ Message: "Payment can't be updated" })
            }
        }).catch((_Err) => {
            return response.status(500).send(_Err)
        })
    }
}