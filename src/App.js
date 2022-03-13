import { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";

function App() {
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      let tempProvider = null;

      if (window.ethereum) {
        tempProvider = window.ethereum;

        try {
          await tempProvider.request({ method: "eth_requestAccounts" });
        } catch {
          console.log("User denied accounts access!");
        }
      } else if (window.web3) {
        tempProvider = window.web3.currentProvider;
      } else if (!process.env.production) {
        tempProvider = new Web3.providers.HttpProvider("http://localhots:7545");
      }

      setWeb3(new Web3(tempProvider));
      setProvider(tempProvider);
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

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <span>
            <strong>Account: </strong>
          </span>
          <h1> {account ? account : "not connected"}</h1>

          <div className="balance-view is-size-2">
            Current Balance: <strong>10</strong> ETH
          </div>

          <button className="btn mr-2">Donate</button>
          <button className="btn">Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
