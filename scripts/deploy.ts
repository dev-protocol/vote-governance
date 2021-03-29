/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ethers } from 'ethers'
import * as VoteEmitter from '../build/VoteEmitter.json'
import * as Vote from '../build/Vote.json'
import { ethGasStationFetcher } from '@devprotocol/util-ts'
require('dotenv').config()

const deploy = async (): Promise<void> => {
	const { NETWORK, INFURA_ID, MNEMONIC, ETHGASSTATION_TOKEN, BLOCK } = process.env
	console.log(`network:${NETWORK}`)
	console.log(`infura id:${INFURA_ID}`)
	console.log(`mnemonic:${MNEMONIC}`)
	console.log(`ethgasstation token:${ETHGASSTATION_TOKEN}`)
	console.log(`block:${BLOCK}`)
	const provider = ethers.getDefaultProvider(NETWORK, {
		infura: INFURA_ID,
	})
	const wallet = ethers.Wallet.fromMnemonic(MNEMONIC!).connect(provider)

	const gasPrice = ethGasStationFetcher(ETHGASSTATION_TOKEN!)

	const voteEmitterFactory = new ethers.ContractFactory(
		VoteEmitter.abi,
		VoteEmitter.bytecode,
		wallet
	)

	const emitterContract = await voteEmitterFactory.deploy({
		gasLimit: 6721975,
		gasPrice: await gasPrice(),
	})

	await emitterContract.deployed()

	console.log('vote emitter address:' + emitterContract.address)

	const voteFactory = new ethers.ContractFactory(
		Vote.abi,
		Vote.bytecode,
		wallet,
	)
	const voteContract = await voteFactory.deploy(emitterContract.address, Number(BLOCK), {
		gasLimit: 6721975,
		gasPrice: await gasPrice(),
	})
	await voteContract.deployed()
	console.log('vote address:' + voteContract.address)
}

void deploy()
