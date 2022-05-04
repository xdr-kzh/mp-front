<template>
	<div>

		<section class="app-offer">
			<div class="app-offer__poke-down-bg"></div>
			<div class="app-offer__poke-top-bg"></div>
			<div class="app-offer__wrapper">
				<div class="app-offer__title-wrapper">
					<div class="app-offer__title">Мобильное приложение</div>
					<div class="sitename">more poke</div>
				</div>
				<div class="app-offer__content">
					<div class="app-offer__text">Дарим</div>
					<div class="app-offer__cost">100 Р</div>
					<div class="app-offer__description">за установку</div>
					<div class="app-offer__discount">
						<b>{{ organization.bonus_reward + 5 }}</b>
						<div>
							<span><i>%</i> кэшбэк</span>
							на все покупки
						</div>
					</div>
					<div class="app-offer__links">
						<a target="_blank" href="https://play.google.com/store/apps/details?id=com.mayak13.morepoke" class="app-offer__link gplay"></a>
						<a target="_blank" href="https://apps.apple.com/ru/app/more-poke/id1571901202" class="app-offer__link appstore"></a>
						<a target="_blank" href="https://appgallery.huawei.com/#/app/C104933225" class="app-offer__link huawei"></a>
					</div>
				</div>
			</div>
		</section>

		<section class="h-hero">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<div class="h-hero-block">
							<div class="h-hero-block-pre">
								Гавайские боулы
							</div>
							<div class="h-hero-block-title">
								MORE POKE
							</div>
							<div class="h-hero-block-text">
								Познакомьтесь с культурой  <br>
								гавайских островов, попробовав  <br>
								их традиционные блюда
							</div>
						</div>
						<work-time v-if="!loading"></work-time>
					</div>
				</div>
			</div>
		</section>

		<loader v-if="loading"></loader>

		<section class="products" :id="category_title(category.title)"
						 v-else
						 v-for="category in poke"
						 :key="category.id">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<div class="h1">{{ category.title }}</div>
					</div>
				</div>
				<div class="row">
					<product
						v-for="(product, idx) in category.products"
						v-if="product.org_id === $store.getters.getCity.default_id_org"
						:key="product.id"
						:product="product"
						:idx="idx"
						:cart="cart"
					></product>
				</div>
			</div>
		</section>

		<section class="gift" id="gift">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<div class="gift-block">
							<div class="gift-block-title">
								Собери свой поке
							</div>
							<div class="gift-block-text">
								Выбери основу и добавь любые ингредиенты
							</div>
							<div class="gift-block-btn">
								<a href="" @click.prevent="showModal('мини')" class="btn btn-accent">Мини</a>
								<a href="" @click.prevent="showModal('стандарт')" class="btn btn-accent">Стандарт</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<loader v-if="loading"></loader>
		<section class="products" :id="category_title(category.title)"
						 v-else
						 v-for="category in catalog"
						 :key="category.id">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<div class="h1">{{ category.title }}</div>
					</div>
				</div>
				<div class="row">
					<product
						v-for="(product, idx) in category.products"
						v-if="product.org_id === $store.getters.getCity.default_id_org"
						:key="product.id"
						:product="product"
						:idx="idx"
						:cart="cart"
					></product>
				</div>
			</div>
		</section>

		<loader v-if="loading"></loader>
		<section class="products" :id="category.title"
						 v-else
						 v-for="category in sales"
						 :key="category.id">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<div class="h1">{{ category.title }}</div>
					</div>
				</div>
				<div class="row">
					<product
						v-for="(product, idx) in category.products"
						v-if="product.org_id === $store.getters.getCity.default_id_org"
						:key="product.id"
						:product="product"
						:idx="idx"
						:cart="cart"
					></product>
				</div>
			</div>
		</section>

		<section class="delivery">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<div class="h1 text-center">Доставка и оплата</div>
					</div>
				</div>
				<div class="row">
					<div class="item col-12 order-md-1 col-md-6 col-lg-4">
						<div class="wrap">
							<div class="item-img">
								<img src="~assets/img/icon-delivery.svg" alt="">
							</div>
							<div class="item-content">
								<p><strong>Среднее время доставки заказа - 60-90 минут</strong> с момента оформления.</p>
								<p>Наши курьеры сделают все возможное, чтобы вы получили свой заказ как можно быстрее!</p>
							</div>
						</div>
					</div>
					<div class="item col-12 order-md-3 order-lg-2 col-lg-4">
						<div class="wrap">
							<div class="item-title">
								{{ organization.worktime }}
							</div>
							<div class="item-text">
								Заказы принимаются каждый день
							</div>
						</div>
					</div>
					<div class="item col-12 order-md-2 col-md-6 col-lg-4">
						<div class="wrap">
							<div class="item-img">
								<img src="~assets/img/icon-payment.svg" alt="">
							</div>
							<div class="item-content">
								<p>Вы можете оплатить заказ
									<strong>онлайн</strong> при оформлении
									на сайте, а также при получении <strong>наличными или картой</strong>.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<div>
			<section class="map">
				<div class="map-abs">
					<div class="row">
						<div class="col-12 col-lg-6">
						</div>
						<div class="map-abs-content col-12 col-lg-6">
							<div class="wrap">
                <client-only>
                  <yandex-map :coords="coords" :scroll-zoom="false">
                    <ymap-marker
                      :marker-id="markerId"
                      :coords="coords"
                      :icon="icon"
                    ></ymap-marker>
                  </yandex-map>
                </client-only>
							</div>
						</div>
					</div>
				</div>
				<div class="container">
					<div class="row">
						<div class="map-contacts col-12 col-lg-6">
							<div class="wrap">
								<div class="h1">Как нас найти</div>
								<div class="map-contacts-block">
									<div class="item">
										<span>адрес</span>
										<div>{{ organization.address }}</div>
									</div>
									<div class="item">
										<span>телефон</span>
										<div><a :href="`tel:${organization.phone}`">{{ organization.phone }}</a></div>
									</div>
									<div class="item">
										<div class="row">
											<div class="col-6 col-lg-6">
												<span>пн-вс</span>
												<div>{{ organization.worktime }}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>

		<construct-modal
			:show="modals.construct.show"
			:type="modals.construct.type"
			@closeModals="closeModals"
		></construct-modal>
	</div>
