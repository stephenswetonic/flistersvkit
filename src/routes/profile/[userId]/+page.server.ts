import type { PageServerLoad } from './$types';
 
export const load = (async ({ locals, params }) => {
    try {
        return {
            user : structuredClone(await locals.pb.collection('users').getOne(params.userId)),
            playlists : structuredClone(await locals.pb.collection('playlists').getFullList(50, { filter: `user.id="${params.userId}"`}))
        }
    } catch(err) {
        console.log(err);
    }
}) satisfies PageServerLoad;