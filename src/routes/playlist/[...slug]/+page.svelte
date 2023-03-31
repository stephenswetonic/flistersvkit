<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { pb } from '$lib/pocketbase';
    import type { PageData } from './$types';
    import {flip} from 'svelte/animate';
    import {fly} from 'svelte/transition';
    import AutoComplete from "simple-svelte-autocomplete"

    let playlistName : string;
    let hovering : any = false;
    let movieList = [];
    let moviesToDelete = [];
    let selectedMovie;
  
    let draggable = false;
    let editing = false;
    let creating = false;
    let viewing = false;

    export let data: PageData;
    const slugArr = $page.params.slug.split('/');
    let playlistId = slugArr[1];

    async function addPlaylist() {
        const response = await fetch('/playlist/add', {
        method: 'POST',
        body: JSON.stringify({ movieList, playlistName, creating, playlistId }),
        headers: {
          'content-type': 'application/json'
        }
      });

      playlistId = await response.json();
      creating = false
      editing = false;
      draggable = false;
      viewing = true;
      changeIsNewState();

      deleteMovies();
        
    }
  
    // Sets ui movielist to reflect db state
    function changeIsNewState() {
      for (var i = 0; i < movieList.length; i++) {
        movieList[i].isNew = false;
      }
    }

    // Routing
    function routeToPage(route: string, replaceState: boolean) {
      goto(`/${route}`, { replaceState }) 
    }

    function goBack() {
        routeToPage(`profile/${data.user.id}`, false)
    }
  
    // Drag and drop
    const drop = (event, target) => {
      event.dataTransfer.dropEffect = 'move'; 
      const start = parseInt(event.dataTransfer.getData("text/plain"));
      const newTracklist = movieList
  
      if (start < target) {
      newTracklist.splice(target + 1, 0, newTracklist[start]);
      newTracklist.splice(start, 1);
      } else {
      newTracklist.splice(target, 0, newTracklist[start]);
      newTracklist.splice(start + 1, 1);
      }
      movieList = newTracklist
      hovering = null
    }
  
    // Drag and drop
    const dragstart = (event, i) => {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.dropEffect = 'move';
      const start = i;
      event.dataTransfer.setData('text/plain', start);
    }
  
    // Adds movie from search box to ui
    async function addMovieToList() {
      // Getting high res poster
      const url = "http://img.omdbapi.com/?i=" + selectedMovie.imdbID + '&h=2000' + '&apikey=5db6accd';
      const response = await fetch(url);
  
      // Adding to playlist ui. In creating or editing mode,
      // isNew is true so the record is created.
      movieList.push({"recordid" : "","title" : selectedMovie.Title, "id" : movieList.length, "img": response.url, "imdbid" : selectedMovie.imdbID, "isNew" : true});
      hovering = movieList.length;
  
    }
  
    // Edit button clicked
    function startEditing() {
      editing = true;
      draggable = true;
      viewing = false;
      creating = false;
      playlistName = data.playlist.name;
    }
  
    // Cancel button clicked
    function cancelEdit() {
      creating = false
      editing = false;
      draggable = false;
      viewing = true;
      playlistName = data.playlist.name;
      movieList = [];
      addMoviesToList();
    }
  
    // Removes a movie from the ui and deletes the record,
    // if it exists
    function removeMovieFromList(movieIndex) {
      // Templist is for new ui list
      let tempList = []
      for (var i = 0; i < movieList.length; i++) {
  
        if (i == movieIndex) {
          // Only delete if record exists
          if (!movieList[i].isNew) {
            moviesToDelete.push(movieList[i]);
          }
        } else {
          // Add all except one to delete
          tempList.push(movieList[i])
        }
      }
      movieList = tempList;
      hovering = movieList.length;
    }

    async function deleteMovies() {
      const response = await fetch('/playlist/remove', {
        method: 'DELETE',
        body: JSON.stringify({ moviesToDelete, playlistId }),
        headers: {
          'content-type': 'application/json'
        }
      });

      await response.json();

    }
  
    // Gets search suggestions from OMDB
    async function getSearchItems(keyword) {
        const url = "http://www.omdbapi.com/?s=" + encodeURI(keyword) + '&apikey=5db6accd';
        const response = await fetch(url)
        const json = await response.json()

        return json.Search

    }
  
    // Adds movies from a playlist to the ui
    async function addMoviesToList() {
      for (var i = 0; i < data.movies.length; i++) {
        movieList.push({"recordid" : data.movies[i].id, "title" : data.movies[i].title, "id" : data.movies[i].rank-1, "img": data.movies[i].poster, "imdbid" : data.movies[i].imdbid, "isNew" : false})
      }
      hovering = movieList.length;
    };
  
    // If loading a playlist that already exists, 
    // fill the ui with that data. Otherwise start in 
    // create mode.
    if (data.movies.length > 0) {
        addMoviesToList();
        playlistName = data.playlist.name;
        viewing = true;
    } else {
        creating = true;
        draggable = true;
    }
