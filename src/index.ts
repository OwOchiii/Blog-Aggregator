import { readConfig } from "./config";
import {
    CommandsRegistry,
    handlerLogin,
    handlerRegister,
    registerCommand,
    handlerReset,
    runCommand,
    handlerGetAllUser
} from "./CommandHandler";

async function main() {
    console.log("Hello, world!");
    const CommandsRegistry: CommandsRegistry = {};
    registerCommand(CommandsRegistry, "login", handlerLogin);
    registerCommand(CommandsRegistry, "register", handlerRegister);
    registerCommand(CommandsRegistry,"reset",handlerReset);
    registerCommand(CommandsRegistry,"user",handlerGetAllUser)

    let args: string[] = process.argv;
    if (args.length < 3)
        throw new Error("not enough arguments");
    const cmdName = args[2];
    const cmdArgs = args.slice(3);

    await runCommand(CommandsRegistry, cmdName, ...cmdArgs);
    
    const config = readConfig();
    console.log(config);
    process.exit(0);
}

main();