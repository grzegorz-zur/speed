"use strict";

const simulate = new URLSearchParams(window.location.search).has('simulate');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const mstokmh = 3600 / 1000;
const unit = 10;
const slots = 2;
const smoothing = 0.05;
const randomInterval = 3 * 1000;
const refreshInterval = 1000 / 16;
const ratio = 3;
const indicator = 6;

let speed = 0;
let prediction = 0;

function random() {
 speed = Math.random() * 130;
}

function smooth(speed, prediction) {
	return prediction + smoothing * (speed - prediction);	
}

function render(speed) {
	canvas.width		= document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	const width  = canvas.width;
	const height = canvas.height;
	const size = width / slots;
	const position = speed / unit * size;
	const positionMin = position - width / 2;
	const positionMax = position + width / 2;
	const speedMin = Math.floor(positionMin / size) * unit;
	const speedMax = Math.ceil (positionMax / size) * unit;
	const font = size / ratio;
	const baseline = height / 2 + font / 2;
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = 'white';	
	ctx.font = `bold ${font}px sans-serif`;
	ctx.textBaseline = 'bottom';
	for (let speed = speedMin; speed <= speedMax; speed += unit) {
		if (speed >= 0) {
			const text = `${speed}`;
			const textWidth = ctx.measureText(text).width;
			const position = speed / unit * size - positionMin - textWidth / 2;
			ctx.fillText(text, position, baseline);
		}
	}
	const center = width / 2;
	const left = center - height / indicator;
	const right = center + height / indicator;
	const top = height / indicator;
	const bottom = height - height / indicator;
	ctx.fill(new Path2D(`M ${left} 0 L ${center} ${top} L ${right} 0 Z`));
	ctx.fill(new Path2D(`M ${left} ${height} L ${center} ${bottom} L ${right} ${height} Z`));
}

function refresh() {
	prediction = smooth(speed, prediction);
	render(prediction);
}

async function register() { 
	if ('serviceWorker' in navigator) { 
		await navigator.serviceWorker.register('serviceworker.js'); 
	}
}

function watch(position) {
	const ms = position.coords.speed;
	if (ms != null) {
		speed = ms * mstokmh;
	}
}

if (simulate) {
	window.setInterval(random, randomInterval);
} else {
	window.addEventListener('load', register);
	navigator.geolocation.watchPosition(watch, null, { enableHighAccuracy: true });
}

window.setInterval(refresh, refreshInterval);
