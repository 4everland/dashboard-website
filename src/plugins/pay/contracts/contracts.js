export default class Contracts {

	confirmations = 1

	provider = null

	setProvider(provider) {
		this.provider = provider
	}

	async sendTransaction(tx) {
		const from = await this.signer.getAddress()
		const mytx = await this.signer.sendTransaction({
			from,
			...tx
		})
		return mytx.wait(this.confirmations)
	}

	get signer() {
		this.validateProvider()
		return this.provider.getSigner()
	}

	async chainId() {
		return this.signer.getChainId()
	}

 validateProvider() {
		if (!this.provider) {
			throw new Error('provider not found')
		}
	}

}