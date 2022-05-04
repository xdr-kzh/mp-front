export default {
	methods: {
		getLocation(callback) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(callback, this.showError);
			}
		},
		showError(error) {
			switch(error.code) {
				case error.PERMISSION_DENIED:
					this.$toast.error("У сайта нет доступа к вашей геолокации")
					break
				case error.POSITION_UNAVAILABLE:
					this.$toast.error("Информация о местоположении недоступна")
					break
				case error.TIMEOUT:
					this.$toast.error("Время ожидания запроса истекло")
					break
				case error.UNKNOWN_ERROR:
					this.$toast.error("Что-то пошло не так")
					break
			}
		}
	}
}
