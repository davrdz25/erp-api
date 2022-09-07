import { Body, Get, JsonController, Param, Post, Put, QueryParams, Res } from "routing-controllers";
import CardModel from "../Models/Card";

@JsonController('Cards')
export default class CardRoute{
    @Get()
    public GetAll(@QueryParams() Card: CardModel, @Res() response: any){
        if(Card.Code || Card.Name || Card.Number || Card.Bank !== undefined){
            return Card.Search().then((_Cards) => {
                return response.status(200).send(_Cards)
            }).catch((_Err) => {
                return response.status(500).send(_Err)
            })
        } else {
            return Card.GetAll().then((_Cards) => {
                return response.status(200).send(_Cards)
            }).catch((_Err) => {
                return response.status(500).send(_Err)
            })
        }
    }

    @Post()
    public Add(@Body({required: true}) NewCard: CardModel, @Res() response: any){
        return NewCard.Create().then((_Created) => {
            if(_Created){
                return response.status(200).send({Message: "Card created"})
            }  else {
                return response.status(400).send({Message: "Unknown err"})
            }
        }).catch((_Err) => {
            return response.status(500).send(_Err)
        })
    }

    @Put()
    public Modify(@Body({required: true}) Card: CardModel, @Res() response: any){
        return Card.Update().then((_Update) => {
            if(_Update){
                return response.status(200).send({Message: "Card updated"})
            }  else {
                return response.status(400).send({Message: "Unknown err"})
            }
        }).catch((_Err) => {
            return response.status(500).send(_Err)
        })
    }
}