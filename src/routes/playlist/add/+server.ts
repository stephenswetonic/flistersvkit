import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function createMovies(playlistId : string, movieList, pb) {
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
  const { movieList, playlistName, descriptionText, creating, playlistId } = await request.json();
  let newPlaylistId = playlistId;
  try {
    const record = {
        "name": playlistName,
        "user": locals.user.id,
        "description": descriptionText
    };
    if (creating) {
      const createdPlaylist = await locals.pb.collection('playlists').create(record);
      newPlaylistId = await createMovies(createdPlaylist.id, movieList, locals.pb);
    } else {  
      const updatedPlaylist = await locals.pb.collection('playlists').update(playlistId, record);
      newPlaylistId = await createMovies(playlistId, movieList, locals.pb);
    }

  } catch(err) {
      console.log(err);
  }

  return json({playlistId: newPlaylistId});
}) satisfies RequestHandler;