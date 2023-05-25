import { createCipheriv, randomBytes } from "crypto";

export default class Encryption {
     
    public static EncryptString(_String: string){
        const iv = randomBytes(16);

        let cipher = createCipheriv("aes-256-cbc", ( "<==>" + process.env.PasswordHash + "<==>"), iv);
        let encrypted = cipher.update(_String);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted.toString('hex') 
        };
    }

    public static DecryptString(_String: any){
        let iv = Buffer.from(_String.iv, 'hex');
        let encryptedText = Buffer.from(_String.encryptedData, 'hex');
        let decipher = createCipheriv("aes-256-cbc", ( "<==>" + process.env.PasswordHash + "<==>"), iv);
 
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
 
        return decrypted.toString();
    }
}