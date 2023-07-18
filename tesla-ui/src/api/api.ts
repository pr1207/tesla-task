import { IDevice } from "../model/IDevice";
import { getUrl } from "../shared/Util";

export const api = {
    batteries: {
        getAll: async (): Promise<IDevice[]> => {
            return await (await fetch(getUrl('/batteries'))).json();
        }
    },
    transformers: {
        getAll: async (): Promise<IDevice[]> => {
            return await (await fetch(getUrl('/transformers'))).json();
        }
    }
}