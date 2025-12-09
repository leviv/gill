<script lang="ts">
	import DialogueScreen from './DialogueScreen.svelte';

	interface Props {
		onComplete: () => void;
	}

	let { onComplete }: Props = $props();

	const dialogues = [
		"Congratulations! You've amassed an impressive fortune of $1 billion through a combination of questionable journalism, endless fundraising, and corporate donations.",
		"You've mastered the art of modern politics: sensational headlines, Facebook ads, and leveraging your state representative position for maximum financial gain.",
		"Now it's time to retire to a beach somewhere, leaving behind a legacy of... well, let's call it 'creative fundraising.' Thanks for playing!"
	];
</script>

<DialogueScreen {dialogues} {onComplete} finalButtonText="Finish" />
