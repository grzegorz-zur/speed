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
const unit = 10;
const width = 50;
const mstokmh = 18 / 5;
const grow = 1.5;
let duration = 2000;
let last = new Date();

function slide(speed) {
	const offset = -speed / unit * width;
	const now = new Date();
	duration = (duration + (now - last)) / 2;	
	last = now;	
	meter.animate(
		{ left: `${offset}vw`}, 
		{ 
			duration: duration * grow, 
			fill: 'forwards',
			easing: 'ease'
		}
	);
}

function watch(position) {
	const ms = position.coords.speed;
	if (ms != null) {
		const kmh = ms * mstokmh;
		slide(kmh);
	}
}

function random() {
 const speed = Math.random() * unit * (cells.length - 1);
	console.log(speed);
	slide(speed);
}

if (!debug) {
	const options = { enableHighAccuracy: true	};
	navigator.geolocation.watchPosition(watch, null, options);
} else {
	setInterval(random, 1000);
}
