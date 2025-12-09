<script lang="ts">
	import Button from './Button.svelte';

	interface Props {
		onComplete: () => void;
	}

	let { onComplete }: Props = $props();

	const dialogues = [
		"Congratulations! You've amassed an impressive fortune of $1 billion through a combination of questionable journalism, endless fundraising, and corporate donations.",
		"You've mastered the art of modern politics: sensational headlines, Facebook ads, and leveraging your state representative position for maximum financial gain.",
		"Now it's time to retire to a beach somewhere, leaving behind a legacy of... well, let's call it 'creative fundraising.' Thanks for playing!"
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
		}, 30);
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

<div class="outro-overlay">
	<div class="outro-content">
		<div class="button-container">
			<Button bind:this={buttonComponent} clickValue={1} />
		</div>

		<div class="dialogue-box">
			<p class="dialogue-text">
				{displayedText}<span class="cursor" class:blinking={!isAnimating}>|</span>
			</p>

			{#if showContinueButton}
				<button class="continue-button" onclick={handleContinue}>
					{currentDialogueIndex < dialogues.length - 1 ? 'Continue' : 'Finish'}
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.outro-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: repeating-linear-gradient(
			45deg,
			#dc143c,
			#dc143c 20px,
			#ffffff 20px,
			#ffffff 40px,
			#0000cd 40px,
			#0000cd 60px
		);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.outro-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px;
		max-width: 800px;
		padding: 40px;
	}

	.button-container {
		filter: drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.5));
	}

	.dialogue-box {
		background: rgba(255, 255, 255, 0.95);
		border: 4px solid #000;
		border-radius: 12px;
		padding: 30px;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
		min-height: 150px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.dialogue-text {
		font-family: 'Georgia', serif;
		font-size: 20px;
		line-height: 1.6;
		color: #333;
		margin: 0;
	}

	.cursor {
		opacity: 0;
		margin-left: 2px;
	}

	.cursor.blinking {
		animation: blink 1s infinite;
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
		background: linear-gradient(135deg, #3c3b6e 0%, #1e1e50 100%);
		color: white;
		border: 3px solid #b22234;
		border-radius: 8px;
		padding: 12px 30px;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s;
		margin-top: 20px;
		align-self: center;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.continue-button:hover {
		transform: scale(1.05);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
	}

	.continue-button:active {
		transform: scale(0.98);
	}
</style>
