import { createCipheriv, randomBytes } from "crypto";

export default class Encryption {
    private static key = randomBytes(32);
    private static iv = randomBytes(16);
     
    public static EncryptString(_String: string){
        let cipher = createCipheriv("aes-256-cbc", Buffer.from(this.key), this.iv);
        let encrypted = cipher.update(_String);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return { iv: this.iv.toString('hex'),
        encryptedData: encrypted.toString('hex') };
    }

    public static DecryptString(_String: any){
        let iv = Buffer.from(_String.iv, 'hex');
        let encryptedText = Buffer.from(_String.encryptedData, 'hex');
        let decipher = createCipheriv("aes-256-cbc", Buffer.from(this.key), iv);
 
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
 
        return decrypted.toString();
    }
}