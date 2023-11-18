"use client"

import React from 'react';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig } from 'wagmi';
import { arbitrum, mainnet } from 'viem/chains';

// 1. Get projectId
const projectId = 'b88aca1ec36164be80539e3221e02bbc';

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [mainnet, arbitrum];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

interface Web3ModalProps {
  children: React.ReactNode;
}

export function Web3Modal({ children }: Web3ModalProps): JSX.Element {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
