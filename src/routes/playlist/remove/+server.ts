import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE = (async ({ request, locals }) => {
    const { moviesToDelete, playlistId } = await request.json();
    console.log(moviesToDelete);
    for (let i = 0; i < moviesToDelete.length; i++) {
        await locals.pb.collection('movies').delete(moviesToDelete[i].recordid);
    }

  
    return json({success : true});
  }) satisfies RequestHandler;