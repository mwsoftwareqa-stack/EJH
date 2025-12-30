export interface TestResult {
    name: string;
    status: string;
    statusDetails?: {
        message?: string;
    };
    parameters: Array<{value: string}>;
}
