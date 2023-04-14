import clsx from "clsx"
import { ChangeEventHandler } from "react"

export interface SelectProps {
    options: Array<{ value: string, label: string }>
    selected: string,
    onChange?: ChangeEventHandler<HTMLSelectElement>
    className?: string
}

export default function Select(
    {
        options,
        selected,
        onChange,
        className
    }: SelectProps
) {
    return (
        <select onChange={onChange} defaultValue={selected} className={
            clsx("text-sm w-full md:w-96 pl-3 pt-2 pb-2 pr-3 mr-3  border rounded-3xl mb-3 dark:bg-black", className)
        }>
            {
                options.map((option, index) => {
                    return (
                        <option key={index} value={option.value} >{option.label}</option>
                    )
                })
            }
        </select>
    )
}
