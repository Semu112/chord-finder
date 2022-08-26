/*eslint no-unused-vars: "off"*/
/*eslint no-undef: "warn"*/
/*eslint no-debugger: "off"*/

import { onMounted } from 'vue'

export function useOther(data, keyboard, alertsDiv, /*correspondingKeys,*/ allNotes){

    onMounted(() => {
        //Onhover for dropdown elements
        // eslint-disable-next-line
        $(document).on("mouseenter", ".selector label", (e) => {
            console.log(`e.currentTarget.querySelector("input"):`);
            console.log(e.currentTarget.querySelector("input").value);
            let hoverKey = e.currentTarget.querySelector("input").value;
            let hoverMode = e.currentTarget.document.querySelector("#modeSelectorDropdown" + this.activeFinder + " input:checked").value;
            console.log(`hoverKey: ${hoverKey}
            activeMode: ${hoverMode}`)
            this.peekScale(hoverKey, hoverMode);
        });
    });

    //For adding notes/semitones into their array in the right position
    function addNewNote(array, note, octave){
        let noteId = note + octave;

        for(let i = 0; i < array.length; i++){
            let arrayNote = array[i].match(/^[A-G]/)[0];
            let arrayOctave = array[i].match(/[0-9]+/)[0];

            //If the octave is less
            if(octave < arrayOctave){
                array.splice(i, 0, noteId);
                return;
            }
            //If the octave is the same
            else if(octave == arrayOctave){
                if(allNotes.value.indexOf(note[0]) < allNotes.value.indexOf(arrayNote[0])){
                    array.splice(i, 0, noteId);
                    return;
                }
            }
        }

        array.push(noteId);
        return;
    }

    // function addNewSemitone(array, semitone){

    //     if(array.length == 0){
    //         array.push(semitone);
    //         return;
    //     }

    //     for(let i = 0; i < array.length; i++){
    //         if(semitone < array[i]){
    //             array.splice(i, 0, semitone);
    //             return;
    //         }
    //         console.log(`got to the end`);
    //     }

    //     array.push(semitone);

    // }

    // function justifySemitones(array){
    //     let offset = array[0];

    //     for(let i = 0; i < array.length; i++){
    //         array[i] -= offset;
    //     }
    // }

    // function toSemitone(root, note, octave){

    //     let rootNote = root.match(/^[A-G](#|b)?/i)[0];
    //     let rootOctave = root.match(/[0-9]+/)[0];

    //     let displacement = allNotes.value.indexOf(note) - allNotes.value.indexOf(rootNote);
    //     let octaveDifference = octave - rootOctave;
    //     displacement += 12 * (rootOctave - 4);

    //     return displacement;
    // }
    //*/

    function toggleNote(note, octave){

        let noteId = note + octave;

        let userNotes = data.value.notes.userActivated;
        // let concat = data.value.notes.concat;
        // let semitones = data.value.semitones;

        // let semitone;

        // if(concat.length == 0){
        //     semitone = 0;
        // } else {
        //     semitone = toSemitone(concat[0], note, octave);
        // }

        // console.log(`semitone: ${semitone}`);
  
        // keyboard.value.querySelector("." + note + ".octave" + octave).classList.toggle(activeClass);
        
        if(!userNotes.includes(noteId)){

            //Add into array at right position
            addNewNote(userNotes, note, octave);
            // addNewNote(concat, note, octave);
            // addNewSemitone(semitones, semitone);

        } else {
            userNotes.splice(userNotes.indexOf(noteId), 1);
            // concat.splice(concat.indexOf(noteId), 1);
            // semitones.splice(semitones.indexOf(semitone), 1);
        }

        // justifySemitones(semitones);
  
        //Doesn't run notesToChord from here, there is a watcher watching concat
        // data.value.computedChords = notesToChord(userNotes);
     }
  
    // function keyboardToNote(key){
    //     let index = correspondingKeys.value.indexOf(key);
    //     if(index != -1){
    //         let note = allNotes.value[index];
    //         toggleNote(note, 4);
    //     } else {
    //         console.log("key not found");
    //     }
    // }

    function resetClass(activeClass){

        let nodeList = keyboard.value.querySelectorAll("." + activeClass);

        for(let node of nodeList){
            node.classList.remove(activeClass);
        }

        // data.value.notes[activeClass] = [];

    }

    function reset(){
        //resetNotes needed for reset button
        //Reset of data needed so it doesn't show on screen
        data.value.computedChords = [];
        data.value.notes.computed = [];
        data.value.notes.userActivated = [];
        data.value.notes.typed = [];
        data.value.advanced.key = "";
        data.value.advanced.mode = "";
        data.value.chordInput = "";
        data.value.omissions = [];
    }

    function activateNotes(notes, activateClass){

        // let realClass = activateClass;

        // if(activateClass == "typed"){
        //     realClass = "userActivated";
        // }

        //Add activity to new notes
        for(let note of notes){

            if(/[A-G](#|b)?/.test(note) && /[0-9]+/.test(note)){
                let key = /[A-G](#|b)?/.exec(note)[0];
                let octave = /[0-9]+/.exec(note)[0];

                if(key != "" && octave != ""){
                    keyboard.value.querySelector("." + key + ".octave" + octave).classList.add(activateClass);
                }
            }
        }

    }   

    function getRoot(chord){
        return chord.match(/^[A-G]b?/i) + "4";
    }

    function getQuality(chord){
        let firstNote = chord[0];

        if(/[a-g]/.test(firstNote)){
            return "minor";
        } else {
            return "major";
        }
    }

    function alert(message){
        let newAlertDiv = document.createElement("DIV");
        newAlertDiv.classList.add("alert");
        newAlertDiv.innerText = message;
        
        alertsDiv.value.appendChild(newAlertDiv);
    }

    function sharpToFlat(noteId){

        let note = noteId.match(/^[A-G]/i)[0];

        noteId = noteId.replace(note + "#", allNotes.value[allNotes.value.indexOf(note)+1])

        return noteId;
    }

    function activateFromText(text){

        let splitRegex = /(?<=(,)?)[A-G](#|b)?(?=(,))?/gi;
        let notes = text.match(splitRegex);

        for(let i = 0; i < notes.length; i++){

            // debugger;

            let replaceValue = notes[i][0].toUpperCase();

            notes[i] = notes[i].replace(/^[a-g]/, notes[i][0].toUpperCase());

            if(!(/[0-9]+/.test(notes[i]))){
                notes[i] += "4";
            }

            if(notes[i].includes("#")){
                notes[i] = sharpToFlat(notes[i]);
            }
        }

        data.value.notes.typed = notes;

        // activateNotes(notes, "typed");
    }

    // function updateConcat(){

    //     data.value.notes.concat = [];

        
    // }

   return {
        addNewNote,
        toggleNote,
        resetClass,
        reset,
        activateNotes,
        getRoot,
        getQuality,
        alert,
        sharpToFlat, 
        activateFromText
      
      
   }

}