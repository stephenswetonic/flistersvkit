<script lang="ts">
    import MovieCard from "$lib/components/MovieCard.svelte";
    let showCard = false;
</script>

<button on:click={() => (showCard = true)}>
	show modal
</button>

<MovieCard bind:showCard id={157336} poster_path='https://image.tmdb.org/t/p/original//gEU2QniE6E77NI6lCU6MxlNBvIx.jpg?api_key=f0ed4d39fd60f596944755f0ace11282'>

</MovieCard>