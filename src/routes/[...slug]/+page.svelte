<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { currentUser, pb } from '$lib/pocketbase';
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
    //export let leavePlaylist = () => {} 

    export let data: PageData;
    const slugArr = $page.params.slug.split('/');

    // Creates or updates a playlist record
    async function submitPlaylist() {
      try {
        const record = {
            "name": playlistName,
            "user": $currentUser.id
        };
        if (creating) {
          console.log("playlist created")
          const createdPlaylist = await pb.collection('playlists').create(record);
          createMovies(createdPlaylist.id);
        } else {
          console.log(data.playlist);    
          const updatedPlaylist = await pb.collection('playlists').update(data.playlist.id, record);
          createMovies(data.playlist.id);
        }
  
      } catch(err) {
          console.log(err);
      }
  
  
    };
  
    // Creates movie records, either updating or 
    // creating them.
    async function createMovies(playlistId) {
      for (var i = 0; i < movieList.length; i++) {
        const record = {
          "title": movieList[i].title,
          "rank": i+1,
          "playlist": playlistId,
          "imdbid": movieList[i].imdbid,
          "poster": movieList[i].img
        };
        if (movieList[i].isNew) {
          const createdMovie = await pb.collection('movies').create(record);
          movieList[i].recordid = createdMovie.id;
          console.log(record);
        } else {
          console.log('updated record')
          console.log(movieList[i].recordid);
          const createdMovie = await pb.collection('movies').update(movieList[i].recordid, record);
        }
        routeToPage(`${data.user.id}/${playlistId}`, true);
        
  
      }
      creating = false
      editing = false;
      draggable = false;
      viewing = true;
      //Update isNew in movieList because we are creating/updating it
      changeIsNewState();
    };
  
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

    function signOut() {
        pb.authStore.clear();
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
      console.log(selectedMovie);
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
    }
  
    // Removes a movie from the ui and deletes the record,
    // if it exists
    async function removeMovieFromList(movieIndex) {
      // Templist is for new ui list
      let tempList = []
      for (var i = 0; i < movieList.length; i++) {
  
        if (i == movieIndex) {
          // Only delete if record exists
          if (!movieList[i].isNew) {
            try {
              await pb.collection('movies').delete(movieList[i].recordid);
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          // Add all except one to delete
          tempList.push(movieList[i])
        }
      }
      movieList = tempList;
      hovering = movieList.length;
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

    function autoBeforeChange() {
        console.log(selectedMovie);
    }

    function autoOnChange() {
        console.log(selectedMovie);
    }
  
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

<header class="text-gray-400 bg-gray-900 body-font border-b-2">
    <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a href="/" class="flex title-font font-medium items-center text-white mb-4 md:mb-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
            </svg>
            
        <span class="ml-3 text-xl">Flister</span>
        </a>
        <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">

        <a href="#" class="mr-5 hover:text-white">{data.user.name}</a>


        </nav>

        {#if $currentUser}
        <button on:click={signOut} class="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0">Sign Out
        </button>
        {/if}
    </div>
</header>


  
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
  
  <section class="text-gray-400 body-font bg-gray-900 h-screen">
    <div class="container px-5 py-24 mx-auto">
  
      <div class="flex flex-wrap -m-4">
        <div class="flex flex-col">
          {#if editing}
            <button class="bg-gray-800 border-0 py-1 px-3 my-5 mx-5 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0" on:click={submitPlaylist}>Save</button>
            <button class="bg-gray-800 border-0 py-1 px-3 my-5 mx-5 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0" on:click={cancelEdit}>Cancel</button>
          {/if}
  
          {#if creating}
            <button class="bg-gray-800 border-0 py-1 px-3 my-5 mx-5 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0" on:click={submitPlaylist}>Create</button>
          {/if}
  
          {#if viewing && $currentUser}
            <button class="bg-gray-800 border-0 py-1 px-3 my-5 mx-5 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0" on:click={startEditing}>Edit</button>
          {/if}
        <button class="bg-gray-800 border-0 py-1 px-3 my-5 mx-5 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0" on:click={goBack}>Back</button>
      </div>
      {#each movieList as n, index  (n.id)}
        <div
          id="list-item"
          class="bg-gray-800 bg-opacity-40 p-6 xl:w-1/4 md:w-1/2" 
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
  
           <img src="{n.img}" 
            alt="thumb" 
            draggable={false}
            class="h-[400px] mx-auto mb-4"
            >
  
          {#if editing || creating}
            <a href="#" on:click={() => removeMovieFromList(index)}>
                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#ff0000"/></svg>
            </a>
          {/if}
            <p class="font-bold text-xl"> {n.title}	{index+1}</p>
           
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
