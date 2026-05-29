import {setUser, readConfig} from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[] ){
    if (args.length === 0)
        throw new Error("Username not provided");
    const cfg = readConfig();
    cfg.currentUserName = args[0];
    setUser(cfg);
    
}

export type