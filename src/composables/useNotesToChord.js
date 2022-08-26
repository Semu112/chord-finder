import { ref, onMounted } from 'vue'
/*eslint no-unused-vars: "off"*/
/*eslint no-debugger: "off" */
export function useNotesToChord(allNotes, modes, data, keyboard, other){

   function getRoot(){
      if(data.value.notes.concat[0]){
         return data.value.notes.concat[0];
      }
   }

   function semitonesToNotes(semitones, root){
      
      let notes = [];

      semitones.forEach((semitones) => {
         notes.push(allNotes.value[allNotes.value.indexOf(root) + semitones]);
      })

      return notes;
      
   }

   function computeChords(notes){

      if(notes.length > 2){

         let chords = [];
         // data.value.computedChords = [];

         // //Polychord loop
         // for(let i = 0; i < notes.length/6; i++){
            // chords[i] = [];
            let root = notes[0].match(/^[A-G](#|b)?/i)[0];

            let semitones = getSemitonesFromNoteInput(notes);

            computeChordHelper([...semitones], root, 0, chords);

            //Slash chord check, removes lowest semitone, adjusts rest of the array and tries to figure out a chord
            if(semitones.length >= 4){

               semitones = semitones.slice(1);

               let offset = semitones[0];
               for(let j in semitones){
                  semitones[j] -= offset;
               }               
               console.log(`Slash checking semitones: ${semitones}`);

               let newRoot = notes[1].match(/^[A-G](#|b)?/i)[0];

               let upperSlashChords = [];
               computeChordHelper(semitones, newRoot, 0, upperSlashChords);

               for(let j = 0; j < upperSlashChords.length; j++){
                  chords.push(upperSlashChords[j] + "/" + root);
                  console.log(`Added slash: ${upperSlashChords[j] + "/" + root}`);
                  console.log("upperSlashChords:");
                  console.log(upperSlashChords);
               }

            // }
         }

         // //Concatenates any polychords
         // let chordsToReturn = chords[0];
         // for(let i = 1; i < chords.length; i++){
         //    for(let j = 0; j < chords[i].length; j++){
         //       for(let k = j; k < chords[i].length; k++){
         //          chordsToReturn.push(chords[i][j] + "_" + chords[i][k]);
         //       }
         //    }
         // }
         
         return chords;
      }
   }

   function getSemitonesFromNoteInput(notes) {
      
      let semitones = [];

      let root = notes[0];
      let rootIndex = allNotes.value.indexOf(root.match(/\D*/)[0]);
      let rootOctave = root.match(/[0-9]+/)[0];

      data.value.notes.concat.forEach((note) => {

          let noteOctave = note.match(/[0-9]+/)[0];
          let octaveDifference = noteOctave - rootOctave;

          note = note.match(/\D*/)[0];
          let currentNoteIndex = allNotes.value.indexOf(note);
          currentNoteIndex = currentNoteIndex - rootIndex;
          //Adds octave difference
          currentNoteIndex = currentNoteIndex + (octaveDifference * 12);
         semitones.push(currentNoteIndex);
          
      });

      return semitones;

   }

   function computeChordHelper(semitones, root, acc, chords){

      let semitonesCopy = [...semitones];

      if(acc >= semitonesCopy.length){
          return;
      }

      semitonesCopy.splice(0, 1);

      // let root;

      // if(acc == 0){
      //     root = data.value.notes.concat[rootIndexInConcat];
      // } else {
      //     root = data.value.notes.concat[data.value.notes.concat.length - acc];
      // }
      // console.log(`root: ${root}`)

      let rollingChord = "";
      // root = root.match(/^[A-G](#|b)?/)[0];

      // -- Decision tree start --

      let third = getThird(semitonesCopy);
      if(third == "minor"){
         rollingChord = root.toLowerCase();
      } else {
         rollingChord = root;
      }

      if(third != ""){

         let fifth = getFifth(semitonesCopy, third);

          if(fifth != "-1"){
            rollingChord += fifth;

            //Polychords
            if(semitonesCopy.length >= 3){

               // debugger;

               let newRoot = allNotes.value[(allNotes.value.indexOf(root) + semitonesCopy[0])%12];
               //Trust with the - acc, 3am morning
               // let polyRootIndexInConcat = semitones.indexOf(semitonesCopy[0]) - acc;

               //Justify semitonesCopy
               let justified = [];
               let offset = semitonesCopy[0];
               for(let i = 0; i < semitonesCopy.length; i++){
                     justified.push(semitonesCopy[i] - offset);
               }

               let overChords = [];
               computeChordHelper(justified, newRoot, 0, overChords);

               for(let i = 0; i < overChords.length; i++){
                  chords.push(overChords[i] + "_" + rollingChord);
               }

               return;
            }

              //Complex extensions
              let replace = rollingChord.includes(String.fromCharCode(176));
              let complexReturn = getComplexExtension(semitonesCopy, fifth);
              replace = (complexReturn.includes(String.fromCharCode(176)) | complexReturn.includes(String.fromCharCode(248)) && replace);
              rollingChord = rollingChord.substring(0, rollingChord.length-replace) + complexReturn;

            // debugger;

            // semitonesCopy = removeRedundant(semitonesCopy);

              //Extensions
              if(semitonesCopy.length == 1){
                  
                  console.log("Adding extension");

                  let mode;
                  if(/^[A-G]/.test(rollingChord)){
                      mode = modes.value.major;
                  } else {
                      mode = modes.value.minor;
                  }

                  rollingChord += getExtension(semitonesCopy[0], mode);
                  semitonesCopy.splice(0, 1);
              }

            //Adds inversion
            if(acc != 0){
               rollingChord += "inv" + acc;
            }
         }

          if(semitonesCopy.length == 0){
              console.log("Found " + rollingChord);

              chords.push(rollingChord);
              // chords.semitonesCopy = semitonesCopy;
          } else {
              // console.log("Semitones left over: ");
              // console.log(semitonesCopy);
          }
      }

      //Inversion checker
      //Increases accumulator, alters semitones to show inversion, ex. converts [0, 4, 9] to [0, 4, -3(minussed 12)] then [-3, 0, 4] then [0, 3, 7]
      
      debugger;

      //Computes new root
      let newRoot = allNotes.value[(allNotes.value.indexOf(root) + semitones[semitones.length-1])%12];

      //Inverts chord
      //Rotates array and minusses
      acc++;
      semitones[semitones.length-1] -= 12;
      let temp = semitones[semitones.length-1];
      semitones.pop();
      semitones.unshift(temp);

      for(let i = 0; i < semitones.length; i++){
          semitones[i] += Math.abs(temp);
      }

      computeChordHelper(semitones, newRoot, acc, chords);

   }

   function removeRedundant(semitones){

      // Removes redundant semitones
      for(let i = 0; i < semitones.length-1; i++){
         for(let j = i+1; j < semitones.length; j++){
            if(semitones[i] == semitones[j]%12){
                  semitones.splice(j, 1);
                  break;
            }
         }
      }  
      console.log("non redundant semitones:");
      console.log(semitones);

      return semitones;

   } 

   function getThird(semitones){
      let rollingChord = "";

      //Major
      if(semitones.includes(4)){
         rollingChord = "major";
         semitones.splice(semitones.indexOf(4), 1);
     }
     //Minor
     else if(semitones.includes(3)){
         rollingChord = "minor";
         semitones.splice(semitones.indexOf(3), 1);
     }

     console.log(`quality: ${rollingChord}`);

     return rollingChord;
   }

   function getFifth(semitones, thirdQuality){
      let rollingChord = "-1";

      //Perfect
      if(semitones.includes(7)){
         semitones.splice(semitones.indexOf(7), 1);
         rollingChord = "";
      }
      //Diminished
      else if(semitones.includes(6)){
         if(thirdQuality == "minor"){
            rollingChord = String.fromCharCode(176);
         } else {
            rollingChord = "(b5)";
         }
         semitones.splice(semitones.indexOf(6), 1);
      }
      //Augmented
      else if(semitones.includes(8)){
         if(thirdQuality == "major"){
            rollingChord = "+";
         } else {
            rollingChord = "(#5)";
         }
         semitones.splice(semitones.indexOf(8), 1);
      }

      return rollingChord;
   }

   function getComplexExtension(semitones, fifthQuality){

      console.log("semitones upon entering getComplexExtensions: ");
      console.log(semitones);

      let extension = "";
      let amtOfComplexNotes = 0;
      let alterations = [];

      let base = 7;
      let alternator = 3;
      let currentExtension = 0;

      //7th is done manually because it determines if it's diminished or half diminished or neither
      if(semitones.includes(10)){
         if(fifthQuality == String.fromCharCode(176)){
            extension += String.fromCharCode(248);
         }
         extensionHelper(10);

         currentExtension = 7;
      }
      else if(semitones.includes(9) && fifthQuality == String.fromCharCode(176)){
         extension = String.fromCharCode(176);
         extensionHelper(9);

         currentExtension = 7;
      }

      function extensionHelper(semitone){

         base += alternator;

         //Flips alternator between 3 and four
         if(alternator == 3){
            alternator++;
         } else {
            alternator--;
         }

         amtOfComplexNotes++;
         currentExtension = (5 + (2*amtOfComplexNotes));

         semitones.splice(semitones.indexOf(semitone), 1);

      }

      console.log(`extension after dim/halfDim: ${extension}`);

      //eslint-disable-next-line
      while(true){

         console.log(`base(${base}) + alternator(${alternator}): ${base + alternator}`);

         if(semitones.includes(base + alternator)){ 

            extensionHelper(base + alternator); 

         } else {

            //Check to see if there's another complex note after this one, if not, don't do any of the below logic

            let preemptiveAlternator = 7;

            if(!(semitones.includes(base + preemptiveAlternator + 1) | 
            semitones.includes(base + preemptiveAlternator -1))){
               break;
            }

            if(semitones.includes(base + alternator - 1)){ 

               extensionHelper(base + alternator - 1);
               alterations.push("b" + currentExtension);
   
            }
            else if(semitones.includes(base + alternator + 1)){
               
               extensionHelper(base + alternator + 1);
               alterations.push("#" + currentExtension);
   
            } else { break; }

         }

      }

      if(amtOfComplexNotes > 0){
         extension += currentExtension.toString();
         if(alterations.length > 0){
            extension += "(";
            alterations.forEach((alteration) => {
               extension += alteration;
            });
            extension += ")";
         }
      }

      //Gets extensions like C13, C11b9, C15#11b9 etc
      // while(semitones.length > 0){
      //    if(semitones.includes(10)){

      //    }
      // }

      return extension;

   }

   function getExtension(semitone, mode){

      //Converts semitones above root to extension
      let extension = 0;
      let extensionSemitones = 0;
      while(extensionSemitones < semitone){

          if(mode[extension] == "T"){ extensionSemitones += 2; } 
          else { extensionSemitones ++ }

          extension++;
      }

      extension++;

      console.log(`extensionSemitones: ${extensionSemitones}`);
      console.log(`semitone: ${semitone}`);

      if(extensionSemitones > semitone){
         return "addb" + extension;
      } else {
         return "add" + extension;
      }
   }

   return {
      computeChords,
   }

}