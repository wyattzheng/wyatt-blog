import { v4 as getNewUUID } from "uuid"
import * as Sha1 from "crypto-js/sha1"
import * as Hex from "crypto-js/enc-hex"

export function HexSha1(str:string){
    return Hex.stringify(Sha1(str));
}

export function generateUuidToken(){
    return HexSha1(getNewUUID());
}

export function getPageCount(all_count:number,page_count:number){
    return all_count / page_count == 0 ? all_count / page_count : Math.floor(all_count / page_count) + 1;
}