<template>
	<div>
		<div class="mt-5"></div>

		<div class="breadcrumb">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<ol class="breadcrumbs">
							<li><nuxt-link :to="`/`">Главная</nuxt-link></li>
							<li><span>Правила оплаты</span></li>
						</ol>
					</div>
				</div>
			</div>
		</div>

		<div class="textpage mt-5">
			<div class="container">
				<div class="row">
					<div class="col-12 col-xl-7">
						<h1 class="mb-4">Правила оплаты</h1>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="textpage-content">
							{{ $store.getters.getOrganization.rights_delivery }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "rules"
	}
</script>

<style scoped>
	.textpage-content {
		white-space: pre-line;
	}
</style>
