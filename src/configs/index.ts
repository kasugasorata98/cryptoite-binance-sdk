import { ConfigEntity } from '../entities/config.entity'
import development from './development.config'
import production from './production.config'
import staging from './staging.config'

const Config = (): ConfigEntity => {
    switch (process.env.NODE_ENV) {
        case 'development':
            return development
        case 'staging':
            return staging
        case 'production':
            return production
        default:
            return development
    }
}

export default Config()
