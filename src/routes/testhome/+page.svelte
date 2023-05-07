<script lang="ts">
  import movieIds from "$lib/5000movieids.json";
  import { onMount } from "svelte";
  import { fade } from 'svelte/transition';

  export let data;
  let items = [];
  let newListLink;

  if (data.user) {
    newListLink = 'playlist/' + data.user.id + '/new';
  }


  shuffleArray(movieIds);
  loadMore();

  // Add 20 items.
  async function loadMore() {

      for (let i = 0; i < movieIds.length; i++) {
          const url = "http://img.omdbapi.com/?i=" + movieIds[i].id + '&h=400' + '&apikey=5db6accd';
          const response = await fetch(url);
          items.push(response.url);
          items = items; //must be done for svelte reactivity
      }
      
  }



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

    {#if data.user}
      <li class="text-3xl "><a href={newListLink} class="text-3xl text-primary font-medium hover:cursor-pointer hover:underline">Create a list now</a></li>
    {:else}
      <li class="text-3xl "><a href="login/" class="text-3xl text-primary font-medium hover:cursor-pointer hover:underline">Create a list now</a></li>
    {/if}
  </ul>
</div>

<div class="container mx-auto px-5 py-2 lg:px-32 lg:pt-12" id="collage">
  <div class="-m-1 flex flex-wrap md:-m-2 justify-center">
      {#each items as item}


              <img alt="" src={item} loading="lazy" decoding="async" class="p-1 rounded-lg h-1/6" in:fade={{ duration: 500 }}/>


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




