/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { getAddressConfigContract } from '../../../src/contract/address-config'
import { ethers } from 'hardhat'

describe('getAddressConfigContract', () => {
	it('Get the AddressConfig instance of the mock environment.', async () => {
		const wallets = await ethers.getSigners()
		const factory = await ethers.getContractFactory('AddressConfig')
		const addressConfigInstance = await factory.connect(wallets[0]).deploy()
		await addressConfigInstance.deployTransaction.wait()

		await addressConfigInstance.setToken(wallets[1].address)
		await addressConfigInstance.setPropertyGroup(wallets[2].address)
		const instance = getAddressConfigContract(
			wallets[0].provider as any,
			addressConfigInstance.address
		)
		expect(instance.address).to.be.equal(addressConfigInstance.address)
		expect(await instance.token()).to.be.equal(wallets[1].address)
		expect(await instance.propertyGroup()).to.be.equal(wallets[2].address)
	})
})
