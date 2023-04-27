import type { Actions } from './$types';
import { validateData } from "$lib/utils";
import { fail } from "@sveltejs/kit";
import { resetPasswordSchema } from "$lib/schemas";

export const actions: Actions = {
    resetPassword: async ({ request, locals, params}) => {
        const { formData, errors } = await validateData(await request.formData(), resetPasswordSchema);

        if (errors) {
            return fail(400, {
                data: formData,
                errors: errors.fieldErrors
            });
        }

        try {
            console.log("trying reset")
            await locals.pb.collection('users').confirmPasswordReset(
                params.token,
                formData.password,
                formData.passwordConfirm,
            );
            return {
                success: true
            }
        } catch(err) {
            console.log(err);
            return {
                success : false
            }
        }
        
    }
}