import { providers } from "ethers";
import { ENSRegistry__factory } from "./ENSRegistry__factory";
import { PublicResolver__factory } from "./PublicResolver__factory";

export const getProvider = () => {
  return new providers.Web3Provider(window.ethereum);
};

export function getENSRegistry(provider) {
  return ENSRegistry__factory.connect(
    "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    provider
  );
}

export function getResolver(address, provider) {
  return PublicResolver__factory.connect(address, provider);
}
