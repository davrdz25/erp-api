import { Body, Get, JsonController, Post, QueryParam, Res } from "routing-controllers";
import QRCodeModel from "../Models/QRCode";
import IQRCode from "../Interfaces/QRCode";

@JsonController("QRCode")
export default class QRGenerator {
    @Get()
    public Search(@Res() response: any){
        return QRCodeModel.Get(1).then((_QR) => {
            return response.status(200).send(_QR)
        }).catch((err) => {
            return response.status(500).send(err)
        })
    }

    @Post()
    public Add(@Body({required: true}) NewQRCode: IQRCode, @Res() response: any){
        console.log(NewQRCode);
        
        return QRCodeModel.Create(NewQRCode).then(() => {
            return response.status(500).send(NewQRCode)
        }).catch((err) => {
            return response.status(500).send(err)
        })
    }
}