import {setUser, readConfig} from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[] ){
    if (args.length === 0)
        throw new Error("Username not provided");
    const cfg = readConfig();
    cfg.currentUserName = args[0];
    setUser(cfg);
    
}

export type CommandsRegistry = Record<string,CommandHandler>

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler;

}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (registry[cmdName] === undefined)
        throw new Error(`Unknown command: ${cmdName}`);
    registry[cmdName](cmdName, ...args);
}
