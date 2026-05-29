import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName?: string;
};

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  const data = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  fs.writeFileSync(getConfigFilePath(), JSON.stringify(data, null, 2));
}

function validateConfig(rawConfig: any): Config {
  if (typeof rawConfig.db_url !== "string") {
    throw new Error("Invalid config: db_url must be a string");
  }
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
}

export function setUser(cfg: Config): void {
  writeConfig(cfg);
}

export function readConfig(): Config {
  const configPath = getConfigFilePath();
  const data = fs.readFileSync(configPath, "utf-8");
  const rawConfig = JSON.parse(data);
  return validateConfig(rawConfig);
}
