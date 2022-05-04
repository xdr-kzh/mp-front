import mutations from "./mutations";
import actions from "./actions";

export const state = () => ({
	user: '',
	city:  '',
	token: '',
	cartStep: 'Step1',
	openConstructModal: false,
	order: {},
	product: {},
	organization: '',
	selectedCity: false,
	addressData: null
})

export const getters = {
	getCity: state => state.city,
	getAddressData: state => state.addressData,
	getSelectedCity: state => state.selectedCity,
	getToken: state => state.token,
	getUserData: state => state.user,
	getCartStep: state => state.cartStep,
	getOrder: state => state.order,
	getProduct: state => state.product,
	openConstructModal: state => state.openConstructModal,
	getOrganization: state => state.organization
}

export {
	mutations,
	actions
}
