<template>
	<div class="cart">
		<div class="container">
			<div class="row">
				<div class="col-12 col-xl-8 offset-xl-2">
					<div class="h1 mb-1 mt-4 mb-5">
						<img src="~assets/img/Vector.svg" alt="" @click="prevStep">
						<span>Адрес доставки</span>
					</div>
					<div class="cart-edit_address">
						<div class="cart-edit_address-add" @click="addAddress">
							<span>Добавить адрес доставки</span>
						</div>
						<div class="cart-edit_address-list">
							<loader v-if="loading"></loader>

							<div class="items" v-else>
								<div class="item" v-for="(item, idx) in addresses" :key="item.id">
									<input type="radio" v-model="order.address_id" :value="idx" :id="`address${item.id}`">
									<label :for="`address${item.id}`">{{ getAddress(item) }}</label>
								</div>
							</div>

							<div class="form-group mt-5">
								<button type="button" @click.prevent="changeAddress(addresses[order.address_id])" class="btn btn-colored btn-medium">
									<span>Выберите адрес</span><i class="icon-right-open-big pl-3"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Loader from "../../Loader";
	export default {
		name: "EditAddress",
		components: {Loader},
		data: () => ({
			addresses: [],
			order: {
				address_id: '',
				address: ''
			},
			loading: true
		}),
		mounted() {
			this.getUserAddresses()
		},
		methods: {
			prevStep() {
				this.$emit('nextStep', 'Step3')
			},
			getAddress (item) {
				return `${item.city}, ${item.street} ${item.house_num}`
			},
			addAddress() {
				this.$emit('nextStep', 'AddAddress')
			},
			async getUserAddresses() {
				try {
					const city_id = this.$store.getters.getCity.id
					this.addresses = await this.$axios.$get(`/api/site/user/address?city_id=${city_id}`, {
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})
					this.loading = false
				} catch (error) {
					console.log(error)
					this.loading = false
				}
			},
			changeAddress(item) {
				this.order.address = this.getAddress(item)
				this.order.address_id = item.id
				this.$store.commit('setOrder', this.order)
				this.$store.commit('setAddressData', {
					address: this.order.address,
					city: item.city,
					street: item.street,
					house_num: item.house_num,
					city_id: item.city_id,
					cityId: item.city_id
				})
				console.log('order', this.$store.getters.getOrder, this.order)
				this.$emit('nextStep', 'Step3')
			}
		}
	}
</script>

<style scoped>

</style>
