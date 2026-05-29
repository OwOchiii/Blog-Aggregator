import { readConfig, setUser } from "./config";

function main() {
    console.log("Hello, world!");
    
    const config = readConfig();
    config.currentUserName = "Lane";
    setUser(config);
    
    const updatedConfig = readConfig();
    console.log(updatedConfig);
}

main();