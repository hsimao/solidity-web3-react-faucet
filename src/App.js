import { useEffect, useState, useCallback } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null
  });
  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState(null);
  const [shouldReload, reload] = useState(null);

  const canConnectToContract = account && web3Api.contract;
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", () => window.location.reload());
    provider.on("chainChanged", () => window.location.reload());
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const contract = await loadContract("Faucet", provider);

        setAccountListener(provider);
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true
        });
      } else {
        setWeb3Api((api) => ({ ...api, isProviderLoaded: true }));
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
  }, [web3Api, shouldReload]);

  const handleConnect = () => {
    web3Api.provider.request({ method: "eth_requestAccounts" });
  };

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")
    });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  const withdraw = useCallback(async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei("0.1", "ether");
    await contract.withdraw(withdrawAmount, {
      from: account
    });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  const renderInstallMetamask = () => {
    return (
      <div className="notification is-warning is-size-6 is-rounded">
        <span>Wallet is not detected! </span>
        <a target="_blank" rel="noreferrer" href="https://docs.metamask.io">
          Install Metamask
        </a>
      </div>
    );
  };

  const renderConnectWallet = () => {
    return (
      <button className="button is-small" onClick={handleConnect}>
        Connect Wallet
      </button>
    );
  };

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          {web3Api.isProviderLoaded ? (
            <>
              <div className="is-flex is-align-items-center">
                <span className="mr-2">
                  <strong>Account: </strong>
                </span>

                {account
                  ? account
                  : !web3Api.provider
                  ? renderInstallMetamask()
                  : renderConnectWallet()}
              </div>
            </>
          ) : (
            <span>Looking for Web3...</span>
          )}

          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>

          {!canConnectToContract && (
            <i className="is-block">Connect to Ganache</i>
          )}

          <button
            disabled={!canConnectToContract}
            onClick={addFunds}
            className="button is-primary mr-2"
          >
            Donate
          </button>
          <button
            disabled={!canConnectToContract}
            onClick={withdraw}
            className="button is-link"
          >
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
