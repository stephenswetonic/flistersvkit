import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

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

    } else {
      const createdMovie = await pb.collection('movies').update(movieList[i].recordid, record);
    }
  }
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
      const createdPlaylist = await locals.pb.collection('playlists').create(record);
      newPlaylistId = createMovies(createdPlaylist.id, movieList, locals.pb);
    } else {  
      const updatedPlaylist = await locals.pb.collection('playlists').update(playlistId, record);
      newPlaylistId = createMovies(playlistId, movieList, locals.pb);
    }

  } catch(err) {
      console.log(err);
  }

  return json(newPlaylistId);
}) satisfies RequestHandler;