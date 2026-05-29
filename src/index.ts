import { readConfig } from "./config";

function main() {
    console.log("Hello, world!");
    
    const config = readConfig();
    console.log(config);
}

main();