<template>
	<section class="footer" v-if="$nuxt.$route.path === `/`">
		<div class="container" v-if="!isLoading">
			<div class="row">
				<div class="col-12">
					<div class="h1 text-center">следите за нами <br>в инстаграме</div>
					<div class="footer-text">
						<a :href="`${ organization.instagram }`" target="_blank">
							@{{ organization.instagram_tag }}
						</a>
					</div>
				</div>
			</div>
			<div class="row align-items-end">
				<div class="footer-left col-6 order-1 order-lg-1 col-md-6 col-lg-4">
					<a href="/rules" target="_blank">Правила оплаты</a>
				</div>
				<div class="footer-img col-12 order-3 order-lg-2 col-lg-4">
					<img v-if="organization.footer_img" v-lazy-load :data-src="organization.footer_img" class="img-responsive" alt="">
				</div>
				<div class="footer-right col-6 order-2 order-lg-3 col-md-6 col-lg-4">
					<a href="/policy" target="_blank">Политика конфиденциальности</a>
				</div>
			</div>
		</div>
	</section>

	<section class="footer" v-else>
		<div class="container" v-if="!isLoading">
			<div class="row align-items-end">
				<div class="footer-left col-6 order-1 order-lg-1 col-md-6 col-lg-4">
					<a href="/rules" target="_blank">Правила оплаты</a>
				</div>
				<div class="footer-insta col-12 order-3 order-lg-2 col-lg-4">
					<a :href="`${ organization.instagram}`" target="_blank">
						@{{ organization.instagram_tag }}
					</a>
				</div>
				<div class="footer-right col-6 order-2 order-lg-3 col-md-6 col-lg-4">
					<a href="/policy" target="_blank">Политика конфиденциальности</a>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	export default {
		name: 'Footer',
		props: {
			isLoading: {
				type: Boolean,
				required: false,
				default: false
			}
		},
		computed: {
			organization () {
				return this.$store.getters.getOrganization
			}
		},
	}
</script>
