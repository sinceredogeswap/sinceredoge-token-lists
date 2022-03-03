import srcDefault from "./tokens/sinceredogeswap-default.json";
import srcExtended from "./tokens/sinceredogeswap-extended.json";
import srcTop100 from "./tokens/sinceredogeswap-top-100.json";
import srcTop15 from "./tokens/sinceredogeswap-top-15.json";
import defaultList from "../lists/sinceredogeswap-default.json";
import extendedtList from "../lists/sinceredogeswap-extended.json";
import top15List from "../lists/sinceredogeswap-top-15.json";
import top100tList from "../lists/sinceredogeswap-top-100.json";

const lists = [
  {
    name: "sinceredogeswap-default",
    src: srcDefault,
    actual: defaultList,
  },
  {
    name: "sinceredogeswap-extended",
    src: srcExtended,
    actual: extendedtList,
  },
  {
    name: "sinceredogeswap-top-15",
    src: srcTop15,
    actual: top15List,
  },
  {
    name: "sinceredogeswap-top-100",
    src: srcTop100,
    actual: top100tList,
  },
];

const compareLists = (listPair) => {
  const { name, src, actual } = listPair;
  if (src.length !== actual.tokens.length) {
    throw Error(
      `List ${name} seems to be not properly regenerated. Soure file has ${src.length} tokens but actual list has ${actual.tokens.length}. Did you forget to run yarn makelist?`
    );
  }
  src.sort((t1, t2) => (t1.address < t2.address ? -1 : 1));
  actual.tokens.sort((t1, t2) => (t1.address < t2.address ? -1 : 1));
  src.forEach((srcToken, index) => {
    if (JSON.stringify(srcToken) !== JSON.stringify(actual.tokens[index])) {
      throw Error(
        `List ${name} seems to be not properly regenerated. Tokens from src/tokens directory don't match up with the final list. Did you forget to run yarn makelist?`
      );
    }
  });
};

/**
 * Check in CI that author properly updated token list
 * i.e. not just changed token list in src/tokens but also regenerated lists with yarn makelist command.
 * Github Action runs only on change in src/tokens directory.
 */
const ciCheck = (): void => {
  lists.forEach((listPair) => {
    compareLists(listPair);
  });
};

export default ciCheck;
