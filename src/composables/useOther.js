/*eslint no-unused-vars: "off"*/
/*eslint no-undef: "warn"*/

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

    function toggleNote(note, octave){

        function addNewNote(array, noteId){
            let note = noteId.match(/^[A-G]/);
            let octave = noteId.match(/[0-9]+/);
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

        let userNotes = data.value.notes.userActivated;
        let concat = data.value.notes.concat;
  
        keyboard.value.querySelector("." + note + ".octave" + octave).classList.toggle("userActivated");
        let noteId = note + octave;
        if(!userNotes.includes(noteId)){
            //Add into array at right position
            addNewNote(userNotes, noteId);
            addNewNote(concat, noteId);
        } else {
           userNotes.splice(userNotes.indexOf(noteId), 1);
           concat.splice(concat.indexOf(noteId), 1);
        }
  
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

    }

    function reset(){
        //resetNotes needed for reset button
        //Reset of data needed so it doesn't show on screen
        data.value.computedChords = [];
        data.value.semitones = [];
        data.value.notes.concat = [];
        data.value.notes.computed = [];
        data.value.notes.userActivated = [];
        data.value.advanced.key = "";
        data.value.advanced.mode = "";
        data.value.chordInput = "";
        data.value.omissions = [];

        resetClass("computed");
        resetClass("userActivated");
        resetClass("peek");
        resetClass("scale");
    }

    function activateNotes(notes, activateClass){

        //Add activity to new notes
        for(let note of notes){

            let key = /\D*/.exec(note);
            let octave = /[0-9]+/.exec(note);

            keyboard.value.querySelector("." + key + ".octave" + octave).classList.add(activateClass);
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

   return {
      reset,
      resetClass,
      activateNotes,
      getRoot,
      getQuality,
      alert,
      toggleNote
   }

}