</script>
  
<section class="text-gray-400 body-font bg-gray-900">
  
  {#if viewing}
    <div class="flex justify-center py-6">
      <p class="bg-gray-900 text-gray-400 bg-opacity-20 text-5xl text-center outline-none py-5 px-3 leading-8">{playlistName}</p>
    </div>
  {/if}
  
  {#if creating || editing}
    <form on:submit|preventDefault class="flex justify-center py-6">
      <input
        placeholder="Playlist Name"
        type="text"
        bind:value={playlistName}
        class="bg-gray-900 bg-opacity-20 w-full text-5xl text-center focus:ring-2 focus:border-blue-900 hover:border-gray-700 border-transparent border-2 outline-none text-gray-400 py-1 px-3 leading-8"
      />
      <!-- Go to playlist builder screen -->
    </form> 
  
  <div class="autocomplete-wrapper flex justify-center">
    <AutoComplete
      searchFunction="{getSearchItems}"
      delay="0"
      localFiltering={false}
      showLoadingIndicator={true}
      matchAllKeywords={false}
      labelFieldName="Title"
      valueFieldName="imdbID"
      bind:selectedItem="{selectedMovie}"
      placeholder="Search Movies..."
      class="w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500 hover:ring-blue-500 hover:border-blue-500 "
      >
  
    <div slot="item" let:item={item} let:label={label} class="flex flex-row">
        <img src="{item.Poster}" alt="thumbnail" style="max-width: 100px; height: auto;">
        <div class="text-white pl-6 text-lg font-medium">{@html label}</div>
    </div>
  
    </AutoComplete>
  
    
  <button type="submit" on:click={addMovieToList} class="text-white m-2 focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
  </div>
  {/if}
  </section>

<div class="absolute">
  <div class="flex flex-wrap -m-4">
    <div class="flex flex-col">
      {#if editing}
        <button class="bg-gray-800 border-0 py-1 px-3 my-5 mx-5 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0" on:click={addPlaylist}>Save</button>
        <button class="bg-gray-800 border-0 py-1 px-3 my-5 mx-5 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0" on:click={cancelEdit}>Cancel</button>
      {/if}

      {#if creating}
        <button class="bg-gray-800 border-0 py-1 px-3 my-5 mx-5 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0" on:click={addPlaylist}>Create</button>

      {/if}

      {#if viewing && data.user}
        <button class="bg-gray-800 border-0 py-1 px-3 my-5 mx-5 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0" on:click={startEditing}>Edit</button>
      {/if}
        <button class="bg-gray-800 border-0 py-1 px-3 my-5 mx-5 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0" on:click={goBack}>Back</button>
    </div>
  </div>
</div>

  <section class="text-gray-400 bg-gray-900">
    <div class="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
  
      

      <div class="-m-1 flex flex-wrap md:-m-2">
        {#each movieList as n, index  (n.id)}
          <div
            id="list-item"
            class="flex w-1/6 flex-wrap" 
            animate:flip="{{duration: 500}}"
            draggable={draggable} 
            on:dragstart={event => dragstart(event, index)}
            on:drop|preventDefault={event => drop(event, index)}
            ondragover="return false"
            on:dragenter={() => hovering = index}
            class:is-active={hovering === index}
            out:fly={{x : -500, duration : 500}}
            in:fly={{x : 500, duration : 500}}
            >

            <div class="w-full p-1 md:p-2">
              <img src="{n.img}" 
                alt="thumb" 
                draggable={false}
                class="block h-full w-full rounded-lg object-cover object-center"
                >
            </div>

            {#if editing || creating}
              <a href="#" on:click={() => removeMovieFromList(index)}>
                  <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#ff0000"/></svg>
              </a>
            {/if}
              <p class="font-bold text-md"> {n.title}	{index+1}</p>
            
          </div>
        {/each}
      </div>
    </div>

</section>

  
  <style>
    #list-item.is-active {
      background-color: #3273dc;
      color: #fff;
    }
  
    .autocomplete-wrapper :global(.autocomplete) {
      width: 500px;

    }
  
    .autocomplete-wrapper :global(.autocomplete-list) {
      max-height: 500px;
      --tw-bg-opacity: 1;
      background-color: rgb(31 41 55 / var(--tw-bg-opacity));
    }
  
    .autocomplete-wrapper :global(.autocomplete-list-item) {
      --tw-bg-opacity: 1;
      background-color: rgb(31 41 55 / var(--tw-bg-opacity));
      padding-top: 10px !important;
    }
  
    .autocomplete-wrapper :global(.autocomplete-list-item.selected) {
      --tw-bg-opacity: 1 !important;
      background-color: rgb(55 65 81 / var(--tw-bg-opacity)) !important;
    }
  </style>
