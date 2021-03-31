/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { describe } from 'mocha'
import { Contract } from 'ethers'
import { getDevContract, getDevTransferEvent } from '../../../src/contract'
import { deployContract, MockProvider } from 'ethereum-waffle'
import Dev from '../../../build/Dev.json'

describe('getDevContract', () => {
	it('Get the Dev instance of the mock environment.', async () => {
		const provider = new MockProvider()
		const wallets = provider.getWallets()
		const dev = await deployContract(wallets[0], Dev)
		const instance = await getDevContract(provider, dev.address)
		expect(instance.address).to.be.equal(dev.address)
	})
})

describe('getDevTransferEvent', () => {
	const init = async (): Promise<readonly [MockProvider, Contract]> => {
		const provider = new MockProvider()
		const wallets = provider.getWallets()
		const dev = await deployContract(wallets[0], Dev)
		await dev.transfer(wallets[1].address, 10000)
		await dev.transfer(wallets[2].address, 20000)
		await dev.transfer(wallets[3].address, 30000)
		const devWallet1 = dev.connect(wallets[1])
		await devWallet1.transfer(wallets[0].address, 5000)
		const devWallet2 = dev.connect(wallets[2])
		await devWallet2.transfer(wallets[0].address, 5000)
		return [provider, dev]
	}

	it('Get the Transfer event of the address specified by the destination.', async () => {
		const [provider, dev] = await init()
		const instance = await getDevContract(provider, dev.address)
		const blockNumber = await provider.getBlockNumber()
		const address = provider.getWallets()[0].address
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
		const [provider, dev] = await init()
		const instance = await getDevContract(provider, dev.address)
		const blockNumber = await provider.getBlockNumber()
		const address = provider.getWallets()[0].address
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