</template>

<script>
	import Modal from "../components/Modal";
	import WorkTime from "../components/Index/WorkTime";
	import Product from "../components/Product";
	import ConstructModal from "../components/Index/ConstructModal";

	export default {
		components: {ConstructModal, Product, WorkTime, Modal },
		head() {
			return {
				title: 'MORE POKE - Доставка гавайской кухни в ' + this.$store.getters.getCity.title_logo,
				meta: [
					{
						hid: 'description',
						name: 'description',
						content: 'MORE POKE - Доставка гавайской кухни в ' + this.$store.getters.getCity.title_logo
					}
				]
			}
		},
    data: () => ({
			modals: {
				construct: {
					title: 'construct',
					show: false,
					class: 'modal-construct',
					type: false
				}
			},
			cart: {},
			loading: true,
			id_org: 0,
      organization: {},
			construct: {},
			sales: [],
			poke: [],
			products: [],
			catalog: [],
      errors: {},
      markerId: 1,
      coords: [56.845239, 53.200261],
      icon: {
          layout: 'default#imageWithContent',
          imageHref: '',
          imageSize: [60, 60],
          imageOffset: [-30, -60],
          content: 'some content here',
          contentOffset: [-30, -60],
          contentLayout: '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>' // строковый HTML шаблон для контента
      }
    }),
		created() {
			this.$store.watch(
				(state) => {
					return this.$store.getters.getCity
				},
				(newValue, oldValue) => {
					this.loading = true
					this.getPoke()
					this.getProducts()
					this.getSales()
          this.organization = this.$store.getters.getCity.organization
					if(!this.organization.hasOwnProperty('bonus_reward')) {
						this.getOrganization(this.organization.id)
					}
				},
				{
					deep:true
				}
			)
			this.$nuxt.$on('closeModals', () => {
				this.modals.construct.show = false
			})
		},
		mounted() {
    	this.icon.imageHref = require(`~/assets/img/marker.svg`)
    	if(this.$store.getters.getCity) {
				this.id_org = this.$store.getters.getCity.default_id_org
    	  this.organization = this.$store.getters.getCity.organization
    	  this.coords = [this.organization.lat, this.organization.long]
				this.getPoke()
				this.getProducts()
				this.getSales()
			}
			if (window.location.hash) {
				this.goAnchor(window.location.hash)
			}
    },
    methods: {
			goAnchor(selector) {
				// It is best to add a timer to the page buffer time
				setTimeout(() => {
					// Get the anchor element
					let anchor = this.$el.querySelector(selector)
					anchor.scrollIntoView()
				}, 500)
			},
			closeModals() {
				// look created()
			},
			async getOrganization(id) {
				try {
					const {data} = await this.$axios.get(`/api/site/organization/${id}`)
					this.organization = data.data
				}
				catch(e) {
					console.log(e)
				}
			},
			showModal(type) {
				this.modals.construct.type = type
				this.modals.construct.show = true
			},
      async getProducts() {
        try {
        	const options = {
						id_org: this.$store.getters.getCity.default_id_org,
						order_type: 1,
						category: 'all'
					}
					const query = new URLSearchParams(options).toString()
          const {data} = await this.$axios.get(`/api/site/product/catalog?${query}`)
					this.loading = false
					this.catalog = data.data
        } catch (error) {
        	console.log(error)
        }
      },
			async getPoke() {
				try {
					const options = {
						id_org: this.$store.getters.getCity.default_id_org,
						order_type: 1,
						category: 'poke'
					}
					const query = new URLSearchParams(options).toString()
					const {data} = await this.$axios.get(`/api/site/product/catalog?${query}`)
					this.loading = false
					this.poke = data.data

				} catch (error) {
					console.log(error)
				}
			},
			async getSales() {
				try {
					const options = {
						id_org: this.$store.getters.getCity.default_id_org,
						order_type: 1,
						category: 'sales'
					}
					const query = new URLSearchParams(options).toString()
					const {data} = await this.$axios.get(`/api/site/product/catalog?${query}`)
					this.loading = false
					this.sales = data.data
				} catch (error) {
					console.log(error)
				}
			},
			category_title(title) {
				let category_title = '';
				switch (title) {
					case 'Поке':
						category_title = 'poke'
						break
					case 'Акции':
						category_title = 'sales'
						break
					case 'Напитки':
						category_title = 'drinks'
						break
					case 'Десерты':
						category_title = 'deserts'
						break
					default:
						category_title = title
						break
				}
				return category_title
			}
    }
  }
</script>

<style>
  .ymap-container {
    height: 100%;
    padding-top: 0;
  }
</style>
