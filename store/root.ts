import { nextTick } from "process";
import ExtensionStore from "./extension";
import HistoryStore from "./history";
import SettingsStore from "./settings";
import { TMDBStore } from "./tmdb";
import PlayerStore from "./player";

export interface RootStore {
    settingsStore: SettingsStore;
    tmdbStore: TMDBStore;
    extensionStore: ExtensionStore;
    historyStore: HistoryStore;
    playerStore: PlayerStore;
}

export class RootStore {
    constructor() {
        this.settingsStore = new SettingsStore();
        this.tmdbStore = new TMDBStore(this.settingsStore);
        this.extensionStore = new ExtensionStore(this.settingsStore);
        this.historyStore = new HistoryStore();
        this.playerStore = new PlayerStore();
    }
}
