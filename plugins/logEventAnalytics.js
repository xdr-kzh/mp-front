import Vue from 'vue'

const logEventMixin = {
	methods: {
		async logEvent (eventName, data = {}) {
			try {
				await this.$fire.analytics.logEvent(eventName, data)
			} catch (e) {
				console.error(e)
			}
		}
	}
}

if (!Vue.__analytics__) {
	Vue.__analytics_ = true
	Vue.mixin(logEventMixin)
}
