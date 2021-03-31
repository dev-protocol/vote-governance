/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { describe } from 'mocha'
import { deployContract, MockProvider } from 'ethereum-waffle'
import { getAddressConfigContract } from '../../../src/contract/address-config'
import AddressConfig from '../../../build/AddressConfig.json'

describe('getDevContract', () => {
	it('Get the AddressConfig instance of the mock environment.', async () => {
		const provider = new MockProvider()
		const wallets = provider.getWallets()
		const addressConfigInstance = await deployContract(
			wallets[0],
			AddressConfig
		)
		await addressConfigInstance.setToken(wallets[1].address)
		await addressConfigInstance.setPropertyGroup(wallets[2].address)
		const instance = getAddressConfigContract(
			provider as any,
			addressConfigInstance.address
		)
		expect(instance.address).to.be.equal(addressConfigInstance.address)
		expect(await instance.token()).to.be.equal(wallets[1].address)
		expect(await instance.propertyGroup()).to.be.equal(wallets[2].address)
	})
})
