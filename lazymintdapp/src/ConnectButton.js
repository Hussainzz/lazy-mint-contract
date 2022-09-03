import React from 'react'
import {
    useAccount,
    useConnect,
    useDisconnect,
    useNetwork,
    useSwitchNetwork
  } from 'wagmi'

const SUPPORTED_CHAIN =  Number(process.env.REACT_APP_CHAIN_ID);
const ConnectButton = () => {
    const { address, isConnected } = useAccount()
    const { connect, connectors, error, isLoading, pendingConnector } =
      useConnect()
    const { disconnect } = useDisconnect()
    const { chain } = useNetwork()
    const { switchNetwork } = useSwitchNetwork({
      onError(error) {
        console.log('Error', error)
      }
    })
  
    if (isConnected) {
      if(chain.id === SUPPORTED_CHAIN){
        return (
          <div>
            <button className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded" onClick={disconnect}>
            {`${address.slice(0, 4)}...${address.slice(38)}`}
            </button>
          </div>
        )
      }else{
        return (
          <div>
            <button className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded" onClick={() => {switchNetwork(SUPPORTED_CHAIN)}}>
                Switch to polygon mumbai
            </button>
          </div>
        )
      }
      
    }
  
    return (
      <div>
        {connectors.map((connector) => (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded"
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            Connect Metamask Wallet
            {!connector.ready && ' (Install Metamask)'}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'}
          </button>
        ))}
  
        {error && <div>{error.message}</div>}
      </div>
    )
}

export default ConnectButton