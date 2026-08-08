<script setup lang="ts">
import MyTestComponent from '~/components/my-test-component.vue';

  const asdf = 1234;
  const { data } = await useFetch('/api/hello');

  let doSomethingCool = ()=>alert("hi!");
</script>

<template>

  <div>
    <h1>AAAAAAAAAAAAAAA {{ asdf }} {{ data?.message }} {{ testModule }}</h1>
    <button v-on:click="doSomethingCool">asdf</button>
    <my-test-component/>
    <v-btn prepend-icon="$vuetify">wow it's vuetify!</v-btn>
    <v-card height="75%">
      <chart-js-wrapper/>
    </v-card>
  </div>
</template>
