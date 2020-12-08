"use strict";

const simulate = new URLSearchParams(window.location.search).has('simulate');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const mstokmh = 18 / 5;
const unit = 10;
const slots = 2;

let kmh = 0;

function random() {
 kmh = Math.random() * 130;
}

function render() {
	const width  = canvas.width;
	const height = canvas.height;
	const size = width / slots;
	const speed = kmh;
	const position = speed / unit * size;
	const positionMin = position - width / 2;
	const positionMax = position + width / 2;
	const speedMin = Math.floor(positionMin / size) * unit;
	const speedMax = Math.ceil (positionMax / size) * unit;
	const font = size / 3;
	const baseline = height / 2;
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = 'white';	
	ctx.font = `bold ${font}px sans-serif`;
	ctx.textBaseline = 'middle';
	for (let speed = speedMin; speed <= speedMax; speed += unit) {
		const position = speed / unit * size - positionMin;
		ctx.fillText(`${speed}`, position, baseline);
	}
}

async function register() { 
	if ('serviceWorker' in navigator) { 
		await navigator.serviceWorker.register('serviceworker.js'); 
	}
}

function watch(position) {
	const ms = position.coords.speed;
	if (ms != null) {
		kmh = ms * mstokmh;
	}
}

if (simulate) {
	setInterval(random, 1000);
} else {
	window.addEventListener('load', register);
	navigator.geolocation.watchPosition(watch, null, { enableHighAccuracy: true });
}

setInterval(render, 1000);
