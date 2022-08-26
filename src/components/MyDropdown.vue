<template>
  <div class="selectorContainer">
    <label> 
      {{ defaultOption }}
      <input type="checkbox" class="hidden selector" >
    </label>
    <ul v-bind:id="'keySelectorDropdown'/* + (chordFinder-1)*/" class="selector hidden">
      <li v-for="key in values" :key="key">
        <label v-bind:for="key" type="checkbox"> 
          {{ dropdownText[values.indexOf(key)] }} 
          <input type="radio" :value="key" :id="key">
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup>

/*eslint "no-unused-vars": "off"*/

import { ref, toRefs, defineProps } from 'vue'

  const props = defineProps({
    defaultOption: String,
    values: Array,
    dropdownText: Array
  });

  const { defaultOption, values, dropdownText } = toRefs(props);

</script>

<style>

</style>