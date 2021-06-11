/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { Contract } from 'ethers'
import { getDevContract, getDevTransferEvent } from '../../../src/contract'
import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

describe('getDevContract', () => {
	it('Get the Dev instance of the mock environment.', async () => {
		const wallets = await ethers.getSigners()
		const factory = await ethers.getContractFactory('Dev')
		const dev = await factory.connect(wallets[0]).deploy()
		await dev.deployTransaction.wait()

		const instance = await getDevContract(
			wallets[0].provider as any,
			dev.address
		)
		expect(instance.address).to.be.equal(dev.address)
	})
})

describe('getDevTransferEvent', () => {
	const init = async (): Promise<
		readonly [readonly SignerWithAddress[], Contract]
	> => {
		const wallets = await ethers.getSigners()
		const factory = await ethers.getContractFactory('Dev')
		const dev = await factory.connect(wallets[0]).deploy()
		await dev.deployTransaction.wait()
		await dev.transfer(wallets[1].address, 10000)
		await dev.transfer(wallets[2].address, 20000)
		await dev.transfer(wallets[3].address, 30000)
		const devWallet1 = dev.connect(wallets[1])
		await devWallet1.transfer(wallets[0].address, 5000)
		const devWallet2 = dev.connect(wallets[2])
		await devWallet2.transfer(wallets[0].address, 5000)
		return [wallets, dev as any]
	}

	it('Get the Transfer event of the address specified by the destination.', async () => {
		const [wallets, dev] = await init()
		const instance = await getDevContract(
			wallets[0].provider as any,
			dev.address
		)
		const blockNumber = await wallets[0].provider!.getBlockNumber()
		const address = wallets[0].address
		const events = await getDevTransferEvent(
			instance,
			null,
			address,
			blockNumber
		)
		events.map((event) => {
			expect(event.args!.to).to.be.equal(address)
			expect(event.blockNumber <= blockNumber).to.be.equal(true)
		})
		expect(events.length).to.be.equal(3)
	})
	it('Get the Transfer event of the address specified by the sender.', async () => {
		const [wallets, dev] = await init()
		const instance = await getDevContract(
			wallets[0].provider as any,
			dev.address
		)
		const blockNumber = await wallets[0].provider!.getBlockNumber()
		const address = wallets[0].address
		const events = await getDevTransferEvent(
			instance,
			address,
			null,
			blockNumber
		)
		events.map((event) => {
			expect(event.args!.from).to.be.equal(address)
			expect(event.blockNumber <= blockNumber).to.be.equal(true)
		})
		expect(events.length).to.be.equal(3)
	})
})
