import type { PageServerLoad } from './$types';
 
export const load = (async ({ locals, params }) => {
    let playlists = await locals.pb.collection('playlists').getFullList(50, { filter: `user.id="${params.userId}"`});
    for (let i = 0; i < playlists.length; i++) {
        Object.assign(playlists[i], {thumbnailImgs : []});
        const movies = await locals.pb.collection('movies').getFullList(50, { filter: `playlist="${playlists[i].id}"`, sort : "rank"});
        const minLen = Math.min(3, movies.length);
        for (let j = 0; j < minLen; j++) {
            playlists[i].thumbnailImgs.push({img : movies[j].poster, index : j});
        }
    }
    



    if (locals.user) {
        try {
            return {
                user : locals.user,
                name : locals.user.name,
                playlists : structuredClone(playlists),

            }
        } catch(err) {
            console.log(err);
        }
    }

    try {
        return {
            user : undefined,
            name : structuredClone(await locals.pb.collection('users').getOne(params.userId)).name,
            playlists : structuredClone(playlists),

        }
    } catch(err) {
        console.log(err);
    }
}) satisfies PageServerLoad;