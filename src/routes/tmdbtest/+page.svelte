<script lang="ts">

    let text = "";

    async function search() {
        const url = "https://api.themoviedb.org/3/search/movie?api_key=f0ed4d39fd60f596944755f0ace11282&query=" + encodeURI(text);
        const response = await fetch(url);
        const json = await response.json();
        console.log(json.results);

        //poster
        //https://image.tmdb.org/t/p/original/e9qcNtRSEgoYVrbns0pHInjuvyN.jpg?api_key=f0ed4d39fd60f596944755f0ace11282
    }
</script>

<button class="btn btn-primary" on:click={search}>Search</button>
<input type="text" bind:value={text}>