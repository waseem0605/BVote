import React,{useState , useEffect} from 'react'
import profile from './pro.png';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';

const Profile = ({name,votes,vote}) => {
    return (
        <div className='profile'>
            <img src={profile} height={"100"} width={"100"} className='image' alt="" />
            <div className='para'>Name of candidate : {name}</div>
            <div className='para'>No of Votes : {votes}</div>
            <div className='btn' onClick={vote}>Vote</div>
        </div>
    )
}


const Home = () => {
    const [isConnected, setIsConnected] = useState(false);
  const [ethBalance, setEthBalance] = useState("");
  const [ethAddress,setEthAddress] = useState("");
  const [ethName,setEthName] = useState("");
  const [ethSymbol,setEthSymbol] = useState("");
  const [name1,setName1] = useState("");
  const [name2,setName2] = useState("");
  const [vote1cnt,setVote1cnt] = useState();
  const [vote2cnt,setVote2cnt] = useState();

  const notifySuccess = () => toast.success(' Wallet connected');
  const notifyWarn = () => toast.error(' Wallet connected');

  const abi=[
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_CandidateOne",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_CandidateTwo",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "VoteCandidateOne",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "VoteCandidateTwo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "CandidateOne",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "CandidateOneCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "CandidateTwo",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "CandidateTwoCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
    ];
    const address="0x4c95383e41417803FA1a8E884cCA7EC488EF74b7";

  useEffect(()=>{
    var interval;
    var provider = new ethers.providers.Web3Provider(window.ethereum);

    var contract = new ethers.Contract(address,abi,provider);
    contract.CandidateOne().then(result => setName1(result));
    contract.CandidateTwo().then(result => setName2(result));

    interval = setInterval(() => {
        contract.CandidateOneCount().then(result => setVote1cnt(parseInt(result)));
        contract.CandidateTwoCount().then(result => setVote2cnt(parseInt(result)));
    },10 * 1000);

    return () => {
        clearInterval(interval);
    }

  },[]);

  const vote1 = () => {
    var provider = new ethers.providers.Web3Provider(window.ethereum);
    var signer = provider.getSigner();
    var contract = new ethers.Contract(address,abi,signer);
    contract.VoteCandidateOne().then((result) => toast.success("Voted successfully"))
    .catch(err => toast.error("You are already Voted"));
  }

  const vote2 = () => {
    var provider = new ethers.providers.Web3Provider(window.ethereum);
    var signer = provider.getSigner();
    var contract = new ethers.Contract(address,abi,signer);
    contract.VoteCandidateTwo().then((result) => toast.success("Voted successfully"))
    .catch(err => toast.error("You are already Voted"));
  }


  const getbalance = (address) => {
    window.ethereum
      .request({ 
        method: "eth_getBalance", 
        params: [address, "latest"] 
      })
      .then((balance) => {
        setEthBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(4));
        notifySuccess();
      });
  };
  
  const accountChangeHandler = async(account) => {
    setEthAddress(account.substring(0,6)+"..."+account.substring(36));
    getbalance(account);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const network = await provider.getNetwork();
    setEthName(network.name);
    setEthSymbol(network.symbol);
    
  };
  
  const connectWallet = async() => {
    try {
      const {ethereum} = window;
      if(ethereum) {
        window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => accountChangeHandler(res[0]));
        setIsConnected(true);
      }
      else{
        toast.error("Please install the metamask!");
      }
    } catch(err) {
        toast.error("Please install the metamask!");
    }
  }
  return (
    <div className='home'>
        <Toaster />
      <div className='heading'>
            E-Voting App
      </div>
      <div className='flex-row'>
      <div className='wallet' onClick={connectWallet}>Connect Wallet</div>
      <div className='wallet-add'>
      <div>Address : {ethAddress}</div>
      <div>Balance : {ethBalance}</div>
      </div>
      
      </div>
      
      <div className='election'>
            <Profile key={1} name={name1} votes={vote1cnt} vote={vote1} />
            <Profile key={2} name={name2} votes={vote2cnt} vote={vote2} />
      </div>
    </div>
  )
}

export default Home
