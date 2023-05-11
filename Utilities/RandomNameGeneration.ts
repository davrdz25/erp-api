export default class RandomNameGeneration {
    public static generateRandomString(length: number) {
        const chars =
          "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
        const randomArray: any = Array.from(
          { length: length },
          (v, k) => chars[Math.floor(Math.random() * chars.length)]
        );
      
        const randomString = randomArray.join("");
        return randomString;
      };
}