<template>
    <Script
        type="application/javascript"
        defer
        data-name="BMC-Widget"
        data-cfasync="false"
        src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        data-id="Tchibo"
        data-description="Support me on Buy me a coffee!"
        data-message=""
        :data-color="getRandomColor()"
        data-position="Right"
        data-x_margin="18"
        data-y_margin="18"></Script>
</template>

<script lang="ts" setup>
const colorPool = ["#34d080", "#ef5858", "#686ff6"];
function getRandomColor() {
    return colorPool[Math.floor(Math.random() * colorPool.length)];
}
</script>
