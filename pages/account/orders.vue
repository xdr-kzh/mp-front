<template>
	<div>
		<div class="mt-5"></div>

		<div class="account">
			<div class="container">
				<div class="row">
					<div class="col account-aside">
						<account-nav></account-nav>
					</div>
					<div class="col account-content">
						<div class="account-content-title">
							Мои заказы
						</div>
						<div class="account-content-orders">
							<loader v-if="loading"></loader>

							<div class="item item-in-progress" v-else-if="orders.length" v-for="(item, idx) in orders">
								<div class="row">
									<div class="col-12 col-lg-8">
										<div class="item-title">
											Заказ №{{ item.id }}
										</div>
									</div>
									<div class="col-12 col-lg-4">
										<div class="item-badge">
											<span :style="`background:${item.status_wrapper_color};color:${item.status_title_color}`">{{ item.status_name }}</span>
										</div>
									</div>
								</div>
								<div class="item-text">
									{{ address(item) }}
								</div>
								<div class="row">
									<div class="col-12 col-lg-8">
										<div class="item-date">
											{{ item.createdon }}
										</div>
									</div>
									<div class="col-12 col-lg-4">
										<div class="item-cost">
											{{ item.cost }} ₽
										</div>
									</div>
								</div>
							</div>

							<div class="empty" v-else-if="!loading">Пока заказов нет</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import AccountNav from "../../components/AccountNav";
	export default {
		components: {AccountNav},
		middleware: [
			'authenticated'
		],
		name: "orders",
		data: () => ({
			loading: true,
			orders: []
		}),
		mounted() {
			this.getOrders()
		},
		methods: {
			async getOrders() {
				try {
					const {data} = await this.$axios.get('/api/site/user/order', {
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})
					this.orders = data.orders
					this.loading = false
				}catch (e) {
					console.log(e)
					this.loading = false
				}
			},
			address(address) {
				let tmp = []
				if(address.city) tmp.push(`г.${address.city}`)
				if(address.street) tmp.push(`ул.${address.street}`)
				if(address.house_num) tmp.push(`д.${address.house_num}`)
				if(address.flat_num) tmp.push(`кв./оф.${address.flat_num}`)
				return tmp.join(', ')
			}
		}
	}
</script>

<style scoped>

</style>
