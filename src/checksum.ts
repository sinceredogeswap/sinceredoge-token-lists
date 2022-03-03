import fs from "fs";
import path from "path";
import { getAddress } from "@ethersproject/address";
import sinceredogeswapDefault from "./tokens/sinceredogeswap-default.json";
import sinceredogeswapExtended from "./tokens/sinceredogeswap-extended.json";
import sinceredogeswapTop100 from "./tokens/sinceredogeswap-top-100.json";
import sinceredogeswapTop15 from "./tokens/sinceredogeswap-top-15.json";

const lists = {
  "sinceredogeswap-default": sinceredogeswapDefault,
  "sinceredogeswap-extended": sinceredogeswapExtended,
  "sinceredogeswap-top-100": sinceredogeswapTop100,
  "sinceredogeswap-top-15": sinceredogeswapTop15
};

const checksumAddresses = (listName: string): void => {
  let badChecksumCount = 0;
  const listToChecksum = lists[listName];
  const updatedList = listToChecksum.reduce((tokenList, token) => {
    const checksummedAddress = getAddress(token.address);
    if (checksummedAddress !== token.address) {
      badChecksumCount += 1;
      const updatedToken = { ...token, address: checksummedAddress };
      return [...tokenList, updatedToken];
    }
    return [...tokenList, token];
  }, []);

  if (badChecksumCount > 0) {
    console.info(`Found and fixed ${badChecksumCount} non-checksummed addreses`);
    const tokenListPath = `${path.resolve()}/src/tokens/${listName}.json`;
    console.info("Saving updated list to ", tokenListPath);
    const stringifiedList = JSON.stringify(updatedList, null, 2);
    fs.writeFileSync(tokenListPath, stringifiedList);
    console.info("Checksumming done!");
  } else {
    console.info("All addresses are already checksummed");
  }
};

export default checksumAddresses;
