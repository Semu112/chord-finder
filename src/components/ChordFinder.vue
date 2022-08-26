<template>
<div>
    <div style="display = flex; justify-content = center">
        <div>
            <span>Octaves = {{ data.numberOfOctaves }}</span>
            <button @click="data.numberOfOctaves++; center()">+</button>
            <button @click="data.numberOfOctaves--; center()">-</button>
        </div>
        <div>
            <div class="buttons" @click="chordToNotes(chordInput)">
                <button @click="addAtCursor('ø', $event.currentTarget.parentElement.parentElement.querySelector('.chordInput')); ">ø</button>
                <button @click="addAtCursor('°', $event.currentTarget.parentElement.parentElement.querySelector('.chordInput'))">°</button>
            </div>
            <input type="text" v-model="chordInput" class="chordInput">
        </div>
        <p> Computed chords: <span v-for="chord in data.computedChords" class="link" @mouseover="activateNotes(data.chord.uninvertedNotes, 'peek');" @mouseleave="resetKeys('peek');"  :key="chord">{{ chord }}, </span></p>
        <button @click="other.reset()"> Reset </button>
        <p> Notes: <span v-for="note in data.notes.concat"  :key="note"> {{ note }}, </span></p>
        <p> Semitones: <span v-for="semitone in data.semitones"  :key="semitone" > {{ semitone }}, </span></p>
        <p v-if="data.omissions.length > 0"><span v-for="omission in data.omissions" :key="omission" class="alert"> {{ omission.note }} often omitted because {{ omission.reason}}</span></p>
        <div ref="alertsDiv"></div>
    </div>
    <div id="keyboardContainer">
        <div id="keyboard" ref="keyboard">
            <div class="octave" v-for="octave in data.octaves"  :key="octave">
                <div class="white key C" :class="'octave' + octave"></div>
                <div class="accidental key Db" :class="'octave' + octave"></div>
                <div class="white key D" :class="'octave' + octave"></div>
                <div class="accidental key Eb" :class="'octave' + octave"></div>
                <div class="white key E" :class="'octave' + octave"></div>
                <div class="white key F" :class="'octave' + octave"></div>
                <div class="accidental key Gb" :class="'octave' + octave"></div>
                <div class="white key G" :class="'octave' + octave"></div>
                <div class="accidental key Ab" :class="'octave' + octave"></div>
                <div class="white key A" :class="'octave' + octave"></div>
                <div class="accidental key Bb" :class="'octave' + octave"></div>
                <div class="white key B" :class="'octave' + octave"></div>
            </div>
        </div>
    </div>
    <div class="dropdowns">
        <div class="selectorContainer">
        <label> 
            {{ data.advanced.key }}
            <input type="checkbox" class="hidden">
        </label>
        <ul v-bind:id="'keySelectorDropdown'/* + (chordFinder-1)*/" class="selector hidden">
            <li v-for="key in allNotes" :key="key">
                <label v-bind:for="key" type="checkbox"> 
                    {{ dropdownText[allNotes.indexOf(key)] }} 
                    <input type="radio" :value="key" :id="key">
                </label>
            </li>
        </ul>
        </div>
        <div class="selectorContainer">
            <label> 
                {{ data.advanced.mode }}
                <input type="checkbox" class="hidden" >
            </label>
            <ul v-bind:id="'keySelectorDropdown'/* + (chordFinder-1)*/" class="selector hidden">
                <li v-for="mode in Object.keys(modes)" :key="mode">
                    <label type="checkbox"> 
                        {{ mode }} 
                        <input type="radio" :value="mode">
                    </label>
                </li>
            </ul>
        </div>
    </div>
    <!-- <MyDropdown :values="allNotes" :dropdownText="dropdownText" defaultOption="C"></MyDropdown>
    <MyDropdown :values="Object.keys(modes)" :dropdownText="Object.keys(modes)" defaultOption="major"></MyDropdown> -->
</div>
</template>

<script setup>
/*eslint no-unused-vars: "warn"*/
/*eslint no-undef: "warn"*/

import { ref, defineProps, toRefs, defineExpose, watch } from 'vue'
import { useNotesToChord } from '../composables/useNotesToChord.js'
import { useChordToNotes } from '../composables/useChordToNotes.js'
import { useOther } from '../composables/useOther.js'
// import MyDropdown from './MyDropdown.vue'

const keyboard = ref(null);
const alertsDiv = ref(null);

const props = defineProps({
    allNotes: Array,
    // correspondingKeys: Array,
    modes: Object,
    dropdownText: Array
});

const { allNotes, /* correspondingKeys,*/ modes, dropdownText } = toRefs(props);

var chordInput = ref("");

var data = ref({
//   chordInput: "",
    semitones:  [],
    notes: {
        computed: [],
        userActivated: [],
        concat: [],
    },
    numberOfOctaves: 3,
    computedChords: [],
    root: "",
    advanced: {
        key: "C",
        mode: "major"
    },
    octaves: [3, 4, 5],
    omissions: []
})

const other = useOther(data, keyboard, alertsDiv, /*correspondingKeys,*/ allNotes);

const { computeChords } = useNotesToChord(allNotes, modes, data, keyboard, other);

const { chordToNotes } = useChordToNotes(allNotes, modes, data, keyboard, other, alertsDiv);

watch(chordInput, (chord) => {
    chordToNotes(chord);
});

watch(data.value.notes.concat, (notes) => {
    data.value.computedChords = computeChords(notes);
})

//Functions
function addAtCursor(string, inputElement){
    // console.log(inputElement);
    // console.log(inputElement.selectionStart);

    let text = chordInput.value;
    let curPos = inputElement.selectionStart;

    // console.log(text.slice(0,curPos)+string+text.slice(curPos));
    // console.log(`value: ${inputElement.value}`);
    // console.log(inputElement);

    chordInput.value = text.slice(0,curPos)+string+text.slice(curPos);

    console.log(`value: ${inputElement.value}`);
}

defineExpose({ other });

// const allNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
// const correspondingKeys = ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j", "k"];
// const modes = {
//     major: ["T", "T", "S", "T", "T", "T", "S"],
//     minor: ["T", "S", "T", "T", "S", "T", "T"]
// };

// let chordInput = "em7";
// let semitones =  [];
// let notes = {
//     computed: [],
//     userActivated: [],
//     concat: [],
// };
// let numberOfOctaves = 3;
// let computedChords = [];
// let root = "";
// let advanced = {
//     key: "C",
//     mode: "major"
// };
// let octaves = [4, 5, 3];

        // const { keyboardToNote, add1 } = notesToChord(allNotes, correspondingKeys);

        // notes.userActivated.push(keyboardToNote("e"));

        // console.log("setup");

</script>