import type { PageServerLoad } from './$types';
 
export const load = (async ({ locals, params }) => {
    if (locals.user) {
        return {
            user : locals.user,
            name : locals.user.name,
            playlists : structuredClone(await locals.pb.collection('playlists').getFullList(50, { filter: `user.id="${params.userId}"`}))
        }
    }

    try {
        return {
            user : undefined,
            name : structuredClone(await locals.pb.collection('users').getOne(params.userId)).name,
            playlists : structuredClone(await locals.pb.collection('playlists').getFullList(50, { filter: `user.id="${params.userId}"`}))
        }
    } catch(err) {
        console.log(err);
    }
}) satisfies PageServerLoad;