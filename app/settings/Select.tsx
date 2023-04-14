import CommonSelect, { SelectProps } from "@/components/common/Select";
import Title from "./Title";

interface SettingSelectProps extends SelectProps {
    title: string
}

export default function Select({ title, ...props }: SettingSelectProps) {
    return (
        <div>
            <Title>{title}</Title>
            <CommonSelect {...props} />
        </div>
    )
}