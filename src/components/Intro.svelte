<script lang="ts">
	import Button from './Button.svelte';

	interface Props {
		onComplete: () => void;
	}

	let { onComplete }: Props = $props();

	const dialogues = [
		"Welcome to the world of political fundraising! You're a fresh-faced candidate with big dreams and an empty war chest. Every click brings you closer to your campaign goals.",
		"But clicking alone won't win elections. You'll need to hire interns to keep the donations flowing, and eventually bring in professional lobbyists to really maximize your fundraising potential.",
		"Remember: in politics, it's not about the message—it's about the money. Now get out there and start clicking your way to the top!"
	];

	let currentDialogueIndex = $state(0);
	let displayedText = $state('');
	let isAnimating = $state(false);
	let showContinueButton = $state(false);
	let buttonComponent: any;
	let textInterval: any;
	let clickInterval: any;

	// Start the first dialogue when component mounts
	$effect(() => {
		if (currentDialogueIndex === 0 && displayedText === '') {
			startDialogue();
		}
	});

	function startDialogue() {
		// Clear any existing intervals
		if (textInterval) clearInterval(textInterval);
		if (clickInterval) clearInterval(clickInterval);

		isAnimating = true;
		showContinueButton = false;
		displayedText = '';

		const text = dialogues[currentDialogueIndex];
		let charIndex = 0;

		// Animate button 4 times per second while text is revealing
		clickInterval = setInterval(() => {
			if (buttonComponent?.animate) {
				buttonComponent.animate(false);
			}
		}, 250);

		textInterval = setInterval(() => {
			if (charIndex < text.length) {
				displayedText += text[charIndex];
				charIndex++;
			} else {
				clearInterval(textInterval);
				clearInterval(clickInterval);
				isAnimating = false;
				showContinueButton = true;
			}
		}, 15);
	}

	function handleContinue() {
		if (currentDialogueIndex < dialogues.length - 1) {
			currentDialogueIndex++;
			startDialogue();
		} else {
			onComplete();
		}
	}
</script>

<div class="intro-overlay">
	<div class="intro-container">
		<div class="button-display">
			<Button bind:this={buttonComponent} onclick={() => {}} />
		</div>

		<div class="dialogue-box">
			<p class="dialogue-text">{displayedText}<span class="cursor">|</span></p>

			{#if showContinueButton}
				<button class="continue-button" onclick={handleContinue}>
					{currentDialogueIndex < dialogues.length - 1 ? 'Continue' : 'Play Game'}
				</button>
			{/if}
		</div>

		<div class="progress-indicator">
			{#each dialogues as _, index}
				<span
					class="dot"
					class:active={index === currentDialogueIndex}
					class:completed={index < currentDialogueIndex}
				></span>
			{/each}
		</div>
	</div>
</div>

<style>
	.intro-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: repeating-linear-gradient(
			45deg,
			#b22234 0px,
			#b22234 40px,
			#ffffff 40px,
			#ffffff 80px,
			#3c3b6e 80px,
			#3c3b6e 120px
		);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.intro-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px;
		max-width: 800px;
		padding: 40px;
	}

	.button-display {
		transform: scale(1.2);
		transition: transform 0.1s;
	}

	.dialogue-box {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 12px;
		padding: 30px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		min-height: 150px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
	}

	.dialogue-text {
		font-size: 20px;
		line-height: 1.6;
		color: #333;
		margin: 0;
		text-align: center;
	}

	.cursor {
		animation: blink 1s infinite;
		color: #2a5298;
		font-weight: bold;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}

	.continue-button {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		padding: 12px 32px;
		font-size: 18px;
		font-weight: bold;
		border-radius: 25px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
	}

	.continue-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
	}

	.continue-button:active {
		transform: translateY(0);
	}

	.progress-indicator {
		display: flex;
		gap: 12px;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		transition: all 0.3s ease;
	}

	.dot.active {
		background: white;
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
	}

	.dot.completed {
		background: rgba(255, 255, 255, 0.6);
	}
</style>
