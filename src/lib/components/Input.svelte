<script lang="ts">
    export let value = '';
    export let placeholder = '';
    export let id;
    export let label;
    export let type;
    export let disabled = false;
    export let required = false;
    export let errors;
    export let optionalMessage = "";


</script>

<div class="form-control w-full max-w-lg mb-2">
    <label for="{id}" class="label font-medium pb-1">
    <span class="label-text">{label}</span>
</label>

<input {type} {placeholder} {disabled} {required} {id} name={id} {value} class="input input-bordered w-full max-w-lg"/>
<span class="label font-light text-xs">{optionalMessage}</span>


{#if errors}
    {#each errors as error}
        <label for={id} class="label py-0 pt-1">
            <span class="label-text-alt text-error">
                {error}
            </span>
        </label>
    {/each}
{/if}

</div>