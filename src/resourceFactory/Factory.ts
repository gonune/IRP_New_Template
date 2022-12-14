import { AzureResource } from "./resourceClasses";


export class AzureResourceFactory {
    create<T extends AzureResource>(type: { new(...args: any): T; }, ...args: any): T {
        return new type(...args);
    }
}
