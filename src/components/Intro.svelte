<script lang="ts">
	import DialogueScreen from './DialogueScreen.svelte';

	interface Props {
		onComplete: () => void;
	}

	let { onComplete }: Props = $props();

	const dialogues = [
		"Welcome to the world of political fundraising! You're a fresh-faced candidate with big dreams and an empty war chest. Every click brings you closer to your campaign goals.",
		"But clicking alone won't win elections. You'll need to hire interns to keep the donations flowing, and eventually bring in professional lobbyists to really maximize your fundraising potential.",
		"Remember: in politics, it's not about the message—it's about the money. Now get out there and start clicking your way to the top!"
	];
</script>

<DialogueScreen {dialogues} {onComplete} finalButtonText="Play Game" />
