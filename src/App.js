import { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({});
  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);

      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        });
      } else {
        console.error("Please, install Metamask.");
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    web3Api.web3 && getAccounts();
  }, [web3Api.web3]);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };

    web3Api.contract && loadBalance();
  }, [web3Api]);

  const handleConnect = () => {
    web3Api.provider.request({ method: "eth_requestAccounts" });
  };

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-align-items-center">
            <span className="mr-2">
              <strong>Account: </strong>
            </span>

            {account ? (
              account
            ) : (
              <button className="button is-small" onClick={handleConnect}>
                Connect Wallet
              </button>
            )}
          </div>

          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>

          <button className="button is-primary mr-2">Donate</button>
          <button className="button is-link">Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
