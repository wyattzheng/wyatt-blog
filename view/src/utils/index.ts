import chalk from "chalk";

export const Chalk = new chalk.Instance({level:2});

export function wait(time:number){
    return new Promise((resolve)=>setTimeout(resolve,time));
}
export function parseHashCommand(raw_hash:string):string | undefined{
    if(raw_hash.substr(0,1) !== "#")
        return;
    
    const hash = raw_hash.substr(1,raw_hash.length-1);
    const items = hash.split("/");
    if(items.length < 4)
        return;
    if(items[0] !== "")
        return;
    if(items[1] !== "wyattos")
        return;
    if(items[2] !== "cli")
        return;
    return items.slice(3).join(" ").trim();
}

export function getWordWidth(char:string){
    if(char.charCodeAt(0)>127)
        return 2;
    return 1;
}

