<script lang="ts">
	import type { Snippet } from 'svelte';
	import { spring } from 'svelte/motion';
	import MoneyPopup from './MoneyPopup.svelte';

	interface Props {
		onclick?: () => void;
		children?: Snippet;
		clickValue?: number;
	}

	let { onclick, clickValue = 1 }: Props = $props();

	// Random hover rotation
	let hoverRotation = $state((Math.random() - 0.5) * 8); // Random between -4 and +4

	// Spring animations for natural, bouncy motion
	const topRotation = spring(0, { stiffness: 0.3, damping: 0.4 });
	const topY = spring(0, { stiffness: 0.3, damping: 0.4 });
	const topScale = spring(1, { stiffness: 0.3, damping: 0.4 });
	const bottomShake = spring(0, { stiffness: 0.5, damping: 0.3 });
	const bottomRotation = spring(0, { stiffness: 0.5, damping: 0.3 });

	let isAnimating = false;

	// Blah bubble state
	interface BlahBubble {
		id: number;
		x: number;
		y: number;
		rotation: number;
	}

	let blahBubbles = $state<BlahBubble[]>([]);
	let blahIdCounter = 0;

	// Money popup state
	interface MoneyPopupData {
		id: number;
		x: number;
		y: number;
		value: number;
	}

	let moneyPopups = $state<MoneyPopupData[]>([]);
	let moneyIdCounter = 0;

	// Exposed animation method that can be called externally
	export function animate(speak: boolean = true) {
		// Random rotation between -8 and 8 degrees
		const randomRotation = (Math.random() - 0.5) * 16;
		const randomBottomRotation = (Math.random() - 0.5) * 4; // Small rotation for bottom

		// Generate new random hover rotation for next hover
		hoverRotation = (Math.random() - 0.5) * 8;

		// Lift top up, rotate, and scale up
		topRotation.set(randomRotation);
		topY.set(-20);
		topScale.set(1.1);

		// Create a new "blah" bubble
		if (speak) {
			createBlahBubble();
			// Play click sound
			const audio = new Audio('click.mp3');
			audio.play();
		}

		// Slam down after a short delay
		setTimeout(() => {
			topRotation.set(0);
			topY.set(0);
			topScale.set(1);

			// Shake both parts on impact with rotation
			bottomShake.set(3);
			bottomRotation.set(randomBottomRotation);
			setTimeout(() => {
				bottomShake.set(-2);
				bottomRotation.set(-randomBottomRotation * 0.5);
				setTimeout(() => {
					bottomShake.set(0);
					bottomRotation.set(0);
				}, 100);
			}, 100);
		}, 150);
	}

	function handleClick(event: MouseEvent) {
		animate();

		// Create money popup at click location
		const button = event.currentTarget as HTMLElement;
		const rect = button.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		createMoneyPopup(x, y);

		onclick?.();
	}

	function createBlahBubble() {
		const id = blahIdCounter++;
		const bubble: BlahBubble = {
			id,
			x: 0,
			y: 0,
			rotation: 0
		};

		blahBubbles = [...blahBubbles, bubble];

		// Animate the bubble
		animateBlahBubble(id);
	}

	function animateBlahBubble(id: number) {
		const duration = 6000; // 6 seconds to drift off screen (3x slower)
		const startTime = Date.now();
		const startX = 20; // Start immediately to the right
		const endX = window.innerWidth; // Drift off to the right edge of screen
		const startYOffset = -50 + (Math.random() - 0.5) * 100; // Start 50px higher with ±25px random variation

		// Random bobbing parameters
		const bobAmplitude = 15 + Math.random() * 20;
		const bobFrequency = 2 + Math.random() * 3;

		function animate() {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			const bubbleIndex = blahBubbles.findIndex((b) => b.id === id);
			if (bubbleIndex === -1) return;

			// Linear movement for immediate drift
			const x = startX + (endX - startX) * progress;
			const y = startYOffset + Math.sin(progress * Math.PI * bobFrequency) * bobAmplitude;
			const rotation = Math.sin(progress * Math.PI * bobFrequency * 1.5) * 10;

			// Update bubble
			blahBubbles[bubbleIndex] = {
				...blahBubbles[bubbleIndex],
				x,
				y,
				rotation
			};
			blahBubbles = [...blahBubbles]; // Trigger reactivity

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				// Remove bubble after animation
				blahBubbles = blahBubbles.filter((b) => b.id !== id);
			}
		}

		requestAnimationFrame(animate);
	}

	function createMoneyPopup(x: number, y: number) {
		const id = moneyIdCounter++;
		const popup: MoneyPopup = {
			id,
			x,
			y,
			value: clickValue
		};

		moneyPopups = [...moneyPopups, popup];

		// Remove after animation completes
		setTimeout(() => {
			moneyPopups = moneyPopups.filter((p) => p.id !== id);
		}, 800);
	}
