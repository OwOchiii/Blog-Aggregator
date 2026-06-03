import { readConfig } from "./config";
import {
    CommandsRegistry,
    handlerLogin,
    handlerRegister,
    registerCommand,
    handlerReset,
    runCommand,
    handlerGetAllUser,
    handlerAgg,
    handlerAddFeed,
    handlerFeeds,
    handlerFollow,
    handlerFollowing,
    middlewareLoggedIn, handlerUnfollow
} from "./CommandHandler";

async function main() {
    const CommandsRegistry: CommandsRegistry = {};
    registerCommand(CommandsRegistry, "login", handlerLogin);
    registerCommand(CommandsRegistry, "register", handlerRegister);
    registerCommand(CommandsRegistry, "reset", handlerReset);
    registerCommand(CommandsRegistry, "users", handlerGetAllUser);
    registerCommand(CommandsRegistry, "agg", handlerAgg);
    registerCommand(CommandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(CommandsRegistry, "feeds", handlerFeeds);
    registerCommand(CommandsRegistry, "follow", middlewareLoggedIn(handlerFollow));
    registerCommand(CommandsRegistry, "following", middlewareLoggedIn(handlerFollowing));
    registerCommand(CommandsRegistry,"unfollow",middlewareLoggedIn(handlerUnfollow));

    let args: string[] = process.argv;
    if (args.length < 3)
        throw new Error("not enough arguments");
    const cmdName = args[2];
    const cmdArgs = args.slice(3);

    await runCommand(CommandsRegistry, cmdName, ...cmdArgs);
    
    process.exit(0);
}

main();