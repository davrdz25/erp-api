import { QRCode } from "qrcode";
import { Body, Get, JsonController, Post, Res } from "routing-controllers";
import QRCodeModel from "../Models/QRCode";

@JsonController("QRCodes")
export default class QRGenerator {
    @Post()
    public Add(@Body({required: true}) NewQRCode: QRCodeModel, @Res() response: any){
    }
}