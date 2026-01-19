export const numberFormatter = new Intl.NumberFormat('id-ID');

export function formatNumber(value) {
    return numberFormatter.format(value ?? 0);
}

export function formatIDR(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value ?? 0);
}

export function formatCurrencyNoIDR(value) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value ?? 0);
}