import { IDevice } from "./IDevice";

/**
 * Interface that defines Battery device model on UI
 */
export interface IBatteryDevice extends IDevice {
    releaseDate?: number;
}