<template>
    <div class="flex justify-center">
        <div class="ml-5 p-5 pt-0 mt0 bg-slate-800 rounded-md">
            <h1>Impressum</h1>

            <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
            <p>
                Johannes Pour<br />
                <span>6 ,e&szlig;artsstrO</span><br />
                <span>reilhcS 18288</span>
            </p>

            <h2>Kontakt</h2>
            <p>
                Telefon: +<span>42293212 671 94</span><br />
                E-Mail: <span>moc.liamg@6003ruopJ</span>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: "Johannes Pour - Impressum",
    meta: [
        {
            name: "description",
            content: "Impressum of johannespour.de",
        },
    ],
});
</script>

<style scoped>
span {
    direction: rtl;
    unicode-bidi: bidi-override;
    user-select: none;
}
</style>
