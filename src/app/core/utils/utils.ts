export const getPriceColor = (price: number): 'success' | 'warning' | 'danger' => {
    if (price > 0.6) {
        return 'danger';
    } else if (price <= 0.6 && price > 0.4) {
        return 'warning';
    }
    return 'success';
};
