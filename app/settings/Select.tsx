import { ChangeEventHandler } from "react"
import Title from "./Title"

export default function Select(
    {
        title,
        options,
        selected,
        onChange
    }: {
        title: string
        options: Array<{ value: string, label: string }>
        selected: string,
        onChange?: ChangeEventHandler<HTMLSelectElement>
    }
) {
    return (
        <div>
            <Title>{title}</Title>
            <select onChange={onChange} defaultValue={selected} className="text-sm w-full md:w-96 pl-3 pt-2 pb-2 pr-3 mr-3  border rounded-3xl mb-3 dark:bg-black">
                {
                    options.map((option, index) => {
                        return (
                            <option key={index} value={option.value} >{option.label}</option>
                        )
                    })
                }
            </select>
        </div>
    )
}
