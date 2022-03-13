import { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

function App() {
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      let tempProvider = await detectEthereumProvider();

      if (tempProvider) {
        setWeb3(new Web3(tempProvider));
        setProvider(tempProvider);
      } else {
        console.error("Please, install Metamask.");
      }
    };

    loadProvider();
  }, [provider]);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    web3 && getAccounts();
  }, [web3]);

  const handleConnect = () => {
    provider.request({ method: "eth_requestAccounts" });
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
            Current Balance: <strong>10</strong> ETH
          </div>

          <button className="button is-primary mr-2">Donate</button>
          <button className="button is-link">Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
