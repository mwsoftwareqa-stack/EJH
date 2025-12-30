// Example: -$29.29
export function toCurrencyNumber(value: string): number {
    if (!value) {
        throw new Error('Value is null or empty and cannot be converted to currency number.');
    }

    let core = value.replace(/,/g, '').replace(/[^0-9.-]/g, '');

    if (/-$/.test(core) && !/^-/.test(core)) core = '-' + core.slice(0, -1);

    return parseFloat(core);
}
