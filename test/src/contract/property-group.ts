/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { getPropertyGroupContract } from '../../../src/contract'
import { ethers } from 'hardhat'

describe('getPropertyGroupContract', () => {
	it('Get the PropertyGroup instance of the mock environment.', async () => {
		const wallets = await ethers.getSigners()
		const factory = await ethers.getContractFactory('PropertyGroup')
		const propertyGroupInstance = await factory.connect(wallets[0]).deploy()
		await propertyGroupInstance.deployTransaction.wait()

		await propertyGroupInstance.addGroup(wallets[1].address)
		const instance = await getPropertyGroupContract(
			wallets[0].provider as any,
			propertyGroupInstance.address
		)
		expect(instance.address).to.be.equal(propertyGroupInstance.address)
		expect(await instance.isGroup(wallets[1].address)).to.be.equal(true)
		expect(await instance.isGroup(wallets[2].address)).to.be.equal(false)
	})
})
