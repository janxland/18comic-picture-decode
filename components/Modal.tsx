import { DefaultTFuncReturn } from "i18next";
import { X } from "lucide-react";

interface ModalProps {
    show: boolean;
    title?: string | DefaultTFuncReturn;
    children: React.ReactNode;
    onClose?: () => void;
}

export default function Modal(props: ModalProps) {
    if (!props.show) {
        return null;
    }
    return (
        <div>
            <div
                className="fixed left-0 right-0 top-0 bottom-0 z-50 bg-black opacity-75"
                onClick={props.onClose}
            ></div>
            <div className="fixed top-1/2 left-0 right-0 z-50 max-h-screen -translate-y-1/2 transform overflow-auto md:left-1/2 md:-translate-x-1/2">
                {/* 标题 和 关闭按钮*/}
                <div className="flex items-center justify-between rounded-t-lg border-b bg-white p-4 dark:border-white dark:bg-zinc-700">
                    <div className="text-lg font-bold">{props.title}</div>
                    <div
                        className="cursor-pointer text-gray-400 hover:text-gray-500"
                        onClick={props.onClose}
                    >
                        <X></X>
                    </div>
                </div>
                {/* 内容 */}
                <div className="rounded-b-lg bg-white p-4 dark:bg-zinc-800">
                    {props.children}
                </div>
            </div>
        </div>
    );
}
