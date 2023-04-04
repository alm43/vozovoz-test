export interface Location {
    guid: string;
    name: string;
    type: string;
    coordinates: string;
    country: string;
    fias: string;
    region_str: string;
    default_terminal: DefaultTerminal;
}

interface DefaultTerminal {
    guid: string;
    location_guid: string;
    name: string;
    location_country: string;
    location_name: string;
}

export interface ResponseLocation {
    data: Location[]
}
