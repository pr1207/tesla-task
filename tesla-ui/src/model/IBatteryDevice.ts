import { IDevice } from "./IDevice";

/**
 * Interface that defines Battery device model on UI
 * Count represents total number of devices that user selected
 */
export interface IBatteryDevice extends IDevice {
    count: number;
    releaseDate?: number;
}