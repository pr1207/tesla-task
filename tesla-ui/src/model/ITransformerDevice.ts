import { IDevice } from "./IDevice";

/**
 * Interface that defines Transformer model on UI
 * Count represents total number of devices that user selected
 */
export interface ITransformerDevice extends IDevice {
    count: number;
}