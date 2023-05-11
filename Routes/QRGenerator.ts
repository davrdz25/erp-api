import { QRCode } from "qrcode";
import { Body, Get, JsonController, Post, Res } from "routing-controllers";
import QRCodeModel from "../Models/QRCode";
import IQRCode from "../Interfaces/QRCode";

@JsonController("QRCode")
export default class QRGenerator {

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