</script>

<button onclick={handleClick} style="--hover-rotation: {hoverRotation}deg;">
	<div class="button-container">
		<img
			src="headshot_top.png"
			alt="Brandon Gill Headshot"
			class="top"
			style="transform: translateY({$topY}px) rotate({$topRotation}deg) scale({$topScale});"
		/>

		<!-- Blah bubbles -->
		<div class="blah-container">
			{#each blahBubbles as bubble (bubble.id)}
				<div
					class="blah-wrapper"
					style="transform: translate({bubble.x}px, {bubble.y}px) rotate({bubble.rotation}deg);"
				>
					<div class="blah">blah</div>
				</div>
			{/each}
		</div>

		<!-- Money popups -->
		<div class="money-popup-container">
			{#each moneyPopups as popup (popup.id)}
				<MoneyPopup amount={popup.value} x={popup.x} y={popup.y} />
			{/each}
		</div>

		<img
			src="headshot_bottom.png"
			alt="Brandon Gill Headshot"
			class="bottom"
			style="transform: translateX({$bottomShake}px) rotate({$bottomRotation}deg);"
		/>
	</div>
</button>

<style>
	button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		position: relative;
		overflow: visible;
		transition: transform 0.1s ease;
		pointer-events: auto;
	}

	button:hover {
		transform: scale(1.1) rotate(var(--hover-rotation));
	}

	.button-container {
		display: flex;
		flex-direction: column;
		width: 300px;
		position: relative;
		filter: drop-shadow(5px 5px 10px #000000);
	}

	.button-container img {
		width: 100%;
		object-fit: cover;
		display: block;
		user-select: none;
		-webkit-user-drag: none;
		pointer-events: none;
	}

	.top {
		transform-origin: bottom center;
		z-index: 2;
		position: relative;
	}

	.bottom {
		z-index: 1;
		position: relative;
	}

	.blah-container {
		position: absolute;
		top: 50%;
		left: 100%;
		transform: translateY(-50%);
		z-index: 3;
		pointer-events: none;
		width: 0;
		height: 0;
	}

	.blah-wrapper {
		position: absolute;
		left: 0;
		top: 0;
	}

	.blah {
		font-family: 'Bangers', cursive;
		font-size: 42px;
		font-weight: 400;
		color: transparent;
		white-space: nowrap;
		-webkit-text-stroke: 3px;
		-webkit-text-stroke-image: linear-gradient(to bottom, #b22234, #ffffff, #3c3b6e);
		text-stroke: 3px;
		text-stroke-image: linear-gradient(to bottom, #b22234, #ffffff, #3c3b6e);
		animation: shake 0.1s infinite;
		/* Fallback for browsers that don't support text-stroke-image */
		-webkit-text-stroke-color: #b22234;
		background: linear-gradient(to bottom, #b22234, #ffffff, #3c3b6e);
		-webkit-background-clip: text;
		background-clip: text;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(1px, 1px);
		}
		50% {
			transform: translate(-1px, 0px);
		}
		75% {
			transform: translate(0px, -1px);
		}
	}

	.money-popup-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 10;
	}
</style>
