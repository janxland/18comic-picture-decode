export function getModel(model: any) {
    switch (Number(model)) {
        case 0:
            return "bangumi";
        case 1:
            return "manga";
        case 2:
            return "novel";
        default:
            return "bangumi";
    }
}