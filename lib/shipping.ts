// Mock shipping service

interface ShippingRate {
    carrier: string;
    service: string;
    price: number;
    currency: string;
    estimatedDays: number;
}

export const getShippingRates = async (address: any, items: any[]): Promise<ShippingRate[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const totalWeight = items.length * 0.5; // Mock weight: 0.5kg per item

    // Mock logic based on region or weight
    if (address.region === 'Kathmandu Valley') {
        return [
            { carrier: 'Local Courier', service: 'Standard Delivery', price: 100, currency: 'NPR', estimatedDays: 1 },
            { carrier: 'Pathao', service: 'Express', price: 150, currency: 'NPR', estimatedDays: 0 },
        ];
    } else {
        return [
            { carrier: 'Nepal Post', service: 'Standard', price: 150 + (totalWeight * 50), currency: 'NPR', estimatedDays: 3 },
            { carrier: 'Courier Service', service: 'Express', price: 250 + (totalWeight * 80), currency: 'NPR', estimatedDays: 2 },
        ];
    }
};

export const generateShippingLabel = async (order: any): Promise<{ trackingNumber: string; labelUrl: string; carrier: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const trackingNumber = `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    // In a real app, this would be a PDF URL from the carrier
    const labelUrl = `/api/shipping/label/download/${trackingNumber}`;

    return {
        trackingNumber,
        labelUrl,
        carrier: order.region === 'Kathmandu Valley' ? 'Local Courier' : 'Nepal Post'
    };
};
