<template>
	<modal
		:id="modal.title"
		:show="modal.show"
		:modal_class="modal.class"
		@closeModal="modal.show = false"
	>
		<template v-slot:content>
			<div class="modal-construct-top">
				<div class="modal-construct-top-title">
					{{ steps.title }}
				</div>
				<div class="modal-construct-top-text">
					{{ steps.title_action }}
				</div>
			</div>
			<keep-alive v-if="loading === false">
				<div class="modal-construct-content">
					<div class="row">
						<div class="col col-left">
							<div class="modal-construct-content-items" v-if="!done">
								<div class="row">
									<div class="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3 item" v-for="(item,idx) in steps.products" :key="item.id">
										<div class="wrap">
											<!--
											<div class="item-img">
												<img src="~assets/img/sandwich-or-canape-with-salmon-on-white-background-S2P4TFK 1.png" alt="">
											</div>
											-->
											<div class="item-title">
												{{ item.title }}
											</div>
											<div class="item-footer">
												<div class="row no-gutters align-items-center">
													<div class="col">
														<span>{{ item.price }}</span> <img src="~assets/img/ruble.svg" alt="">
													</div>
													<div class="col">
														{{ item.weight ? `${item.weight} гр.` : ''}}
													</div>
													<div class="col">
														<button type="button" @click="addProduct(item)">
															<img src="~assets/img/min.svg" alt="" v-if="cart.indexOf(item.id) !== -1">
															<img src="~assets/img/add.svg" alt="" v-else>
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="modal-construct-content-items-controls">
									<button type="button" class="btn btn-default"
										@click="prevStep"
									><img src="~assets/img/v2.svg" alt=""></button>
									<button type="button" class="btn btn-colored"
										@click="nextStep"
									>Далее</button>
								</div>
							</div>
							<div class="modal-construct-content-success" v-else>
								<div class="row">
									<div class="col-12 col-lg-6">
										<div class="modal-construct-content-success-title">
											ваш поке <br>
											готов!
										</div>
										<div class="modal-construct-content-success-text">
											Добавьте его в заказ <br>
											или измените состав
										</div>
										<div class="modal-construct-content-success-btn">
											<button type="button" class="btn btn-medium btn-accent"
												@click.prevent="addToCart"
											>
												<img src="~assets/img/cart.svg" alt="">
												<span>Добавить в заказ</span>
											</button>
										</div>
										<div class="modal-construct-content-success-prev">
											<a href="" @click.prevent="startStep">Изменить состав</a>
										</div>
									</div>
									<div class="col-12 col-lg-6">
										<div class="modal-construct-content-success-chief">
											Григорий Абрамов
											<span>шеф-повар More Poke</span>
										</div>
										<div class="modal-construct-content-success-quote">
											<img src="~assets/img/quote.svg" class="img-responsive" alt="">
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col col-right">
							<div class="modal-construct-content-selected">
								<div class="item" v-for="(item, title) in product" :key="item.id" v-if="item.length">
									<div class="item-title">
										{{ title.split('|')[1] }}
									</div>
									<div class="item-content" v-for="(i, idx) in item" :key="i.id">
										<div class="row no-gutters">
											<div class="col">
												{{ i.title }}
											</div>
											<div class="col">
												<div class="count">
													<div class="count-minus" @click="minusCount(i, title)"></div>
													<input type="text" v-model="i.count" readonly>
													<div class="count-plus" @click="plusCount(i, title)"></div>
												</div>
											</div>
											<div class="col">
												{{ item.weight ? `${item.weight} гр.` : ''}}
											</div>
											<div class="col">
												<button type="button" @click="removeItem(i, title)">
													<img src="~assets/img/delete.svg" alt="">
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="modal-construct-content-total">
								<div>Итого:</div>
								<strong>
									<span>{{ total }}</span>
									<svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M2.45102 2.01894e-08V21H6.15897V8.89858e-09L2.45102 2.01894e-08ZM4.65065 3.12H9.08133C10.3592 3.12 11.3857 3.41 12.1608 3.99C12.9359 4.55 13.3235 5.39 13.3235 6.51C13.3235 7.63 12.9359 8.48 12.1608 9.06C11.3857 9.64 10.3592 9.93 9.08133 9.93H4.65065V13.05H9.08133C10.6944 13.05 12.0875 12.79 13.2606 12.27C14.4338 11.73 15.345 10.97 15.9945 9.99C16.6648 9.01 17 7.85 17 6.51C17 5.17 16.6648 4.02 15.9945 3.06C15.345 2.08 14.4338 1.33 13.2606 0.81C12.0875 0.27 10.6944 -4.9118e-09 9.08133 0L4.65065 1.34914e-08V3.12Z" fill="#002238"/>
										<path d="M0 15.5455H11.4266V18.2728H0V15.5455Z" fill="#002238"/>
									</svg>
								</strong>
							</div>
						</div>
					</div>
				</div>
			</keep-alive>
		</template>
	</modal>
</template>

