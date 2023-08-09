import { useEffect, useState,useCallback} from "react";
import { ethers } from "ethers";


// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";

// ABIs
import Dappazon from "./abis/Dappazon.json";

// Config
import config from "./config.json";
// const ethers = require("ethers")

function App() {
  const [account,setAccount] = useState(null);
  let signer=null;
  let provider;
  const url = "http://localhost:8545";
  const handleAccountsChanged = (accounts) =>{
    setAccount(accounts[0]);
  }
  const metamask_connect =async()=>{
    if(window.ethereum==null){
      console.log("metamask is not installed please install metamask");
    }else{
      provider = new ethers.JsonRpcProvider()

      signer = await provider.getSigner();
      console.log("Provider -", provider);
      console.log("Signer -", signer);
    }
  }

  // function connect() {
  //   window.ethereum
  //     .request({ method: 'eth_requestAccounts' })
  //     .then(handleAccountsChanged)
  //     .catch((error) => {
  //       if (error.code === 4001) {
  //         // EIP-1193 userRejectedRequest error
  //         console.log('Please connect to MetaMask.');
  //       } else {
  //         console.error(error);
  //       }
  //     });
  // }
  useEffect(() => {
    metamask_connect();
  }, []);
  return (
    <div>
      <h2>Welcome to Dappazon{account}</h2>
    </div>
  );
}

export default App;
