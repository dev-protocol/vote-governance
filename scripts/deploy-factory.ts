/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/functional-parameters */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ethers } from 'ethers'
import * as VoteFactory from '../build/VoteFactory.json'
import { ethGasStationFetcher } from '@devprotocol/util-ts'
require('dotenv').config()

const deploy = async (): Promise<void> => {
	const {
		NETWORK,
		INFURA_ID,
		MNEMONIC,
		ETHGASSTATION_TOKEN,
		VOTE_EMITTER_ADDRESS,
	} = process.env
	console.log(`network:${NETWORK}`)
	console.log(`infura id:${INFURA_ID}`)
	console.log(`mnemonic:${MNEMONIC}`)
	console.log(`ethgasstation token:${ETHGASSTATION_TOKEN}`)
	console.log(`vote emitter address:${VOTE_EMITTER_ADDRESS}`)

	const provider = ethers.getDefaultProvider(NETWORK, {
		infura: INFURA_ID,
	})
	const wallet = ethers.Wallet.fromMnemonic(MNEMONIC!).connect(provider)

	const gasPrice = ethGasStationFetcher(ETHGASSTATION_TOKEN!)

	const voteFactoryFactory = new ethers.ContractFactory(
		VoteFactory.abi,
		VoteFactory.bytecode,
		wallet
	)

	const factroyContract = await voteFactoryFactory.deploy(
		VOTE_EMITTER_ADDRESS,
		{
			gasLimit: 200000,
			gasPrice: Number(await gasPrice()),
		}
	)

	await factroyContract.deployed()

	console.log('vote factory address:' + factroyContract.address)
}

void deploy()