<script>
	export default {
		name: "ConstructModal",
		props: [ 'show', 'type' ],
		data: () => ({
			loading: true,
			currentStep: '',
			modal: {
				title: 'construct',
				show: false,
				class: 'modal-construct'
			},
			cart: {},
			steps: {},
			product: {},
			modificators: {},
      product_id: '',
			total: 0,
			done: false,
      start_price: 0
		}),
		watch: {
			show: {
				handler(val) {
					if(val === true) {
						if(this.$store.getters.getCity.default_id_org && this.type !== false) this.getConstructProduct()
						this.modal.show = true
					}else {
						this.startStep()
					}
				}
			},
		},
		mounted() {
			this.$store.dispatch('getCity')
		},
		methods: {
			async updateConstructProduct() {
				try {
					const options = {
						id_org: this.$store.getters.getCity.default_id_org,
						order_type: 1,
						type: this.type
					}
					const query = new URLSearchParams(options).toString()
					const {data} = await this.$axios.get(`/api/site/product/construct?${query}`)
					this.modificators = data.data.modificators
				}
				catch (e) {

				}
			},
			async getConstructProduct() {
				try {
					const options = {
						id_org: this.$store.getters.getCity.default_id_org,
						order_type: 1,
						type: this.type
					}
					const query = new URLSearchParams(options).toString()
					const {data} = await this.$axios.get(`/api/site/product/construct?${query}`)
					this.loading = false
					this.modificators = data.data.modificators
					this.cart = []
          this.product_id = data.data.id
          this.start_price = data.data.price
          this.total = this.start_price

					for (const [i, v] of this.modificators.entries()) {
						if(this.currentStep === '') this.currentStep = `${v.type}|${v.title}`
						if(this.currentStep === `${v.type}|${v.title}`) this.steps = v
						this.$set(this.product, `${v.type}|${v.title}`, [])
					}

				} catch (error) {
					console.log(error)
					this.loading = false
				}
			},
			removeItem(item, step) {
				const idx = this.cart.indexOf(item.id)
				for (const [i, v] of this.product[step].entries()) {
					if(v.id === item.id) {
						this.product[step].splice(i, 1)
						this.cart.splice(idx, 1)
					}
				}
				this.countTotal()
			},
			minusCount(item, step) {
				if(item.count === 1) return this.removeItem(item, step)
				item.count -= 1
				for (const [i, v] of this.product[step].entries()) {
					if(v.id === item.id) this.$set(this.product[step], i, item)
				}
				this.countTotal()
			},
			plusCount(item, step) {
				const type = step.split('|')
				let error = false
				for (let [i, v] of this.modificators.entries()) {
					if(v.type === type[0]) {
						if(this.countStepLength(step) >= v.max_quantity)
							error = `Максимум ингредиентов этой категории`

						console.log(this.product[step].length, v.max_quantity)
					}
				}
				if(!error) {
					item.count += 1
					for (const [i, v] of this.product[step].entries()) {
						if(v.id === item.id) this.$set(this.product[step], i, item)
					}
					this.countTotal()
				}else {
					this.$toast.error(error)
				}
			},
			addProduct(item) {
				const type = this.currentStep.split('|')
				const idx = this.cart.indexOf(item.id)
				if(idx === -1) {
					let error = false
					for (let [i, v] of this.modificators.entries()) {
						if(v.type === type[0]) {
							if(this.countStepLength(this.currentStep) >= v.max_quantity)
								error = `Максимум ингредиентов этой категории`
						}
					}
					if(!error) {
						item.count = 1
						const idx = this.product[this.currentStep].length
						this.$set(this.product[this.currentStep], idx, item)
						this.$set(this.cart, this.cart.length, item.id)
					}else {
						this.$toast.error(error)
					}
				}else {
					for (const [i, v] of this.product[this.currentStep].entries()) {
						if(v.id === item.id) this.product[this.currentStep].splice(i, 1)
						this.cart.splice(idx, 1)
					}
				}
				this.countTotal()
			},
			async addToCart() {
				try {
					const {data} = await this.$axios.post(`/api/site/cart/addConstruct`, {
						additives: this.product,
						id_org: this.$store.getters.getCity.default_id_org,
            id: this.product_id
					})
					this.$nuxt.$router.push('/cart')
					this.modal.show = false
					this.loading = false
					this.$nuxt.$emit('updateCart', data)
				}catch (error) {
					if(error.response.status === 404) {
						this.$toast.error(error.response.data.message)
					}
				}
			},
			countStepLength(step) {
				let total = 0;
				for (let i = this.product[step].length - 1; i >= 0; i--) {
					total += this.product[step][i].count
				}
				return total;
			},
			countTotal() {
				let total = 0
				for (const [i, v] of Object.entries(this.product)) {
					for (var ii = 0; ii < v.length; ii++) {
						total += parseInt(v[ii].price) * parseInt(v[ii].count)
					}
				}
				this.total = total + this.start_price
			},
			startStep() {
				this.updateConstructProduct()
				for (let [i, v] of this.modificators.entries()) {
					if(i === 0) {
						this.currentStep = `${v.type}|${v.title}`
						this.steps = v
						this.done = false
					}
				}
			},
			prevStep() {
				const type = this.currentStep.split('|')
				let idx = ''
				for (let [i, v] of this.modificators.entries()) {
					if(v.type === type[0]) {
						idx = i
						idx--
					}
				}
				for (let [i, v] of this.modificators.entries()) {
					if(idx === i) {
						this.currentStep = `${v.type}|${v.title}`
						this.steps = v
					}
				}
			},
			nextStep() {
				const type = this.currentStep.split('|')
				let idx = ''
				let error = false
				for (let [i, v] of this.modificators.entries()) {
					if(v.type === type[0]) {
						if(this.product[this.currentStep].length < v.min_quantity) error = `Выберите ${type[1]}`
						idx = i
						idx++
					}
				}
				if(!error) {
					for (let [i, v] of this.modificators.entries()) {
						if(idx === i) {
							this.currentStep = `${v.type}|${v.title}`
							this.steps = v
						}
					}
					if(idx === this.modificators.length) {
						this.done = true
						this.steps.title = ''
						this.steps.title_action = ''
					}
				}else {
					this.$toast.error(error)
				}
			},
		}
	}
</script>

<style scoped>

</style>
