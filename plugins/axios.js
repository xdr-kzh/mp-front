export default ({ store, $axios }) => {
	store.dispatch('getToken')
	const token = store.getters['getToken']
	if (token) {
		$axios.setToken(token, 'Bearer')
	}
}
