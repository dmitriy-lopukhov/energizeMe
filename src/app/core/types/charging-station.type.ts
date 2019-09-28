export interface IChagingStation {
    AddressInfo: IAddressInfo;
    UsageCost: string;
    ID: number;
}

interface IAddressInfo {
    Title: string;
    Town: string;
    Postcode: string;
    Latitude: number;
    Longitude: number;
    ID: number;
    AccessComments: string;
    AddressLine1: string;
}
