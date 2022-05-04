<template>
	<div class="cart">
		<div class="container">
			<div class="row">
				<div class="col-12 col-xl-8 offset-xl-2">
					<div class="h1 mb-1 mt-4 mb-5">
						<img src="~assets/img/Vector.svg" alt="" @click="prevStep">
						<span>Адрес доставки</span>
					</div>

					<div class="cart-add_address">
						<div :class="`form-group ${errors.city ? 'has-error' : ''}`">
							<input type="text" v-model="address.city" :class="`${loading ? 'loading' : ''}`" placeholder="Город" readonly />
							<span class="error" v-if="errors.city">{{ errors.city }}</span>
						</div>
						<div :class="`form-group ${errors.street ? 'has-error' : ''}`">
							<input type="text" v-model="address.street" placeholder="Улица">
							<span class="error" v-if="errors.street">{{ errors.street }}</span>
						</div>
						<div class="row no-gutters">
							<div class="col-12 col-lg-4">
								<div :class="`form-group mr-1 ${errors.house_num ? 'has-error' : ''}`">
									<input type="text" v-model="address.house_num" placeholder="Дом">
									<span class="error" v-if="errors.house_num">{{ errors.house_num }}</span>
								</div>
							</div>
							<div class="col-12 col-lg-4">
								<div :class="`form-group mr-1 ml-1 ${errors.entrance ? 'has-error' : ''}`">
									<input type="text" v-model="address.entrance" placeholder="Подъезд">
									<span class="error" v-if="errors.entrance">{{ errors.entrance }}</span>
								</div>
							</div>
							<div class="col-12 col-lg-4">
								<div :class="`form-group ml-1 ${errors.flat_num ? 'has-error' : ''}`">
									<input type="text" v-model="address.flat_num" placeholder="Кв./Офис">
									<span class="error" v-if="errors.flat_num">{{ errors.flat_num }}</span>
								</div>
							</div>
						</div>
						<div class="row no-gutters">
							<div class="col-12 col-lg-6">
								<div :class="`form-group mr-1 ${errors.floor ? 'has-error' : ''}`">
									<input type="text" v-model="address.floor" placeholder="Этаж">
									<span class="error" v-if="errors.floor">{{ errors.floor }}</span>
								</div>
							</div>
							<div class="col-12 col-lg-6">
								<div :class="`form-group ml-1 ${errors.doorphone ? 'has-error' : ''}`">
									<input type="text" v-model="address.doorphone" placeholder="Код домофона">
									<span class="error" v-if="errors.doorphone">{{ errors.doorphone }}</span>
								</div>
							</div>
						</div>
						<div :class="`form-group ${errors.name ? 'has-error' : ''}`">
							<input type="text" v-model="address.name" placeholder="Название адреса">
							<span class="error" v-if="errors.name">{{ errors.name }}</span>
						</div>
						<div :class="`form-group ${errors.comment ? 'has-error' : ''}`">
							<input type="text" v-model="address.comment" placeholder="Комментарий к адресу">
							<span class="error" v-if="errors.comment">{{ errors.comment }}</span>
						</div>
						<div class="form-group">
							<button type="button" @click.prevent="saveAddress" class="btn btn-colored btn-medium">
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
		name: "AddAddress",
		data: () => ({
			loading: true,
			cities: [],
			address: {
				city: '',
				street: '',
				house_num: '',
				flat_num: '',
				entrance: '',
				floor: '',
				doorphone: '',
				name: '',
				comment: '',
			},
			errors: {
				city: false,
				street: false,
				house_num: false,
				flat_num: false,
				entrance: false,
				floor: false,
				doorphone: false,
				name: false,
				comment: false,
			}
		}),
		mounted() {
			this.getCities()
			this.address.city = this.$store.getters.getCity.title
			this.address.city_id = this.$store.getters.getCity.id
		},
		watch: {
			address: {
				deep: true,
				handler() {
					for(const [key, value] of Object.entries(this.address)) {
						if(value !== '') this.errors[key] = ''
					}
				}
			}
		},
		methods: {
			validate() {
				this.errors = []
				let hasErrors = false

				if (!this.address.city) {
					this.errors.city = 'Требуется указать город'
					hasErrors = true
				}
				if (!this.address.street) {
					this.errors.street = 'Требуется указать улицу'
					hasErrors = true
				}
				if (!this.address.house_num) {
					this.errors.house_num = 'Требуется указать номер дома'
					hasErrors = true
				}
				if (!this.address.flat_num) {
					this.errors.flat_num = 'Требуется указать номер кв./офиса'
					hasErrors = true
				}
				return (!hasErrors)
			},
			async getCities() {
				try {
					const {data} = await this.$axios.get(`/api/site/town`, {
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})
					this.cities = data.towns
					this.loading = false
				} catch (error) {
					console.log(error)
					this.loading = false
				}
			},
			async saveAddress() {
				if(this.validate()) {
					try {
						const {data} = await this.$axios.post(`/api/site/user/address`, this.address, {
							headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
						})
						this.loading = false
						this.$store.dispatch('setOrder', {address_id: data.data.id, address: data.data.address})
						this.$emit('nextStep', 'Step3')
					} catch (error) {
						if(error.response.status === 404) {
							this.$toast.error('Доставка по данному адресу недоступна')
						}
						this.loading = false
					}
				}
			},
			prevStep() {
				this.$emit('nextStep', 'Step3')
			},
		}
	}
</script>

<style scoped>

</style>
