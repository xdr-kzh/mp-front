export default function ({ store, redirect, $cookies }) {
	let token = $cookies.get('token');
	if (!token) {
		return redirect('/')
	}
}
