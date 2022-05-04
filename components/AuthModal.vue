<template>
	<modal
		:id="modals.login.title"
		:show="modals.login.show"
		:modal_class="modals.login.class"
		@closeModal="closeModal"
	>
		<template v-slot:title>
			<div v-html="forms.signin.title"></div>
		</template>
		<template v-slot:content>

			<form action="" v-if="forms.signin.step === 1">
				<div :class="`form-group ${forms.signin.errors.phone ? 'has-error' : ''}`">
					<input type="tel" v-mask="'+# (###) ###-##-##'" v-model="forms.signin.phone" placeholder="+7 (999) 999-99-99">
					<span class="error" v-if="forms.signin.errors.phone">{{ forms.signin.errors.phone }}</span>
				</div>
				<div class="row">
					<div class="col-12 col-md-6">
						<div class="checkbox">
							<input type="checkbox" v-model="forms.signin.agree" id="a323">
							<label for="a323">
								<i></i>
								<span>Согласие на обработку <a href="/policy" target="_blank">персональных данных</a></span>
							</label>
						</div>
					</div>
					<div class="col-12 col-md-6 text-right">
						<button :disabled="!forms.signin.agree" type="button" class="btn btn-colored" @click="sendCode">Далее</button>
					</div>
				</div>
			</form>

			<form action="" v-else-if="forms.signin.step === 2">
				<div class="form-group modal-login-numbers">
					<input type="tel" v-model="forms.code.input1" ref="input1"
								 @keypress="cleanInput"
								 @keydown="codeTyping"
								 @keyup="nextInput">
					<input type="tel" v-model="forms.code.input2" ref="input2"
								 @keypress="cleanInput"
								 @keydown="codeTyping"
								 @keyup="nextInput">
					<input type="tel" v-model="forms.code.input3" ref="input3"
								 @keypress="cleanInput"
								 @keydown="codeTyping"
								 @keyup="nextInput">
					<input type="tel" v-model="forms.code.input4" ref="input4"
								 @keypress="cleanInput"
								 @keydown="codeTyping"
								 @keyup="nextInput">
				</div>
				<div class="form-error" v-if="forms.code.error">
					Код указан неверно. <br>
					Попробуйте еще раз
				</div>
				<div class="form-group text-center">
					<button type="button" class="btn btn-colored"
									@click.prevent="authorization"
									:disabled="!forms.code.inputsFilled">Далее</button>
				</div>
				<div class="form-text text-center" v-if="forms.code.timeout !== 0">
					Отправка нового кода через <b>{{ forms.code.timeout }}</b> сек
				</div>
				<div class="form-text text-center" v-else>
					<a href="" @click.prevent="sendNewCode">Отправить новый код</a>
				</div>
			</form>
		</template>
	</modal>
</template>

<script>
	import Modal from "../components/Modal";
	export default {
		components: {Modal},
		props: [ 'show', 'step','cities' ],
		data: () => ({
			loading: true,
			modals: {
				login: {
					title: 'login',
					show: false,
					step: '',
					class: 'modal-login'
				}
			},
			data: {},
			forms: {
				signin: {
					title: 'Введите номер телефона для заказа',
					step: 1,
					phone: '+7',
					agree: false,
					errors: {
						phone: false,
						agree: false
					}
				},
				code: {
					input1: '',
					input2: '',
					input3: '',
					input4: '',
					timeout: 30,
					error: false,
					inputsFilled: false
				}
			}
		}),
		created() {

		},
		mounted() {
			this.loading = false
			this.$nuxt.$emit('nextStep')
		},
		watch: {
			"forms.signin.phone": {
				deep: true,
				handler(val) {

				}
			},
			show: {
				handler(val) {
					if(val === true) this.modals.login.show = true
				}
			},
			step: {
				handler(val) {
					this.modals.login.step = val
				}
			},
			"forms.code": {
				deep: true,
				handler() {
					this.forms.code.inputsFilled = !!(this.forms.code.input1 &&
						this.forms.code.input2 && this.forms.code.input3 &&
						this.forms.code.input4);
				}
			}
		},
		computed: {
			code: function () {
				return this.forms.code.input1
					+ this.forms.code.input2
					+ this.forms.code.input3
					+ this.forms.code.input4
			},
			addressData () {
				return this.$store.getters.getAddressData
			},
			getStoreAddress () {
				const address = this.addressData
				if (address && address?.city && address?.street && address?.house_num) {
					return `${address.city ?? ''}, ${address.street ?? ''} ${address.house_num ?? ''}`
				}
			}
		},
		methods: {
			async authorization() {
				try {
					const {data} = await this.$axios.$post(`/api/site/auth/authorization`, {
						request_id: this.data.request_id,
						code: this.code
					})
					try {
						if (this.getStoreAddress && !localStorage.self_pickup) {
							const addressData = {...this.addressData}
							addressData.cityId = this.cities.find(city => city.title.toLowerCase() === addressData.city.toLowerCase())?.id || 0
							await this.$axios.$post(`/api/site/user/address`, addressData, {
								headers: { Authorization: `Bearer ${data.token}` }
							})
						}
					} catch (e) {
						if (e?.response?.status === 404) {
							this.$emit('showSelfPickup')
						}
					}
					this.loading = false
					await this.$store.dispatch('setToken', data.token)
					await this.$store.dispatch('setUserData', data.user)
					await this.logEvent('login')
					await this.logEvent('sign_up')
					this.modals.login.show = false
					if(this.modals.login.step === 'next') this.$store.commit('setCartStep', 'Step2')
				} catch (error) {
					console.error(error)
					if(error?.response?.status === 404) {
						this.forms.code.error = true
					}
					this.loading = false
				}
			},
			async sendCode() {
				if(this.forms.signin.phone.length < 18) {
					this.forms.signin.errors.phone = 'Введите телефон'
					return
				}
				try {
					const {data} = await this.$axios.post(`/api/site/auth/getSms`, {
            phone: this.forms.signin.phone
          })
					this.loading = false
					this.data = data
					this.forms.signin.step = 2
					this.forms.signin.title = `Для подтверждения телефона, <span>введите последние 4 цифры номера телефона, с которого вам придёт звонок на номер: ${this.forms.signin.phone}</span>`
					this.countDownTimer()

				} catch (error) {
					if(error.response.status === 422) {
						this.forms.signin.errors = error.response.data.errors
					}
					this.loading = false
				}
			},
			closeModal() {
				this.modals.login.show = false
			},
			sendNewCode() {
				this.forms.code.timeout = 30
				this.countDownTimer()
				this.sendCode()
			},
			cleanInput(event) {
				event.target.value = ''
			},
			codeTyping(event) {
				event.target.setSelectionRange(0, 1)
			},
			nextInput(event) {
				if(event.code === 'Backspace' && event.target.previousElementSibling !== null) {
					event.target.previousElementSibling.focus()
				} else if(event.code !== 'Backspace' && event.target.nextElementSibling !== null)
					event.target.nextElementSibling.focus()
			},
			countDownTimer() {
				if(this.forms.code.timeout > 0) {
					setTimeout(() => {
						this.forms.code.timeout -= 1
						this.countDownTimer()
					}, 1000)
				}
			}
		}
	}
</script>

<style scoped>

</style>
