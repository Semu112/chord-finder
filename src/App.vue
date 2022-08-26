<template>
  <div>
    <div>
        <span>Number of Finders: {{ numberOfFinders }}</span>
        <button @click="numberOfFinders++">+</button>
        <button @click="numberOfFinders--">-</button>
    </div>
    <div>
      <span>Active finder: {{ activeFinder }}</span>
      <button @click="activeFinder++">+</button>
      <button @click="activeFinder--">-</button>
    </div>
    <div v-for="finder in numberOfFinders" :key="finder" :id="'finder' + (finder-1)" class="finder">
      <ChordFinder ref="finders" :allNotes="allNotes" :modes="modes" :dropdownText="dropdownText"/>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import ChordFinder from './components/ChordFinder.vue'
import { ref } from 'vue'

const allNotes = ref(["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]);
const correspondingKeys = ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j"];
const modes = {
    major: ["T", "T", "S", "T", "T", "T", "S"],
    minor: ["T", "S", "T", "T", "S", "T", "T"]
};

//Dropdown values
const dropdownText = ["C", "C#/Db", "D", "Eb/D#", "E", "F", "F#/Gb", "G", "Ab/G#", "A", "Bb/A#", "B"];

export default {
  name: 'App',
  components: {
    ChordFinder
},
  data(){
    return {
      numberOfFinders: 1,
      activeFinder: 0,
      allNotes,
      correspondingKeys,
      modes,
      dropdownText
    }
  },
  mounted(){

    //Adds keypress listener
    document.addEventListener("keydown", (e) => {
      if(e.key === "ArrowDown"){
        this.activeFinder = Math.abs((this.activeFinder+1) % this.numberOfFinders);
      }
      else if(e.key === "ArrowUp"){
        this.activeFinder = (this.numberOfFinders + (this.activeFinder-1)) % this.numberOfFinders;
      }

      if(!(document.activeElement.classList.contains("chordInput"))){
          // this.$refs.finders[this.activeFinder].notesToChord(e.key);

          //keyboardToNote
          let index = correspondingKeys.indexOf(e.key);
          if(index != -1){
              let note = allNotes.value[index];
              this.$refs.finders[this.activeFinder].other.toggleNote(note, 4);
          } else {
              console.log("key not found");
          }

          // this.$refs.finders[this.activeFinder].keystrokeActivate(e.key)
      } // else {
      //     console.log("key input blocked, input field focussed");
      // }

    });

    //Adds onclick event for keys
    $(document).on("click", ".key", (key) => {

      let classList = key.currentTarget.classList.value;
      let note = classList.match(/((?<=(\s))[A-G](#|b)?)(?=(\s))/)[0];
      let octave = classList.match(/(?<=(octave))[0-9]+/)[0];

      this.$refs.finders[this.activeFinder].other.toggleNote(note, octave);
    })

    //Adds onmouseover for finders
    $(document).on("mouseenter", ".finder", (finder) => {

        //Finds target and extracts the first number from the target's (which chordFinder) id
        let regex = /[0-9]+/;
        if(regex.test(finder.currentTarget.id)){
            let finderId = parseInt(finder.currentTarget.id.match(/[0-9]+/)[0]);
            this.activeFinder = finderId;
        }

    });

    //Adds onclick for dropdowns
    $(document).on("mouseup", ".selectorContainer", (selector) => {
      selector.currentTarget.querySelector("ul").classList.toggle("hidden");
    });

    //When mouse leaves show the active scale
    $(document).on("mouseleave", ".selector label", (e) => {

        let finder = e.target.parentElement.parentElement.id.match(/[0-9]+/)[0];

        this.peekScale(this.myData[finder].advanced.key, this.myData[finder].advanced.mode);

    })
  },
  watch: {
    activeFinder: {
      handler(newFinder, oldFinder) {
        let oldFinderId = 'finder' + oldFinder;
        let newFinderId = 'finder' + newFinder;
        document.getElementById(oldFinderId).classList.remove("activeFinder");
        document.getElementById(newFinderId).classList.add("activeFinder");
      }
    }
  }
}
</script>

<style>

.activeFinder {
  background-color: lightgrey;
  border-radius: 3px;
}
</style>
