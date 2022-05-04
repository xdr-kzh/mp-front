<template>
	<div class="cart">
		<div class="container">
			<div class="row">
				<div class="col-12 col-xl-8 offset-xl-2">
					<div class="h1 mb-4 mt-4 mb-lg-5">Оформление заказа</div>

					<div class="cart-order">
						<div :class="`form-group ${errors.name ? 'has-error' : ''}`">
							<input type="text" v-model="order.name" placeholder="Ваше имя">
							<span class="error" v-if="errors.name">{{ errors.name }}</span>
						</div>
						<div :class="`form-group ${errors.phone ? 'has-error' : ''}`">
							<input type="text" v-mask="'+# (###) ###-##-##'" v-model="order.phone" placeholder="Телефон">
							<span class="error" v-if="errors.phone">{{ errors.phone }}</span>
						</div>
						<div :class="`form-group ${errors.birthday ? 'has-error' : ''}`">
							<input type="text" v-mask="'##.##.####'" v-model="order.birthday" placeholder="Дата рождения">
							<span class="error" v-if="errors.birthday">{{ errors.birthday }}</span>
							<span class="form-group-text" v-else>Укажите для получения скидки в день рождения</span>
						</div>
						<div :class="`form-group ${errors.email ? 'has-error' : ''}`">
							<input type="email" v-model="order.email" placeholder="Ваш E-Mail">
							<span class="error" v-if="errors.email">{{ errors.email }}</span>
							<span class="form-group-text" v-else>Для чеков и информации об акциях</span>
						</div>
						<div class="form-group">
							<div class="form-group-title">Ваш пол</div>
							<div class="radio">
								<input type="radio" v-model="order.gender" value="1" id="gender1">
								<label for="gender1"><i></i><span>Мужской</span></label>
							</div>
							<div class="radio">
								<input type="radio" v-model="order.gender" value="2" id="gender2">
								<label for="gender2"><i></i><span>Женский</span></label>
							</div>
						</div>
						<div class="form-group">
							<button type="button" @click.prevent="nextStep" class="btn btn-colored btn-medium">
								<span>Продолжить</span><i class="icon-right-open-big pl-3"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
	  name: "Step2",
		data: () => ({
			order: {
				name: '',
				phone: '',
				birthday: '',
				gender: ''
			},
			errors: {
				name: false,
				phone: false,
				birthday: false,
				email: false
			}
		}),
		mounted() {
			this.$store.dispatch('getUserData')
	  	if(this.$store.getters.getUserData) {
	  		this.order.phone = this.$store.getters.getUserData.phone
				this.order.birthday = this.$store.getters.getUserData.birthday
				this.order.email = this.$store.getters.getUserData.email
				this.order.name = this.$store.getters.getUserData.name
				this.order.gender = this.$store.getters.getUserData.gender
				Object.assign(this.order, this.$store.getters.getUserData)
			}
		},
		watch: {
			order: {
	  		deep: true,
	  		handler() {
					for(const [key, value] of Object.entries(this.order)) {
	  				if(value !== '') this.errors[key] = ''
					}
				}
			}
		},
		methods: {
			validate: function (e) {
				this.errors = []
				let hasErrors = false

				if (!this.order.name) {
					this.errors.name = 'Требуется указать имя'
					hasErrors = true
				}
				if(this.order.birthday && this.order.birthday.length < 10) {
					this.errors.birthday = 'Введите дату рождение'
					hasErrors = true
				}
				if (!this.order.phone || this.order.phone.length < 18) {
					this.errors.phone = 'Требуется указать телефон'
					hasErrors = true
				}
				return (!hasErrors)
			},
			nextStep() {
				if(this.validate()) {
					if(this.$store.getters.getToken !== '') {
						this.$emit('nextStep', 'Step3')
						this.$store.commit('setOrder', this.order)
					}
					else
						this.$emit('showModalSignIn')
				}
			},
		}
	}
</script>

<style scoped>
	.form-group input[type=text],
	.form-group input[type=email],
	.form-group input[type=tel] {
		width: 100%;
	}
</style>
