<script lang="ts">
    import { currentUser, pb } from './pocketbase';
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
    export let creating = false;
    let viewing = false;
    export let selectedPlaylist;
    export let leavePlaylist = () => {} 
  
    async function submitPlaylist() {
      try {
        const data = {
            "name": playlistName,
            "user": $currentUser.id
        };
        if (creating) {
          console.log("playlist created")
          const createdPlaylist = await pb.collection('playlists').create(data);
          selectedPlaylist = createdPlaylist;
          createMovies(createdPlaylist.id);
        } else {
          const updatedPlaylist = await pb.collection('playlists').update(selectedPlaylist.id, data);
          createMovies(selectedPlaylist.id);
        }
  
      } catch(err) {
          console.log(err);
      }
  
  
    };
  
    async function createMovies(playlistId) {
      //console.log(movieList)
      for (var i = 0; i < movieList.length; i++) {
        const data = {
          "title": movieList[i].title,
          "rank": i+1,
          "playlist": playlistId,
          "imdbid": movieList[i].imdbid,
          "poster": movieList[i].img
        };
        if (movieList[i].isNew) {
          const record = await pb.collection('movies').create(data);
          movieList[i].recordid = record.id;
          console.log(record);
        } else {
          console.log('updated record')
          console.log(movieList[i].recordid);
          const record = await pb.collection('movies').update(movieList[i].recordid, data);
        }
  
        
  
      }
      creating = false
      editing = false;
      draggable = false;
      viewing = true;
      //Update isNew in movieList because we are creating/updating it
      changeIsNewState();
    };
  
    function changeIsNewState() {
      for (var i = 0; i < movieList.length; i++) {
        movieList[i].isNew = false;
      }
    }
  
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
  
    const dragstart = (event, i) => {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.dropEffect = 'move';
      const start = i;
      event.dataTransfer.setData('text/plain', start);
    }
  
    async function addMovieToList() {
      // Getting high res poster
      const url = "http://img.omdbapi.com/?i=" + selectedMovie.imdbID + '&h=2000' + '&apikey=5db6accd';
      const response = await fetch(url);
  
      // Adding to playlist ui. In creating or editing mode,
      // isNew is true so the record is created.
      movieList.push({"recordid" : "","title" : selectedMovie.Title, "id" : movieList.length, "img": response.url, "imdbid" : selectedMovie.imdbID, "isNew" : true});
      hovering = movieList.length;
  
    }
  
    function startEditing() {
      editing = true;
      draggable = true;
      viewing = false;
      creating = false;
      playlistName = selectedPlaylist.name;
    }
  
    function cancelEdit() {
      creating = false
      editing = false;
      draggable = false;
      viewing = true;
      playlistName = selectedPlaylist.name;
    }
  
    // TODO
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
  
    async function getSearchItems(keyword) {
      const url = "http://www.omdbapi.com/?s=" + encodeURI(keyword) + '&apikey=5db6accd';
      const response = await fetch(url)
      const json = await response.json()
      //console.log(json.Search)
      return json.Search
    }
  
    async function addPlaylistsToList() {
      console.log($currentUser);
      playlistName = selectedPlaylist.title;
      const movies = await pb.collection('movies').getFullList(50, { filter: `playlist="${selectedPlaylist.id}"`, sort : "rank"});
  
      //console.log(movies);
      for (var i = 0; i < movies.length; i++) {
        movieList.push({"recordid" : movies[i].id, "title" : movies[i].title, "id" : movies[i].rank-1, "img": movies[i].poster, "imdbid" : movies[i].imdbid, "isNew" : false})
      }
      hovering = movieList.length;
    };
  
    function removeItemOnce(arr, index) {
      if (index > -1) {
        arr.splice(index, 1);
      }
      return arr;
    }
  
    // If a playlist from Home was selected,
    // fill up the list.
    // Else allow dragging by default
    if (selectedPlaylist) {
      addPlaylistsToList();
      playlistName = selectedPlaylist.name;
      viewing = true;
      draggable = false;
      editing = false;
      creating = false;
  
    } else {
      draggable = true;
    }
  
    // viewing: edit button
    // creating: create, title add, search
    // editing: save button, title add, search
  
  </script>
  
  {#if $currentUser}
  
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
      labelFieldName="Title"
      valueFieldName="imdbID"
      bind:selectedItem="{selectedMovie}"
      placeholder="Search Movies..."
      class="w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500 hover:ring-blue-500 hover:border-blue-500 "
      >
  
      <div slot="item" let:item={item} let:label={label} class="flex flex-row">
        <img src="{item.Poster}" alt="thumbnail" style="max-width: 200px; height: auto;">
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
  
          {#if viewing}
  
            <button class="bg-gray-800 border-0 py-1 px-3 my-5 mx-5 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0" on:click={startEditing}>Edit</button>
            <button class="bg-gray-800 border-0 py-1 px-3 my-5 mx-5 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0" on:click={leavePlaylist}>Back</button>
          {/if}
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
  
          {#if editing}
            <a href="#" on:click={() => removeMovieFromList(index)}>
              <img src="src/assets/closebutton.svg"
                alt="close"
                draggable={false}>
            </a>
          {/if}
            <p class="font-bold text-xl"> {n.title}	{index+1}</p>
           
        </div>
      {/each}
  
      </div>
    </div>
  </section>
  {/if}
  
  <style>
    #list-item.is-active {
      background-color: #3273dc;
      color: #fff;
    }
  
    .autocomplete-wrapper :global(.autocomplete) {
      width: 500px;
    }
  
    .autocomplete-wrapper :global(.autocomplete-list) {
      max-height: 100px;
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