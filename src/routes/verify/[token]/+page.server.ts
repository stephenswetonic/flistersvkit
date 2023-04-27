import type { PageServerLoad, Actions } from './$types';
import { validateData } from "$lib/utils";
import { fail, redirect } from "@sveltejs/kit";
import { requestNewValidationSchema } from "$lib/schemas";

export const load = (async ({ locals, params }) => {
    try {
        let res = await locals.pb.collection('users').confirmVerification(params.token);
        return {
            success: res
        }
    } catch(err) {
        console.log(err);
    }
}) satisfies PageServerLoad;

export const actions: Actions = {
    newVerification: async ({ request, locals}) => {
        const { formData, errors } = await validateData(await request.formData(), requestNewValidationSchema);

        if (errors) {
            return fail(400, {
                data: formData,
                errors: errors.fieldErrors
            });
        }

        try {
            await locals.pb.collection('users').requestVerification(formData.email);
            return {
                success: true
            }
        } catch(err) {
            console.log(err);
        }
        
        throw redirect(303, 'login/');
    }
}