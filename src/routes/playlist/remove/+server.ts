import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const DELETE = (async ({ request, locals }) => {
    const { moviesToDelete, playlistId } = await request.json();
    for (let i = 0; i < moviesToDelete.length; i++) {
        try {
            await locals.pb.collection('movies').delete(moviesToDelete[i].recordid);
        } catch(err) {
            console.log(err);
            return json({success : false});
        }
    }
    return json({success : true});
  }) satisfies RequestHandler;