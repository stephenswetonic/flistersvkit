<script lang="ts">
    import Input from "$lib/components/Input.svelte";
    export let form;

</script>


<div class="flex flex-col items-center h-full w-full">
    <h2 class="mt-2 text-center text-3xl font-bold tracking-light text-base-content">
        Reset your password
    </h2>

    <form action="?/resetPassword" method="POST" class="flex flex-col items-center space-y-2 w-full pt-4">
		<Input type="password" id="password" label="Password" errors={form?.errors?.password} optionalMessage='Password must be a minimum of 8 characters and contain at least one letter, one number, and one special character (@$!%*#?&).'/>
		<Input type="password" id="passwordConfirm" label="Confirm Password" errors={form?.errors?.passwordConfirm} optionalMessage='Password must be a minimum of 8 characters and contain at least one letter, one number, and one special character (@$!%*#?&).'/>

		<div class="w-full max-w-lg pt-2">
			<button type="submit" class="btn btn-primary w-full">Reset Password</button>
		</div>
    </form>

    {#if form?.success}
        <div class="alert alert-success shadow-lg max-w-lg my-2">
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Password reset!</span>
            </div>
        </div>
        <p class="text-center mt-1">
            You can close this page or <a href="/login" class="text-primary font-medium hover:cursor-pointer hover:underline"> sign in </a>
        </p>
    {/if}
    {#if form?.success == false}
        <div class="alert alert-error shadow-lg my-2">
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Something went wrong</span>
            </div>
        </div>
    {/if}
</div>