import { readConfig } from "./config";
import {CommandsRegistry, handlerLogin, registerCommand, runCommand} from "./CommandHandler";

function main() {
    console.log("Hello, world!");
    const CommandsRegistry: CommandsRegistry = {};
    registerCommand(CommandsRegistry, "login", handlerLogin);

    let args: string[] = process.argv;
    if (args.length < 3)
        throw new Error("not enough arguments");
    const cmdName = args[2];
    const cmdArgs = args.slice(3);

    runCommand(CommandsRegistry, cmdName, ...cmdArgs);
    
    const config = readConfig();
    console.log(config);
}

main();