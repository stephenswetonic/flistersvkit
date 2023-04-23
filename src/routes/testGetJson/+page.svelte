<script lang="ts">
    import movieUrls from "$lib/5000movieids.json";

    async function getTop250() {
        let data = []
        
        for(let i = 0; i < movieUrls.length; i++) {

            const urlId = movieUrls[i].id;
            const url = "http://img.omdbapi.com/?i=" + urlId + '&h=400' + '&apikey=5db6accd';
            const response = await fetch(url);

            if (response.status != 404) {
                data.push({url : response.url});
            }
        }
        const urlJson = JSON.stringify(data);
        console.log(urlJson);

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", "movieurls.json");
        dlAnchorElem.click();
    }

    function get() {
        getTop250();
    }


</script>

<button class="btn btn-primary" on:click={get}>Get new top 250</button>

<!-- svelte-ignore a11y-missing-content -->
<a id="downloadAnchorElem" style="display:none"></a>