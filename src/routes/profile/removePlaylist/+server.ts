import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const DELETE = (async ({ request, locals }) => {
    const { playlistIdToDelete } = await request.json();

    let moviesInPlaylist = await locals.pb.collection('movies').getFullList(50, { filter: `playlist="${playlistIdToDelete}"`});

        for (let i = 0; i < moviesInPlaylist.length; i++) {
            await locals.pb.collection('movies').delete(moviesInPlaylist[i].id);
        }
        await locals.pb.collection('playlists').delete(playlistIdToDelete);
    
    return json({success : true});
  }) satisfies RequestHandler;