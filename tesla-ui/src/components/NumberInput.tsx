import { memo } from "react";

/**
 * Props interface of NumberInput component
 * 
 * Accepts value (integer) and callback for onChange event
 */
interface NumberInputProps {
    value: number;
    onChange(val?: number): void;
}

/**
 * Simple component that displays number input.
 * @param NumberInputProps
 */
function NumberInput({value, onChange}: NumberInputProps) {

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        //Cast string to number and set to >= 0 && <= 100
        const value = +(e.target.value || 0);
        onChange(Math.min(Math.max(0, value), 100));
    }

    return (
        <div className="number-input">
            <input data-testid={'number-input'} type="number" value={`${value}`} onChange={handleChange} min="0" max="1000" />
        </div>
    )
}

export default memo(NumberInput);