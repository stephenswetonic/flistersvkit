<script lang="ts">
    import movieUrls from "$lib/csvjson.json";

    async function getTop250() {
        let data = []
        
        for(let i = 0; i < movieUrls.length; i++) {

            const urlId = {id : movieUrls[i].url.split('/')[4]};
            data.push(urlId);
        }
        const urlJson = JSON.stringify(data);

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", "5000movieids.json");
        dlAnchorElem.click();
    }

    function get() {
        getTop250();
    }


</script>

<button class="btn btn-primary" on:click={get}>Get new top 250</button>

<!-- svelte-ignore a11y-missing-content -->
<a id="downloadAnchorElem" style="display:none"></a>