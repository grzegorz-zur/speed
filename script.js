const debug = new URLSearchParams(window.location.search).has('debug');

async function register() { 
	if ('serviceWorker' in navigator) { 
		await navigator.serviceWorker.register('serviceworker.js'); 
	}
}

if (!debug) {
	window.addEventListener('load', register);
}

const meter = document.getElementById('meter');
const cells = document.getElementsByClassName('cell');
const duration = 1000;
	
function slide(speed) {
	const offset = -speed / 10 * 50;
	meter.animate(
		{ left: `${offset}vw`}, 
		{ 
			duration: duration, 
			fill: 'forwards',
			easing: 'ease'
		}
	);
}

function watch(position) {
	const speed = position.coords.speed;
	if (speed != null) {
		slide(speed * 1000 / 3600);
	}
}

function random() {
 const speed = Math.random() * 10 * (cells.length - 1);
	console.log(speed);
	slide(speed);
}

if (!debug) {
	const options = { enableHighAccuracy: true	};
	navigator.geolocation.watchPosition(watch, null, options);
} else {
	setInterval(random, 1000);
}
