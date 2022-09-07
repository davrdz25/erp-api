import ExpressService from "./Services/Express";
import 'dotenv/config'

const Server = new ExpressService()

Server.startService(3001)