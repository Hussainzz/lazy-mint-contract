import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  useWaitForTransaction
} from "wagmi";
import LazyContractInterface from "./contracts/LazyMint.json";
import { toast } from "react-toastify";

const SUPPORTED_CHAIN = Number(process.env.REACT_APP_CHAIN_ID);
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

export default function NFT({ nft }) {
  const [toAddr, setToAddr] = useState("");
  const { isConnected } = useAccount();
  const { chain } = useNetwork();


  const voucher = [nft.tokenID, nft.price, nft.uri, nft.signedVoucher];
  const { data, write, isError, error } = useContractWrite({
    mode:"recklesslyUnprepared",
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: LazyContractInterface.abi,
    functionName: "mintNFT"
  });

  useEffect(() => {
    if(isError){
      toast.error(error.reason);
    }
  },[isError])

  const {isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: d => {
      console.log(d);
      toast("Successfully minted your NFT!");
    },
    onError: e => {
      console.log(e);
      toast.error("Something went wrong");
    }
  });

  const mintHandler = async () => {
    if (!isConnected && toAddr === "") return;
    if(!ethers.utils.isAddress(toAddr)){
      toast.error("invalid address");
      return;
    }
    write({
      recklesslySetUnpreparedArgs: [toAddr, voucher],
      recklesslySetUnpreparedOverrides:{
        value: nft.price
      }
    });
  };

  return (
    <>
      <div className="p-5 rounded-3xl shadow-md bg-white">
        <article key={nft.tokenID} className="rounded-3xl">
          <img
            src={nft.meta.image}
            alt={"Ghost IMG"}
            className="h-52 object-fit object-cover w-full lg:h-80 rounded-3xl"
          />

          <div className="p-5 pb-0 flex flex-col md:flex-row items-start md:items-center justify-between">
            <article className="flex items-center justify-start">
              <ul>
                <li className="text-slate-800 font-bold">
                  Token ID: #{nft.tokenID}
                </li>
                <li className="text-slate-800 font-bold">{nft.meta.name}</li>
                <li className="text-sm text-slate-800 opacity-75 font-bold">
                  Price: {ethers.utils.formatEther(nft.price)}
                </li>
              </ul>
            </article>

            {isConnected && chain.id === SUPPORTED_CHAIN && (
              <>
                <article className="mt-5 md:mt-0">
                  {(nft.owner !== null)?
                      <h6 className="text-slate-800 font-bold">
                       Owned By: {`${nft.owner.slice(0, 4)}...${nft.owner.slice(38)}`}
                      </h6>
                    :
                    <>
                       <div className="mb-3 pt-0">
                          <input
                            type="text"
                            placeholder="Paste To Address Here"
                            className="px-3 py-3 placeholder-slate-400 text-slate-900 relative bg-grey bg-grey rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                            onChange={(e) => {
                                setToAddr(e.target.value)
                            }}
                            value={toAddr}
                          />
                        </div>
                      
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded"
                          onClick={mintHandler}
                          disabled={isLoading}
                        >
                          {(isLoading)?'Minting...':'Mint Now'}
                        </button>
                    </>
                  }
                </article>
              </>
            )}
          </div>
        </article>
      </div>
    </>
  );
}
