import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const CONFIG_DIR = join(homedir(), ".shipwell");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

interface ShipwellConfig {
  user?: {
    name: string;
    email: string;
    uid: string;
    photo?: string;
  };
  apiKey?: string;
  model?: string;
}

function ensureDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function loadConfig(): ShipwellConfig {
  try {
    ensureDir();
    if (existsSync(CONFIG_FILE)) {
      return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
    }
  } catch {}
  return {};
}

export function saveConfig(config: ShipwellConfig) {
  ensureDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n", { mode: 0o600 });
}

export function getUser() {
  return loadConfig().user;
}

export function setUser(user: ShipwellConfig["user"]) {
  const config = loadConfig();
  config.user = user;
  saveConfig(config);
}

export function clearUser() {
  const config = loadConfig();
  delete config.user;
  saveConfig(config);
}

export function getApiKey() {
  return loadConfig().apiKey;
}

export function setApiKey(key: string) {
  const config = loadConfig();
  config.apiKey = key;
  saveConfig(config);
}

export function clearApiKey() {
  const config = loadConfig();
  delete config.apiKey;
  saveConfig(config);
}

export function getModel() {
  return loadConfig().model;
}

export function setModel(model: string) {
  const config = loadConfig();
  config.model = model;
  saveConfig(config);
}

export { CONFIG_DIR, CONFIG_FILE };
export type { ShipwellConfig };
