<script lang="ts">
    import movieIds from "$lib/top250ids.json";
    import Lazy from "svelte-lazy"
    import { onMount } from "svelte";

	let divElement;
    let movieIndex = 0;
	let items = [];

    shuffleArray(movieIds);
    loadMore();


	// Add 20 items.
	async function loadMore() {
        let stop = movieIndex + 10;
		for (let i = 0; movieIndex < stop; movieIndex++) {
            const url = "http://img.omdbapi.com/?i=" + movieIds[movieIndex].id + '&h=500' + '&apikey=5db6accd';
            try {
                const response = await fetch(url);
                items.push(response.url);
                items = items; //must be done for svelte reactivity
            } catch(err) {
                console.log(err);
            }
            
		}
	}

	onMount(() => {
		if (divElement) {
			console.log("listElm is defined");
			divElement.addEventListener("scroll", function () {
				if (
					divElement.scrollTop + divElement.clientHeight >=
					divElement.scrollHeight &&
                    movieIndex < 250

				) {
					loadMore();
				}
			});
		}
	});



    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    function printItems() {
        console.log(items);
    }



    //Imdb top 250
    //https://raw.githubusercontent.com/theapache64/top250/master/top250.json

    //get all imdb ids from list (tt....)
    //write to json file

    //infinite loading component
    //https://github.com/skayo/svelte-infinite-loading
</script>

<button on:click={printItems}>print items</button>



<div bind:this={divElement} class="container mx-auto px-5 py-2 lg:px-32 lg:pt-12" id="collage">
    <div class="-m-1 flex flex-wrap md:-m-2">
        {#each items as item}

            <Lazy height=200 fadeOption={{delay: 100, duration: 5000}} class="flex flex-wrap p-1">
                <img alt="" src={item} class="block h-full w-full rounded-lg object-cover object-center"/>
            </Lazy>

        {/each}
    </div>
</div>

<style>
    	#collage{
		/* We need to limit the height and show a scrollbar */
		height: 800px;
		overflow: auto;

		/* Optional, only to check that it works with margin/padding */
		margin: 30px;
		padding: 20px;
		border: 10px solid black;
	}
</style>