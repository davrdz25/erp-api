import { createCipheriv, randomBytes, scrypt, scryptSync } from "crypto";

export default class Encryption {
     
    public static EncryptString(_String: string){
        const iv = randomBytes(32);
        
        let cipher = createCipheriv("aes-256-gcm", scryptSync(_String , ( "<==>" + process.env.PasswordHash + "<==>"), 32), iv)
        let encrypted = cipher.update(_String);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString('hex') + ".:." + encrypted.toString('hex') 
    }

    public static DecryptString(_String: any){
        const data = _String.split(".:.")

        let iv = Buffer.from(data.shift(), 'hex');
        let encryptedText = Buffer.from(data.join('.:.'), 'hex');
        let decipher = createCipheriv("aes-256-gcm", scryptSync(_String , ( "<==>" + process.env.PasswordHash + "<==>"), 32), iv)
 
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
 
        return decrypted.toString();
    }
}