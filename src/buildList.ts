import fs from "fs";
import path from "path";
import { TokenList } from "@uniswap/token-lists";
import { version as sinceredogeswapDefaultVersion } from "../lists/sinceredogeswap-default.json";
import { version as sinceredogeswapExtendedVersion } from "../lists/sinceredogeswap-extended.json";
import { version as sinceredogeswapTop15Version } from "../lists/sinceredogeswap-top-15.json";
import { version as sinceredogeswapTop100Version } from "../lists/sinceredogeswap-top-100.json";
import sinceredogeswapDefault from "./tokens/sinceredogeswap-default.json";
import sinceredogeswapExtended from "./tokens/sinceredogeswap-extended.json";
import sinceredogeswapTop100 from "./tokens/sinceredogeswap-top-100.json";
import sinceredogeswapTop15 from "./tokens/sinceredogeswap-top-15.json";

export enum VersionBump {
  "major" = "major",
  "minor" = "minor",
  "patch" = "patch",
}

type Version = {
  major: number;
  minor: number;
  patch: number;
};

const lists = {
  "sinceredogeswap-default": {
    list: sinceredogeswapDefault,
    name: "SincereDogeSwap Def",
    keywords: ["sinceredogeswap", "default"],
    logoURI: "https://sinceredogeswap.finance/logo.png",
    sort: false,
    currentVersion: sinceredogeswapDefaultVersion,
  },
  "sinceredogeswap-extended": {
    list: sinceredogeswapExtended,
    name: "SincereDogeSwap Ext",
    keywords: ["sinceredogeswap", "extended"],
    logoURI: "https://sinceredogeswap.finance/logo.png",
    sort: true,
    currentVersion: sinceredogeswapExtendedVersion,
  },
  "sinceredogeswap-top-100": {
    list: sinceredogeswapTop100,
    name: "SincereDogeSwap Top",
    keywords: ["sinceredogeswap", "top 100"],
    logoURI: "https://sinceredogeswap.finance/logo.png",
    sort: true,
    currentVersion: sinceredogeswapTop100Version,
  },
  "sinceredogeswap-top-15": {
    list: sinceredogeswapTop15,
    name: "SincereDogeSwap Top",
    keywords: ["sinceredogeswap", "top 15"],
    logoURI: "https://sinceredogeswap.finance/logo.png",
    sort: true,
    currentVersion: sinceredogeswapTop15Version,
  },
};

const getNextVersion = (currentVersion: Version, versionBump?: VersionBump) => {
  const { major, minor, patch } = currentVersion;
  switch (versionBump) {
    case VersionBump.major:
      return { major: major + 1, minor, patch };
    case VersionBump.minor:
      return { major, minor: minor + 1, patch };
    case VersionBump.patch:
    default:
      return { major, minor, patch: patch + 1 };
  }
};

export const buildList = (listName: string, versionBump?: VersionBump): TokenList => {
  const { list, name, keywords, logoURI, sort, currentVersion } = lists[listName];
  const version = getNextVersion(currentVersion, versionBump);
  return {
    name,
    timestamp: new Date().toISOString(),
    version,
    logoURI,
    keywords,
    // sort them by symbol for easy readability (not applied to default list)
    tokens: sort
      ? list.sort((t1, t2) => {
          if (t1.chainId === t2.chainId) {
            // CAKE first in extended list
            if ((t1.symbol === "CAKE") !== (t2.symbol === "CAKE")) {
              return t1.symbol === "CAKE" ? -1 : 1;
            }
            return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
          }
          return t1.chainId < t2.chainId ? -1 : 1;
        })
      : list,
  };
};

export const saveList = (tokenList: TokenList, listName: string): void => {
  const tokenListPath = `${path.resolve()}/lists/${listName}.json`;
  const stringifiedList = JSON.stringify(tokenList, null, 2);
  fs.writeFileSync(tokenListPath, stringifiedList);
  console.info("Token list saved to ", tokenListPath);
};
