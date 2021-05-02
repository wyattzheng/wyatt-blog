import { IFileSystem } from "../system";

export class MockFileSystem implements IFileSystem{
    async list(path: string): Promise<string[]> {
        return [];
    }
    async read(path: string): Promise<Uint8Array> {
        return new Uint8Array();
    }
    async write(path: string, data: Uint8Array): Promise<void> {
        
    }
    
}