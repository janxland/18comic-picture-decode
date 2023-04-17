import { useRootStore } from "@/context/root-context";
import { observer } from "mobx-react-lite";
import IconLogo from "./icons/IconLogo";

const Logo = observer(() => {
    const { settingsStore } = useRootStore();
    return (
        <IconLogo
            width={80}
            color={
                settingsStore.getSetting("theme") === "dark" ? "#fff" : "#333"
            }
        ></IconLogo>
    );
});

export default Logo;
