/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { describe } from 'mocha'
import { ethers, Contract } from 'ethers'
import { getDevContract, getDevTransferEvent } from '../../../src/contract'
import { deployContract, MockProvider } from 'ethereum-waffle'
import Dev from '../../../build/Dev.json'

export const deployDevContract = async (provider: MockProvider): Promise<Contract> => {
	const wallets = provider.getWallets()
	const dev = await deployContract(wallets[0], Dev)
	return dev
}

describe('getDevContract', () => {
	it('Get the Dev instance of the mock environment.', async () => {
		const provider = new MockProvider()
		const devInstance = await deployDevContract(provider)
		const instance = await getDevContract(provider, devInstance.address)
		expect(instance.address).to.be.equal(devInstance.address)
	})
})

// describe('getDevTransferEvent', () => {
// 	const init = async (): Promise<Contract> => {
// 		const wallets = provider.getWallets()
// 		const dev = await deployContract(wallets[0], Dev)
// 		return dev
// 	}

//     before( async()=>{
//         await deployDevContract
//     });
// 	it('Get the Transfer event of the address specified by the destination.', async () => {
// 		const provider = ethers.getDefaultProvider('homestead')
// 		const instance = await getDevContract(provider)
// 		const events = await getDevTransferEvent(instance, null, '0xA717AA5E8858cA5836Fef082E6B2965ba0dB615d', 11962079)
// 		events.map((event) => {
// 			expect(event.args!.to).to.be.equal('0xA717AA5E8858cA5836Fef082E6B2965ba0dB615d')
// 			expect(event.blockNumber<=11962079).to.be.equal(true)
// 		})
// 		expect(events.length>0).to.be.equal(true)
// 	})
// 	it('Get the Transfer event of the address specified by the sender.', async () => {
// 		const provider = ethers.getDefaultProvider('homestead')
// 		const instance = await getDevContract(provider)
// 		const events = await getDevTransferEvent(instance, '0xA717AA5E8858cA5836Fef082E6B2965ba0dB615d', null, 12143892)
// 		events.map((event) => {
// 			expect(event.args!.from).to.be.equal('0xA717AA5E8858cA5836Fef082E6B2965ba0dB615d')
// 			expect(event.blockNumber<=12143892).to.be.equal(true)
// 		})
// 		expect(events.length>0).to.be.equal(true)
// 	})
// })
