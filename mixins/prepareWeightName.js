export default {
	methods: {
		prepareWeightName(string) {
			if(string === undefined) return
			string = string.replace('Грамм', 'гр.')
			string = string.replace('Килограммов', 'кг.')
			string = string.replace('Литров', 'л.')
			string = string.replace('Миллилитров', 'мл.')
			return string
		},
	}
}
