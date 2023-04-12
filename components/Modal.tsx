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
            <div className="fixed left-0 right-0 top-0 bottom-0 bg-black opacity-75 z-50" onClick={props.onClose}></div>
            <div className="max-h-screen overflow-auto fixed top-1/2 left-0 right-0 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 z-50">
                {/* 标题 和 关闭按钮*/}
                <div className="bg-white dark:bg-black p-4 rounded-t-lg dark:border-white border-b flex justify-between items-center">
                    <div className="text-lg font-bold">{props.title}</div>
                    <div className="text-gray-400 hover:text-gray-500 cursor-pointer" onClick={props.onClose}>
                        <X></X>
                    </div>
                </div>
                {/* 内容 */}
                <div className="bg-white p-4 rounded-b-lg dark:bg-black">
                    {props.children}
                </div>
            </div>
        </div>
    )
}
