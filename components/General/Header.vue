<template>
	<header class="top">
		<div class="container">
			<div class="row no-gutters align-items-center">

				<div class="top-logo col">
					<div class="wrap">
						<a href="/">
							<img src="~assets/img/logo.svg" alt="">
							<div>Ресторан гавайской кухни в {{ $store.getters.getCity.title_logo }}</div>
						</a>
					</div>
				</div>

				<div class="top-city col">
					<div class="wrap">
						<div class="address-text" :title="getStoreAddress" v-if="getStoreAddress">
							{{ getStoreAddress }}
							<div>
								<span @click="$emit('openModalAddress')">Сменить</span>
							</div>
						</div>

						<div class="address-text text-center" v-else>
							<div>
								<span @click="$emit('openModalAddress')">Указать адрес</span>
							</div>
						</div>
					</div>
				</div>

				<div :class="`top-nav col ${isShowNav ? 'active' : ''}`">
					<div class="wrap">
						<div @click="closeNav" class="top-nav-close d-block d-xl-none">&times;</div>
						<ul>
							<li @click="closeNav"><nuxt-link :to="`/#poke`">Поке</nuxt-link></li>
							<li @click="closeNav"><nuxt-link :to="`/#deserts`">Десерты</nuxt-link></li>
							<li @click="closeNav"><nuxt-link :to="`/#drinks`">Напитки</nuxt-link></li>
							<li @click="closeNav"><nuxt-link :to="`/#gift`">Собрать поке</nuxt-link></li>
						</ul>
					</div>
				</div>

				<div class="top-phone col">
					<div class="wrap" v-if="$store.getters.getCity">
						<a :href="`tel:${$store.getters.getCity.organization.phone}`">
							{{ $store.getters.getCity.organization.phone }}
						</a>
					</div>
				</div>

				<div class="top-acc col">
					<div class="wrap" v-if="!$store.getters.getToken">
						<div @click="modals.login.show = true">
							<i class="icon-user"></i>
							<span>Войти</span>
						</div>
					</div>
					<div class="wrap" v-else>
						<nuxt-link :to="`/account/orders`">
							<i class="icon-user"></i>
							<span>Профиль</span>
						</nuxt-link>
					</div>
				</div>

				<div class="top-cart col">
					<div class="wrap">
						<a href="/cart" class="btn btn-cart">
							<div v-if="cart.products.length === 0">
								<img class="svg" alt="" src="~assets/img/cart.svg">
							</div>
							<div v-else>
								{{ cart.total_count }}
							</div>
							<span>Корзина</span>
						</a>
						<div class="top-cart-menu" @click="showNav">
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
				</div>

			</div>
		</div>
	</header>
</template>

<script>
	import AddressInput from "../AddressInput";

	export default {
		name: 'Header',
		components: {
			AddressInput
		},
		props: {
			modals: {
				type: Object,
				required: true
			},
			cities: {
				type: Array,
				required: true
			},
			cart: {
				type: Object,
				required: true
			}
		},
		data: () => ({
			isShowNav: false,
			address: ''
		}),
		computed: {
			addressData () {
				return this.$store.getters.getAddressData
			},
			getStoreAddress () {
				const address = this.$store.getters.getAddressData
				console.log('address', address)
				if (address && address?.city && address?.street && address?.house_num) {
					return `${address.city ?? ''}, ${address.street ?? ''} ${address.house_num ?? ''}`
				}
			}
		},
		methods: {
			closeNav () {
				this.isShowNav = false
			},
			showNav () {
				this.isShowNav = true
			}
		}
	}
</script>

<style scoped lang="scss">
	.address-text {
		color: #fff;
		max-width: 100%;
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		span {
			cursor: pointer;
			border-bottom: 1px dashed gray;
			color: #fff;
			font-size: 12px;
			display: inline-block;

			&:hover {
				border-color: #fff;
			}
		}
	}
</style>
