  "use client"
  import React, { useState, useEffect } from 'react';
  import { FaGamepad } from 'react-icons/fa';
  const contractAddress = "0x6ba93db9977dd6126b95db2f12e5ba5a079496e008ba3e22c5fa4927007e196"

  interface NFT {
    imageUrl: string;
    name: string;
    itemId: number;
    buyOffer: number[];
    sellOffer: number[];
  }

  const mockNfts: NFT[] = [
    {
      imageUrl: "https://cdn.bynogame.com/games/gta5-1662829149472.webp",
      name: "Grand theft auto 5",
      itemId: 1,
      buyOffer: [20,22,42,42],
      sellOffer: [10,20,30,50],
    },
    {
      imageUrl: "https://cdn.bynogame.com/games/gta5-1662829149472.webp",
      name: "Grand theft auto 5",
      itemId: 1,
      buyOffer: [20,22,42,42],
      sellOffer: [10,20,30,50],
    },
    {
      imageUrl: "https://cdn.bynogame.com/games/gta5-1662829149472.webp",
      name: "Grand theft auto 5",
      itemId: 1,
      buyOffer: [20,22,42,42],
      sellOffer: [10,20,30,50],
    },
    {
      imageUrl: "https://cdn.bynogame.com/games/gta5-1662829149472.webp",
      name: "Grand theft auto 5",
      itemId: 1,
      buyOffer: [20,22,42,42],
      sellOffer: [10,20,30,50],
    },
    {
      imageUrl: "https://cdn.bynogame.com/games/gta5-1662829149472.webp",
      name: "Grand theft auto 5",
      itemId: 1,
      buyOffer: [20,22,42,42],
      sellOffer: [10,20,30,50],
    },
    {
      imageUrl: "https://cdn.bynogame.com/games/gta5-1662829149472.webp",
      name: "Grand theft auto 5",
      itemId: 1,
      buyOffer: [20,22,42,42],
      sellOffer: [10,20,30,50],
    },

  ];
  interface NFTPageProps {
    nfts: NFT[];
  }

  const Items: React.FC<NFTPageProps> = ({ nfts }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const openModal = () => {
      setIsOpen(true);
    };

    const closeModal = () => {
      setIsOpen(false);
    };


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
                {mockNfts.map((nft) => (
                  <div className=' flex flex-col justify-center'>
                    <div className='group relative block overflow-hidden rounded-lg' onClick={openModal}>
                        <img
                            src={nft.imageUrl}
                            alt="Image"
                            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105  sm:h-72"
                        />

                        <div className="relative border border-[#EB5353] bg-white p-6">
                            <span
                            className=" whitespace-nowrap mx-auto bg-[#EB5353] text-white  text-main px-3 py-1.5  font-mono"
                            >
                            {nft.sellOffer[0]} USDT
                            </span>

                            <p className="mt-4 text-[#EB5353] text-lg font-medium ">{nft.name}</p>
                            <p className='text-[#EB5353]/50 text-end'>Click For Details...</p>

                        </div>
                    </div>
                        {isOpen && (
                          <div className="fixed inset-0 z-50 overflow-auto bg-black/25 backdrop-blur-sm flex justify-center items-center">
                            <div className="bg-white w-full rounded-3xl min-w-[60vw] max-w-[1460px] min-h-[80vh] border border-[#EB5353] mx-6 p-6 pb-8 text-center text-white ">
                              <div className="flex items-center justify-center flex-col mb-2 relative">
                                <span onClick={closeModal} className="absolute top-0 right-0 p-2 cursor-pointer
                                  rounded-full bg-[#EB5353] hover:bg-[#EB5353]/60"> 
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </span>
                              </div>
                              
                              <div className='flex flex-row gap-2'>
                                <div className=' w-[30%] flex flex-col h-full gap-2'>
                                  <img
                                      src={nft.imageUrl}
                                      alt="Image"
                                      className=" object-cover shadow-sm shadow-[#EB5353] transition duration-500 group-hover:scale-105 h-[25rem] rounded-lg "
                                    />
                                  <div className=' h-1/2 flex flex-row gap-2 text-black font-semibold'>
                                    <div className='border-red-500 rounded-lg bg-red-500/10  border-2 w-1/2 py-2 '>
                                        {nft.sellOffer.map((offer, index) => (
                                          <div key={index}>{offer} USDT</div>
                                        ))}
                                    </div>
                                    <div className='border-green-500 rounded-lg bg-green-500/10 border-2 w-1/2 py-2'>
                                        {nft.buyOffer.map((offer, index) => (
                                          <div key={index}>{offer} USDT</div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                                <div className='w-[70%]  h-full flex flex-col gap-2'>
                                  <div className='border-white border-2 h-1/2 py-28'>
                                    <input type="text" name="" id="" />
                                  </div>
                                  <div className=' flex border-white border-2 h-1/2 py-28 gap-5'>
                                    <div className='flex gap-5 mx-auto'>
                                      <input type="text" name="" id="" />
                                      <input type="text" name="" id="" />
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
