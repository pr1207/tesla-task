import { memo } from "react";
import { IBatteryDevice } from "../model/IBatteryDevice";
import { getUrl, locale } from "../shared/Util";
import NumberInput from "./NumberInput";

/**
 * Props interface of DevicePicker component
 * 
 * Accepts device @IBatteryDevice  and callback for onChange event (when device count changes)
 */
interface IProps {
    device: IBatteryDevice;
    onChange(device: IBatteryDevice) : void;
}

/**
 * Component that renders device metadata, preview image and count input.
 * @param IProps
 */
function DevicePicker({device, onChange}: IProps) {

    const handleCountChange = (count: number) => {
        onChange({
            ...device,
            count
        })
    }

    return (
        <div className="device-picker">
            <details>
                <summary>{device.name}</summary>
                <div className="device-info">
                    <div className="device-image">
                        <img src={getUrl(device.image.thumb)} alt={`${device.name} preview`} />
                    </div>
                    <div className="device-details">
                        <p>Capacity: {device.energy} MWh</p>
                        <p>Cost: ${device.cost.toLocaleString(locale)}</p>
                        <p>Dimensions: {device.dimensions.l} x {device.dimensions.w} ft</p>
                    </div>
                </div>
              
            </details>
            <NumberInput onChange={handleCountChange} value={device.count} />
        </div>
    )
}

export default memo(DevicePicker);