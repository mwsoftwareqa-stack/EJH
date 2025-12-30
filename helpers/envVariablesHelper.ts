export function getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

/**
 * Gets an environment variable with a default value if not set.
 * Useful for optional configuration that has sensible defaults.
 * 
 * @param name - The environment variable name
 * @param defaultValue - The default value to use if the env var is not set
 * @returns The environment variable value or the default value
 */
export function getEnvVarOrDefault(name: string, defaultValue: string): string {
    return process.env[name] || defaultValue;
}
