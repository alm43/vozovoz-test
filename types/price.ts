import {Location} from '~/types/location';

export interface Price {
    basePrice: number;
    price: number;
    service: IService[],
    deliveryTime: DeliveryTime;
}

interface IService {
    basePrice: number;
    name: string;
    price: number;
}

interface DeliveryTime {
    from: number;
    to: number;
}

export interface ResponsePriceError {
    code: string;
    description: string;
    id: number;
    message: string;
}

export interface RequestParamsPrice {
    from: {
        location: Location,
        type: string;
    },
    to: {
        location: Location,
        type: string;
    },
    weight: number;
    volume: number;
}
