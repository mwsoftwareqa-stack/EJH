import {EnvironmentName} from '../types/environmentName';
import {ENV_CONFIG} from './environments';

export function getEnvConfig() {
    const env = process.env.ENV_NAME as EnvironmentName;

    if (!env || !ENV_CONFIG[env]) {
        throw new Error(`Invalid ENV_NAME "${env}". Allowed: ${Object.keys(ENV_CONFIG).join(', ')}`);
    }

    return ENV_CONFIG[env];
}
