import 'reflect-metadata'
import morgan from 'morgan'

import { Session, createExpressServer } from 'routing-controllers'

import BankRoute from '../Routes/Bank'
import AccountRoute from '../Routes/Accounts'
import BankAccountRoute from '../Routes/BankAccount'
import PaymentCategoriesRoute from '../Routes/PaymentCategories'
import PaymentRoute from '../Routes/Payments'
import UserRoute from '../Routes/User.Route'
import SessionRoute from '../Routes/Session.Route'

export default class ExpressService {
    public static startService(Port: Number) {
        const server = createExpressServer({
            cors: {
                exposedHeaders: ["auth-token"]
            },              
            classTransformer: true,
            validation: false,
            middlewares: [morgan(":method :url :status :res[content-length] - :response-time ms") as any],
            routePrefix: '/api/v1/',
            controllers: [BankRoute, AccountRoute, BankAccountRoute, PaymentCategoriesRoute, PaymentRoute, UserRoute, SessionRoute ] as any,
        })

        server.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
        server.disable('x-powered-by')
        server.listen(Port, () => {
            console.log(`Express start at port ${Port}`)
        })
    }
}