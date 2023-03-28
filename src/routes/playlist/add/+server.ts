import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// async function submitPlaylist() {

//   try {
//     const record = {
//         "name": playlistName,
//         "user": data.user.id
//     };
//     if (creating) {
//       console.log("playlist created")
//       const createdPlaylist = await pb.collection('playlists').create(record);
//       createMovies(createdPlaylist.id);
//     } else {
//       console.log(data.playlist);    
//       const updatedPlaylist = await pb.collection('playlists').update(data.playlist.id, record);
//       createMovies(data.playlist.id);
//     }

//   } catch(err) {
//       console.log(err);
//   }


// };

async function createMovies(playlistId, movieList, pb) {
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
    //routeToPage(`${data.user.id}/${playlistId}`, true);
    

  }
  // creating = false
  // editing = false;
  // draggable = false;
  // viewing = true;
  //Update isNew in movieList because we are creating/updating it
  //changeIsNewState();
  return playlistId;
};
 
export const POST = (async ({ request, locals }) => {
  const { movieList, playlistName, creating, playlistId } = await request.json();
  let newPlaylistId;
  try {
    const record = {
        "name": playlistName,
        "user": locals.user.id
    };
    if (creating) {
      console.log("playlist created")
      const createdPlaylist = await locals.pb.collection('playlists').create(record);
      newPlaylistId = createMovies(createdPlaylist.id, movieList, locals.pb);
    } else {
      //console.log(data.playlist);    
      const updatedPlaylist = await locals.pb.collection('playlists').update(playlistId, record);
      newPlaylistId = createMovies(playlistId, movieList, locals.pb);
    }

  } catch(err) {
      console.log(err);
  }

  return json(newPlaylistId);
}) satisfies RequestHandler;