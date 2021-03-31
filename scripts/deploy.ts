/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/functional-parameters */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ethers } from 'ethers'
import * as VoteEmitter from '../build/VoteEmitter.json'
import * as Vote from '../build/Vote.json'
import { ethGasStationFetcher } from '@devprotocol/util-ts'
require('dotenv').config()

const deploy = async (): Promise<void> => {
	const {
		NETWORK,
		INFURA_ID,
		MNEMONIC,
		ETHGASSTATION_TOKEN,
		BLOCK,
		SUBJECT,
		BODY,
		OPTIONS,
		BODY_MIME_TYPE,
		OPTION_MIME_TYPE,
	} = process.env
	console.log(`network:${NETWORK}`)
	console.log(`infura id:${INFURA_ID}`)
	console.log(`mnemonic:${MNEMONIC}`)
	console.log(`ethgasstation token:${ETHGASSTATION_TOKEN}`)
	console.log(`block:${BLOCK}`)
	console.log(`subject:${SUBJECT}`)
	console.log(`subject:${BODY}`)
	console.log(`options:${OPTIONS}`)
	console.log(`body mime type:${BODY_MIME_TYPE}`)
	console.log(`option mime type:${OPTION_MIME_TYPE}`)
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
		gasLimit: 200000,
		gasPrice: Number(await gasPrice()),
	})

	await emitterContract.deployed()

	console.log('vote emitter address:' + emitterContract.address)

	const voteFactory = new ethers.ContractFactory(
		Vote.abi,
		Vote.evm.bytecode,
		wallet
	)
	const voteContract = await voteFactory.deploy(
		SUBJECT,
		BODY,
		JSON.parse(OPTIONS!),
		BODY_MIME_TYPE,
		OPTION_MIME_TYPE,
		emitterContract.address,
		Number(BLOCK),
		{
			gasLimit: 1500000,
			gasPrice: Number(await gasPrice()),
		}
	)
	await voteContract.deployed()
	console.log('vote address:' + voteContract.address)
}

void deploy()
