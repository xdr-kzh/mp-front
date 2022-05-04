<template>
	<div class="page404">
		<div class="container">
			<div class="row align-items-center">
				<div class="col-12 col-md-5">
					<div class="page404-img">
						<img src="~assets/img/404.svg" class="img-responsive" alt="">
					</div>
				</div>
				<div class="col-12 col-md-7">
					<div class="page404-title">
						Страницы с таким <br>
						адресом не существует
					</div>
					<div class="page404-text">
						Возможно мы удалили эту страницу, <br>
						или вы перешли по неверному адресу
					</div>
					<div class="page404-btn">
						<nuxt-link :to="`/`" class="btn btn-large btn-colored">Вернуться на главную</nuxt-link>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['error'],
		layout: 'error' // you can set a custom layout for the error page
	}
</script>
