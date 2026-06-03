import {setUser, readConfig} from "./config";
import { createUser, getUserByName, resetUserTable, getAllUser} from "./lib/db/queries/users";
import { createFeed, getAllFeedsWithUsers } from "./lib/db/queries/feeds";
import { fetchFeed } from "./lib/rss";
import { printFeed } from "./utils";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length === 0)
        throw new Error("Username not provided");
    const name = args[0];
    const existingUser = await getUserByName(name);
    if (existingUser)
        throw new Error("User already exists");
    const user = await createUser(name);
    const cfg = readConfig();
    cfg.currentUserName = name;
    setUser(cfg);
    console.log(`User created: ${name}`);
    console.log(user);
}

export async function handlerLogin(cmdName: string, ...args: string[] ){
    if (args.length === 0)
        throw new Error("Username not provided");
    const user = await getUserByName(args[0]);
    if (!user)
        throw new Error("User not found");
    const cfg = readConfig();
    cfg.currentUserName = args[0];
    setUser(cfg);
}

export async function handlerReset(cmdName: string, ...args: string[]){
    await resetUserTable();
    console.log("User table reset successfully");
}

export async function handlerGetAllUser(cmdName: string, ...args: string[]){
    const allUser = await getAllUser();
    const cfg = readConfig();
    for (const user of allUser) {
        if (user.name === cfg.currentUserName) {
            console.log(`* ${user.name} (current)`);
        } else {
            console.log(`* ${user.name}`);
        }
    }
}

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(feed);
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error("addfeed requires two arguments: name and url");
    }
    const name = args[0];
    const url = args[1];
    
    const cfg = readConfig();
    if (!cfg.currentUserName) {
        throw new Error("No user is currently logged in");
    }
    
    const user = await getUserByName(cfg.currentUserName);
    if (!user) {
        throw new Error("Current user not found in database");
    }
    
    const feed = await createFeed(name, url, user.id);
    printFeed(feed, user);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    const feedsWithUsers = await getAllFeedsWithUsers();
    for (const { feed, user } of feedsWithUsers) {
        console.log(`* Feed: ${feed.name}`);
        console.log(`  URL: ${feed.url}`);
        console.log(`  User: ${user.name}`);
    }
}


export type CommandsRegistry = Record<string,CommandHandler>

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler;

}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (registry[cmdName] === undefined)
        throw new Error(`Unknown command: ${cmdName}`);
    await registry[cmdName](cmdName, ...args);
}
