import { DeviceTypeEnum } from "./DeviceTypeEnum";

/**
 * Main interface that defines devices data model 
 * for both batteries and transformers
 * 
 * This interface is in extended for each of the device types 
 * and that was done in case there will be more differences between them in the future
 */
export interface IDevice {
    id: number;
    type: DeviceTypeEnum;
    image: {
        thumb: string;
        preview: string;
    };

    name: string;
    dimensions: {
        l: number;
        w: number;
    }
    energy: number;
    cost: number;
}