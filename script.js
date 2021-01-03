"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mstokmh = 3600 / 1000;
const unit = 10;
const slots = 2;
const smoothing = 0.065;
const interval = 1000 / 16;
const ratio = 2.6;
const indicator = 10;

let speed = 0;
let prediction = 0;

function smooth(speed, prediction) {
	return prediction + smoothing * (speed - prediction);
}

function hue(speed) {
	if (speed < 40)  return 100;
	if (speed < 60)  return 75;
	if (speed < 100) return 50;
	if (speed < 140) return 25;
	return 0;
}

function renderHorizontal(speed, width, height) {
	const size = width / slots;
	const position = speed / unit * size;
	const positionMin = position - width / 2;
	const positionMax = position + width / 2;
	const speedMin = Math.floor(positionMin / size) * unit;
	const speedMax = Math.ceil (positionMax / size) * unit;
	const font = size / ratio;
	const baseline = height / 2 + font / 2;
	ctx.fillStyle = "hsl(0, 0%, 0%)";
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = "hsl(0, 0%, 100%)";
	ctx.font = `bold ${font}px sans-serif`;
	ctx.textBaseline = "bottom";
	for (let speed = speedMin; speed <= speedMax; speed += unit) {
		if (speed >= 0) {
			const text = `${speed}`;
			const textWidth = ctx.measureText(text).width;
			const position = speed / unit * size - positionMin - textWidth / 2;
			const color = hue(speed);
			ctx.fillStyle = `hsl(${color}, 100%, 50%)`;
			ctx.fillText(text, position, baseline);
		}
	}
	const center = width / 2;
	const left = center - height / indicator;
	const right = center + height / indicator;
	const top = height / indicator;
	const bottom = height - height / indicator;
	ctx.fillStyle = "hsl(0, 0%, 75%)";
	ctx.fill(new Path2D(`M ${left} 0 L ${center} ${top} L ${right} 0 Z`));
	ctx.fill(new Path2D(`M ${left} ${height} L ${center} ${bottom} L ${right} ${height} Z`));
}

function renderVertical(speed, width, height) {
	const size = height / slots;
	const position = speed / unit * size;
	const positionMin = position - height / 2;
	const positionMax = position + height / 2;
	const speedMin = Math.floor(positionMin / size) * unit;
	const speedMax = Math.ceil (positionMax / size) * unit;
	const font = size / ratio;
	ctx.fillStyle = "hsl(0, 0%, 0%)";
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = "hsl(0, 0%, 100%)";
	ctx.font = `bold ${font}px sans-serif`;
	ctx.textBaseline = "middle";
	for (let speed = speedMin; speed <= speedMax; speed += unit) {
		if (speed >= 0) {
			const text = `${speed}`;
			const textWidth = ctx.measureText(text).width;
			const position = positionMax - speed / unit * size;
			const offset = width / 2 - textWidth / 2;
			const color = hue(speed);
			ctx.fillStyle = `hsl(${color}, 100%, 50%)`;
			ctx.fillText(text, offset, position);
		}
	}
	const center = height / 2;
	const left = width / indicator;
	const right = width - width / indicator;
	const top = center - height / indicator;
	const bottom = center + height / indicator;
	ctx.fillStyle = "hsl(0, 0%, 75%)";
	ctx.fill(new Path2D(`M 0 ${top} L ${left} ${center} L 0 ${bottom} Z`));
	ctx.fill(new Path2D(`M ${width} ${top} L ${right} ${center} L ${width} ${bottom} Z`));
}

function render(speed) {
	canvas.width  = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	const width  = canvas.width;
	const height = canvas.height;
	if (width >= height) {
		renderHorizontal(speed, width, height);
	} else {
		renderVertical(speed, width, height);
	}
}

function refresh() {
	prediction = smooth(speed, prediction);
	render(prediction);
}

function watch(position) {
	const ms = position.coords.speed;
	if (ms != null) {
		speed = ms * mstokmh;
	}
}

navigator.geolocation.watchPosition(watch, null, { enableHighAccuracy: true });
window.setInterval(refresh, interval);
window.addEventListener("load", async () => {
	await navigator.serviceWorker.register("serviceworker.js");
}); 

try {
	navigator.wakeLock.request("screen");
} catch (error) {
	console.log(error);
}

function random() {
 speed = Math.random() * 130;
}

const simulate = new URLSearchParams(window.location.search).has("simulate");
if (simulate) {
	window.setInterval(random, 3 * 1000);
}
