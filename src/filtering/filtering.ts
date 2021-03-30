export const filteringValidData = (
	voteData: readonly VoteData[]
): readonly VoteData[] => {
	return voteData.filter((data) => {
		return (
			data.isValid &&
			isAccurateSumValue(data) &&
			isSameDataCount(data) &&
			isUniqueOptionNames(data)
		)
	})
}

const isAccurateSumValue = (data: VoteData): boolean => {
	return (
		data.percentiles.reduce((sum, element) => {
			return sum + element
		}, 0) === 100
	)
}

const isSameDataCount = (data: VoteData): boolean => {
	return data.percentiles.length === data.options.length
}

const isUniqueOptionNames = (data: VoteData): boolean => {
	const options = new Set(data.options)
	return options.size === data.options.length
}
