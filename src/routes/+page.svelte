<script lang="ts">
    import movieIds from "$lib/top250ids.json";
    import Lazy from "svelte-lazy"
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';

    let divElement;
    let movieIndex = 0;
    let items = [];

    shuffleArray(movieIds);
    loadMore();

    // Add 20 items.
    async function loadMore() {
        let stop = movieIndex + 10;
        for (let i = 0; movieIndex < stop; movieIndex++) {
            const url = "http://img.omdbapi.com/?i=" + movieIds[movieIndex].id + '&h=400' + '&apikey=5db6accd';
            const response = await fetch(url);
            const posterResponse = await fetch(response.url);
            if (posterResponse.status != 404) {
                items.push(response.url);
                items = items; //must be done for svelte reactivity
            
            }
        }
    }

    onMount(() => {
      if (divElement) {
        divElement.addEventListener("scroll", function () {
          if (
            divElement.scrollTop + divElement.clientHeight >=
            (divElement.scrollHeight) &&
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
</script>

<div bind:this={divElement} class="homebody">
  <h1 class="text-center text-7xl font-bold tracking-wide text-base-content mt-10">Flister</h1>
  <h3 class="text-center text-4xl tracking-light text-base-content mt-2"> The Film Lister</h3>

  <div class="my-12 mx-12">
    <ul class="list-disc">
      <li class="text-base-content text-3xl">Create lists of your favorite films, genres, series, etc.</li>
      <li class="text-base-content text-3xl">Rank lists in any order</li>
      <li class="text-base-content text-3xl">Share your lists or profile</li>
      <!-- ... -->
    </ul>
  </div>

  <div bind:this={divElement} class="container mx-auto px-5 py-2 lg:px-32 lg:pt-12" id="collage">
    <div class="-m-1 flex flex-wrap md:-m-2 justify-center">
        {#each items as item}

            <Lazy height={800} class="p-1 shrink">
                <img alt="" src={item} class="my-auto h-auto w-full rounded-lg" in:fade="{{ duration: 500 }}"/>
            </Lazy>

        {/each}
    </div>
  </div>
</div>
<style>
    .homebody {
          /* We need to limit the height and show a scrollbar */
          height: 800px;
          overflow: auto;

          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */


    }

    .homebody::-webkit-scrollbar {
        display: none;
    }
</style>


 

