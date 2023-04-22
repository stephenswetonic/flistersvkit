<script lang="ts">


    async function getTop250() {
        const url = "https://raw.githubusercontent.com/theapache64/top250/master/top250.json";
        const response = await fetch(url);
        const json = await response.json();

        let data = []
        
        for(let i = 0; i < json.length; i++) {
            const urlId = {id : json[i].url.split('/')[2]};
            data.push(urlId);
        }
        const urlJson = JSON.stringify(data);

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", "top250ids.json");
        dlAnchorElem.click();
    }

    function get() {
        getTop250();
    }


</script>

<button class="btn btn-primary" on:click={get}>Get new top 250</button>

<!-- svelte-ignore a11y-missing-content -->
<a id="downloadAnchorElem" style="display:none"></a>