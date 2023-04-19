import { useRootStore } from "@/context/root-context";
import { ChevronDown, ChevronFirst, ChevronLast, List } from "lucide-react";
import Button from "../common/Button";

export default function Control() {
    const { playerStore } = useRootStore();
    return (
        <div
            hidden={playerStore.mini}
            className="absolute bottom-0 left-0 right-0 bg-black h-16"
        >
            <div className="flex justify-between items-center m-2">
                <div>
                    <Button
                        className="mr-2"
                        onClick={() => {
                            playerStore.togglePrevPlay();
                        }}
                    >
                        <ChevronFirst />
                    </Button>
                    <Button
                        className="mr-2"
                        onClick={() => {
                            playerStore.toggleNextPlay();
                        }}
                    >
                        <ChevronLast />
                    </Button>
                </div>
                <div>
                    <Button
                        className="ml-2"
                        onClick={() => {
                            playerStore.toggleMini();
                        }}
                    >
                        <ChevronDown />
                    </Button>
                    <Button
                        className="ml-2"
                        onClick={() => {
                            playerStore.toggleShowPlayList();
                        }}
                    >
                        <List />
                    </Button>
                </div>
            </div>
        </div>
    );
}
