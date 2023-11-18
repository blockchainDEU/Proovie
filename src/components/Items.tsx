  "use client"
  import React, { useState, ChangeEvent, useEffect } from 'react';
  import Image from 'next/image';
  import { FaGamepad } from 'react-icons/fa';
  import axios from 'axios';
  import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
  const contractAddress = "0x6ba93db9977dd6126b95db2f12e5ba5a079496e008ba3e22c5fa4927007e196"
  import { OffchainAttest } from '@/backend/services/src/utils/types';
  import { getSchemaEncoder } from '@/helpers';
  import { PRIVATE_KEY, SCHEMA_UID } from '@/backend/services/src/constants';
  import { EAS,AttestationShareablePackageObject,
    SchemaRegistry,TypedDataSigner} from '@ethereum-attestation-service/eas-sdk';
  import dayjs from 'dayjs';
  import { StoreIPFSActionReturn,StoreAttestationRequest } from '@/backend/services/src/utils/types';
  import { useAccount} from 'wagmi';
import { SEPHOLIA_RPC_URL } from '@/backend/services/src/constants';
import { zeroAddress } from 'viem';
import { ethers } from 'ethers';
  interface NFT {
    itemImage: string;
    name: string;
    itemId: number;
    buyOffers: [];
    sellOffers: [];
  }

  interface NFTPageProps {
    nfts: NFT[];
  }
 

  const Items: React.FC<NFTPageProps> = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [buyOffer, setBuyOffer] = useState<number | undefined>();
    const [sellOffer, setSellOffer] = useState<number | undefined>();
    const [chain, setChain] = useState<string | undefined>();
    const [nftData, setNFTData] = useState<NFT[]>([]);
    const EASSCAN_URI = 'https://sepolia.easscan.org'
    const { address } = useAccount();
    const [signer,setSigner] = useState()
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    // const signer : any = useSigner();
    async function signOffchainAttestation(
      offchainData: OffchainAttest
    ) {
      try {
        const eas = new EAS(
          '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'
        );
        if(window.ethereum) {
          const provider: any = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send('eth_requestAccounts', []); // <- this promps user to connect metamask
    const signer = provider.getSigner();
    setSigner(signer)
        }

        const schemaEncoder = new SchemaEncoder('address userAddress,uint64 itemID,uint64 paymentChainID,uint64 itemChainID,uint64 offerType,uint256 offerPrice');
        const encoded = schemaEncoder.encodeData([
          {
            name: 'userAddress',
            type: 'address',
            value: offchainData.userAddress,
          },
          {
            name: 'itemID',
            type: 'uint64',
            value: offchainData.itemID,
          },
          {
            name: 'paymentChainID',
            type: 'uint64',
            value: offchainData.paymentChainID,
          },
          {
            name: 'itemChainID',
            type: 'uint64',
            value: offchainData.itemChainID,
          },
          {
            name: 'offerType',
            type: 'uint64',
            value: Number(1),
          },
          {
            name: 'offerPrice',
            type: 'uint256',
            value: offchainData.offerPrice,
          },
        ]);
        eas.connect(signer);
        const offChain = await eas.getOffchain();
        const signedOffchainAttestation = await offChain.signOffchainAttestation(
          {
            schema: SCHEMA_UID,
            recipient: zeroAddress,
            refUID: ethers.utils.hexZeroPad(zeroAddress,32), //ethers.zeroPadValue(ethers.ZeroAddress, 32),
            data: encoded,
            time: BigInt(dayjs().unix()),
            revocable: false,
            expirationTime: BigInt(0),
            version: 1,
            nonce: BigInt(0),
          },
          signer as unknown as TypedDataSigner  
        );
    
        const pkg: AttestationShareablePackageObject = {
          signer: signer.address,
          sig: signedOffchainAttestation,
        };
        return await submitSignedAttestation(pkg);
      } catch (error) {
        console.error('Error submitting signed attestation:', error);
        throw error;
      }
    }

    async function submitSignedAttestation(
      pkg: AttestationShareablePackageObject
    ): Promise<StoreIPFSActionReturn> {
      try {
        const data: StoreAttestationRequest = {
          filename: 'eas.txt',
          textJson: jsonStringifyWithBigInt(pkg),
        };
        const response = await axios.post<StoreIPFSActionReturn>(
          `http://167.71.41.1:3030/eas/submitEAS`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        return response.data;
      } catch (error) {
        console.error('Error submitting signed attestation:', error);
        throw error;
      }
    }

    function jsonStringifyWithBigInt(data: AttestationShareablePackageObject) {
      return JSON.stringify(data, (_, v) =>
        typeof v === 'bigint' ? v.toString() : v
      );
    }



    const handleBuyOfferChange = (e: ChangeEvent<HTMLInputElement>) => {
      setBuyOffer(Number(e.target.value));
    };
  const handleOfferClick = async() => {
      if(buyOffer && buyOffer > 0) {
  //       userAddress: string;
  // itemID: number;
  // paymentChainID: number;
  // itemChainID: number;
  // offerType: number;
  // offerPrice: number;
        const offchainData : OffchainAttest = {
            userAddress : address,
            itemID : 1,
            paymentChainID : Number(chain),
            itemChainID : Number(chain),
            offerType : 'BUY',
            offerPrice : buyOffer
        }
        const returnValue = await signOffchainAttestation(offchainData)
        // await signOffchainAttestation(
        console.log(returnValue)
        // )
      }else {
        alert("You can't pay 0")
      }
  }
    
    const handleSellOfferChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSellOffer(Number(e.target.value));
    };
    const handleChainChange = (e: ChangeEvent<{ value: string }>) => {
      setChain(e.target.value);
    };
  

    const openModal = (index: number) => {
      setIsOpen(true);
      setSelectedItemIndex(index);
    };

    const closeModal = () => {
      setIsOpen(false);
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            'http://167.71.41.1:3030/game/getAll'
          );
          const data = await response.json();          
          setNFTData(data);
        } catch (error) {
          console.error('Error fetching NFT data:', error);
        }
      };
  
      fetchData();
    }, []);
    console.log(nftData);
    
  
    
    return (
      <div>
        <div className=' pb-5'>

    <div className="hidden sm:block">
      <div className=" flex max-w-max rounded-lg mt-5 bg-[#EB5353]">
        <nav className=" flex text-xl items-center gap-4 text-white px-5 py-2 my-auto ">
          <FaGamepad className=""/>
          <nav>Games</nav>
        </nav>
      </div>
    </div>
  </div>
        <div className=' flex gap-6 '>
            <div className=' grid grid-cols-6 grid-rows-2 gap-5 cursor-pointer' >
                {nftData.map((nft, index) => (
                  <div className=' flex flex-col justify-center'>
                    <div className='group relative block overflow-hidden rounded-lg' onClick={() => openModal(index)}>
                        <img
                            src={nft.itemImage}
                            alt="Image"
                            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105  sm:h-72"
                        />

                        <div className="relative border border-[#EB5353] bg-white p-6">
                            <span
                            className=" whitespace-nowrap mx-auto bg-[#EB5353] text-white  text-main px-3 py-1.5  font-mono"
                            >
                            {nft.sellOffers[0].offerPrice || '0'} USDT
                            </span>

                            <p className="mt-4 text-[#EB5353] text-lg font-medium ">{nft.name}</p>
                            <p className='text-[#EB5353]/50 text-end'>Click For Details...</p>

                        </div>
                    </div>
                        {isOpen && (
                          <div className="fixed inset-0 z-50 overflow-auto bg-black/25 backdrop-blur-sm flex justify-center items-center">
                            <div className="bg-white w-full rounded-3xl min-w-[60vw] max-w-[1460px] min-h-[80vh] border border-[#EB5353] mx-6 p-6 pb-8 text-center text-white ">
                              <div className="flex items-center justify-center flex-col mb-2 relative">
                                <span  onClick={() => closeModal()} className="absolute top-0 right-0 p-2 cursor-pointer
                                  rounded-full bg-[#EB5353] hover:bg-[#EB5353]/60"> 
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </span>
                              </div>
                              
                              <div className='flex flex-row gap-2'>
                                <div className=' w-[30%] flex flex-col h-full gap-2'>
                                  <img
                                      src={nftData[selectedItemIndex]?.itemImage}
                                      alt="Image"
                                      className=" object-cover shadow-sm shadow-[#EB5353] transition duration-500 group-hover:scale-105 h-[25rem] rounded-lg "
                                    />
                                  <div className=' h-1/2 flex flex-row gap-2 text-black font-semibold'>
                                    <div className='border-red-500 rounded-lg bg-red-500/10  border-2 w-1/2 py-2 '>
                                        {/* {nft.map( index) => (
                                          <div key={index}>{nft.sellOffers.offerPrice || ''} USDT</div>
                                        ))} */}
                                    </div>
                                    <div className='border-green-500 rounded-lg bg-green-500/10 border-2 w-1/2 py-2'>
                                        {/* {nft.map( index) => (
                                          <div key={index}>{nft.sellOffers.offerPrice || ''} USDT</div>
                                        ))} */}
                                    </div>
                                  </div>
                                </div>
                                <div className='w-[70%]  h-full flex flex-col gap-2'>
                                  <div className='border-white border-2 h-1/2 py-6'>
                                    
                                    <button  className="block mx-auto bg-[#EB5353] font-bold hover:shadow-md hover:shadow-[#EB5353] duration-200  backdrop-blur-[8px] text-white  px-3 py-2 max-md:scale-95 text-md min-w-[180px] rounded-[10px]">
                                      {/* {isLoading && 'Approving...'}
                                      {!isLoading && isSuccess && 'Approved'}
                                      {!isLoading && !isSuccess && 'Approve'} */}
                                      Approve For Offers
                                    </button> 
                                    <div className=' mx-12 pt-2'>
                                      <label htmlFor="loanAmount" className="block text-xl py-2 text-start font-medium text-[#EB5353]">
                                          Create a Buy Offer
                                      </label>
                                      <div className=' grid grid-cols-2 grid-rows-1 w-full border-b-4 border-[#EB5353] h-[8rem]'>
                                      <div className=' flex flex-row gap-5 my-auto '>
                                      <div className=' items-center my-auto'>
                                          <select
                                            name="Payment Tokent"
                                            id="Payment Token"
                                            value={chain || ''}
                                            onChange={handleChainChange}
                                            className=" rounded-md border-2 border-[#EB5353]/30 focus:outline-[#EB5353] shadow-sm py-1.5  text-gray-700 sm:text-sm"
                                          >
                                            <option value="">Select a Chain</option>
                                            <option value="11155111">
                                              <span><Image src='/ethlogo.svg' width={16} height={16} alt='logo'/></span>Ethereum</option>
                                            <option value="10200"><span><Image src='/gnologo.svg' width={16} height={16} alt='logo'/></span>Gnosis</option>
                                            <option value="421613"><span><Image src='/arblogo.svg' width={16} height={16} alt='logo'/></span>Arbitrum</option>
                                            <option value="420"><span><Image src='/oplogo.svg' width={16} height={16} alt='logo'/></span>Optimism</option>
                                          </select>
                                        </div>
                                        <input
                                          type="number"
                                          id="loanAmount"
                                          value={buyOffer}
                                          onChange={handleBuyOfferChange}
                                          placeholder="Amount"
                                          className="mt-1 w-full min-w-[5rem] rounded-md p-1 border-2 border-[#EB5353]/30 focus:outline-[#EB5353] shadow-sm text-black sm:text-sm"
                                        />
                                        <button  className="block ml-auto bg-[#EB5353] font-bold hover:shadow-md hover:shadow-[#EB5353] duration-200  backdrop-blur-[8px] text-white  px-3 py-2 max-md:scale-95 text-md min-w-[180px] rounded-[10px]"
                                        onClick={handleOfferClick}
                                        >
                                        {
                                        
                                        /* {isLoading && 'Approving...'}
                                        {!isLoading && isSuccess && 'Approved'}
                                        {!isLoading && !isSuccess && 'Approve'} */}
                                        Make an Offer
                                      </button> 
                                      </div>
                                      <button  className="block mx-auto my-auto  bg-[#EB5353] font-bold hover:shadow-md hover:shadow-[#EB5353] duration-200  backdrop-blur-[8px] text-white  px-3 py-2 max-md:scale-95 text-md min-w-[180px] rounded-[10px]">
                                        {/* {isLoading && 'Approving...'}
                                        {!isLoading && isSuccess && 'Approved'}
                                        {!isLoading && !isSuccess && 'Approve'} */}
                                        Instant Buy
                                      </button> 
                                    </div>

                                    </div>
                                    
                         
                                  </div>
                                  <div className=' mx-12 pt-2'>
                                      <label htmlFor="loanAmount" className="block text-xl py-2 text-start font-medium text-[#EB5353]">
                                          Create a Sell Offer
                                      </label>
                                      <div className=' grid grid-cols-2 grid-rows-1 w-full border-b-4 border-[#EB5353] h-[8rem]'>
                                      <div className=' flex flex-row gap-5 my-auto '>
                                        <input
                                          type="number"
                                          id="loanAmount"
                                          value={buyOffer}
                                          onChange={handleBuyOfferChange}
                                          placeholder="Amount"
                                          className="mt-1 w-full min-w-[5rem] rounded-md p-1 border-2 border-[#EB5353]/30 focus:outline-[#EB5353] shadow-sm text-black sm:text-sm"
                                        />
                                        <button  className="block ml-auto bg-[#EB5353] font-bold hover:shadow-md hover:shadow-[#EB5353] duration-200  backdrop-blur-[8px] text-white  px-3 py-2 max-md:scale-95 text-md min-w-[180px] rounded-[10px]">
                                        {/* {isLoading && 'Approving...'}
                                        {!isLoading && isSuccess && 'Approved'}
                                        {!isLoading && !isSuccess && 'Approve'} */}
                                        Make an Offer
                                      </button> 
                                      </div>
                                      <button  className="block mx-auto my-auto  bg-[#EB5353] font-bold hover:shadow-md hover:shadow-[#EB5353] duration-200  backdrop-blur-[8px] text-white  px-3 py-2 max-md:scale-95 text-md min-w-[180px] rounded-[10px]">
                                        {/* {isLoading && 'Approving...'}
                                        {!isLoading && isSuccess && 'Approved'}
                                        {!isLoading && !isSuccess && 'Approve'} */}
                                        Instant Sell
                                      </button> 
                                    </div>

                                    </div>
                                </div>
                              </div>

                              
                              </div>

                          </div>
                        )}
                  </div>
              ))}
            </div>
          
        </div>
      </div>
    );
  };

  export async function getServerSideProps() {
    try {
      const apiUrl = process.env.API_URL;
      const response = await fetch(apiUrl as string);
      const data = await response.json();

      return {
        props: {
          nfts: data,
        },
      };
    } catch (error) {
      console.error('Error fetching NFT data:', error);
      return {
        props: {
          nfts: [],
        },
      };
    }
  }

  export default Items;
