import { Body, Get, JsonController, Post, Put, QueryParams,Res } from "routing-controllers";
import PaymentCategoryModel from "../Models/PaymentCategoryModel";

@JsonController('PaymentCategories')
export default class PaymentCategoriesRoute {
    @Get()
    public Search(@QueryParams({ required: false }) PaymentCategory: PaymentCategoryModel, @Res() response: any){

        if (PaymentCategory.Code || PaymentCategory.Name) {
            return PaymentCategory.Search().then((_PaymentCategory) => {
                return response.status(200).send(_PaymentCategory)
            }).catch((_Err) => {
                return  response.status(500).send(_Err)
            })
        } else {
            return PaymentCategory.GetAll().then((_PaymentCategory) => {
                return response.status(200).send(_PaymentCategory)
            }).catch((_Err) => {
                return response.status(500).send(_Err)
            })
        }
    }

    @Post()
    public Add(@Body({ required: true }) NewPaymentCategory: PaymentCategoryModel, @Res() response: any){
        return NewPaymentCategory.Create().then((_Created) => {
            if (_Created) {
                return response.status(200).send({ Message: "Payment category Created" })
            } else {
                return response.status(400).send({ Message: "Payment category can't be created" })
            }
        }).catch((_Err) => {
            return response.status(500).send(_Err)
        })
    }

    @Put()
    public Mofify(@Body({ required: true }) PaymentCategory: PaymentCategoryModel, @Res() response: any){
        return PaymentCategory.Update().then((_Updated) => {
            if (_Updated) {
                return response.status(200).send({ Message: "Payment category updated" })
            } else {
                return response.status(400).send({ Message: "Payment category can't be updated" })
            }
        }).catch((_Err) => {
            return response.status(500).send(_Err)
        })
    }
}