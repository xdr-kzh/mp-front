<template>
	<div class="cart">
		<div class="container">
			<div class="row">
				<div class="col-12 col-xl-8 offset-xl-2">
					<div class="h1 mb-1 mt-4 mb-5 text-center">Благодарим вас за <br>
						заказ №{{ order.id }}</div>

					<div class="cart-success">
						<div class="cart-success-status"
								 :style="`background:${order.status.color};`"
						>
							{{ order.status.name }}
						</div>
						<div class="cart-success-products">
							<table>
								<thead>
									<tr>
										<td colspan="2">Продукты в заказе</td>
										<th>{{ order.count }}</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(item, idx) in order.products" :key="item.id">
										<td>
											<img :src="item.img_small" alt="">
										</td>
										<td>
											<strong>{{ item.title }}</strong>
											<div v-if="item.options !== undefined">
												<div v-for="m in item.options" :key="m.id">
													<div v-for="i in m" :key="i.id">
														{{i.block_title}}: {{ i.title }}
													</div>
												</div>
											</div>
										</td>
										<th>
											{{ item.price }} ₽
										</th>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="cart-success-data">
							<table>
								<tfoot>
								<tr>
									<td>Дата заказа</td>
									<td>{{ order.created_at }}</td>
								</tr>
								<tr>
									<td>Ресторан</td>
									<td>{{ order.organization.title }}</td>
								</tr>
								<tr v-if="order.address_name">
									<td>Адрес доставки</td>
									<td>{{ order.address_name }}</td>
								</tr>
								<tr>
									<td>Способ доставки</td>
									<td>{{ order.delivery.name }}</td>
								</tr>
								<tr>
									<td>Сумма заказа</td>
									<td>{{ order.cost }} ₽</td>
								</tr>
								<tr v-if="order.delivery_cost">
									<td>Стоимость доставки</td>
									<td>{{ order.delivery_cost }} ₽</td>
								</tr>
								<tr v-if="order.bonus_writeoff">
									<td>Оплачено бонусами</td>
									<td>{{ order.bonus_writeoff }} ₽</td>
								</tr>
								<tr v-if="order.bonus_writeoff">
									<td>К оплате</td>
									<td>{{ order.cost - order.bonus_writeoff + order.delivery_cost }} ₽</td>
								</tr>
								<tr>
									<td>Способ оплаты</td>
									<td>{{ order.payment.name }}</td>
								</tr>
								</tfoot>
							</table>
							<div class="form-group mt-5 text-center">
								<nuxt-link :to="`/`" class="btn btn-colored">Перейти в меню</nuxt-link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
	  name: "Step4",
		data: () => ({
			order: {
        products: []
      }
		}),
		created() {
	  	this.getOrder()
		},
		methods: {
	  	getOrder() {
	  		this.order = this.$store.getters.getOrder
				this.updateUserData()
				console.log(this.order)
			},
			async updateUserData() {
				try {
					const {data} = await this.$axios.get('/api/site/user/init')
					if (data?.id) {
						this.$fire.analytics.setUserId(data.id)
					}
					this.$store.commit('setUserData', data)
				}catch (e) {
					console.log(e)
				}
			}
		}
	}
</script>

<style scoped>

</style>
