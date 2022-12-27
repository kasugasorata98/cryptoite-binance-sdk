import { ConfigEntity } from "../entities/config.entity";
import development from "./development.config";
import production from "./production.config";
import staging from "./staging.config";

const Config = (NODE_ENV: 'production' | 'staging' | 'development'): ConfigEntity => {
    switch (NODE_ENV) {
        case 'development':
            return development;
        case 'staging':
            return staging
        case 'production':
            return production
    }
}

export default Config;