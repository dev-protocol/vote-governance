/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { describe } from 'mocha'
import { deployContract, MockProvider } from 'ethereum-waffle'
import { getPropertyGroupContract } from '../../../src/contract'
import PropertyGroup from '../../../build/PropertyGroup.json'

describe('getPropertyGroupContract', () => {
	it('Get the PropertyGroup instance of the mock environment.', async () => {
		const provider = new MockProvider()
		const wallets = provider.getWallets()
		const propertyGroupInstance = await deployContract(
			wallets[0],
			PropertyGroup
		)
		await propertyGroupInstance.addGroup(wallets[1].address)
		const instance = await getPropertyGroupContract(
			provider as any,
			propertyGroupInstance.address
		)
		expect(instance.address).to.be.equal(propertyGroupInstance.address)
		expect(await instance.isGroup(wallets[1].address)).to.be.equal(true)
		expect(await instance.isGroup(wallets[2].address)).to.be.equal(false)
	})
})
