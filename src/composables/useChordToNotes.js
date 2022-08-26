/*eslint no-unused-vars: "off"*/
/*eslint no-constant-condition: "off"*/

export function useChordToNotes(allNotes, modes, data, keyboard, other, alertsDiv){

    function sanitise(input){
        input = input.replace(/(added)/, "add");
        input = input.replace(/((?<!(di|Di|dI|DI))(m))(?!(a|A|i|I))/, "min");
        input = input.replace(/((?<!(di|Di|dI|DI))(M))(?!(i|I|a|A))/, "maj");

        let augRegex = /(augmented)|(aug)|(#5)|(b6)/i;
        //Dim needs to go first because otherwise it will take the m out and think its minor
        if(augRegex.test(input)){
            input = input.replace(augRegex, "+");
        }

        let dimRegex = /(b5)|(diminished)|(#4)/i;
        if(dimRegex.test(input)){
            input = input.replace(dimRegex, "dim");
        }

        //Makes sure that Caddb9 doesn't become Caddbadd9
        // if(!(/(add)/.test(input))){
        //     let extenRegex = /(?<!([A-G]|(v)))(#|b)?[0-9]+/i;
        //     if(extenRegex.test(input)){
        //         input = input.replace(extenRegex, "add" + extenRegex.exec(input)[0]);
        //     }
        // }

        let accidentalRegex = /(?<!(ad))[A-G](#|b)/gi;
        if(accidentalRegex.test(input)){

            let accidentalMatches = input.match(accidentalRegex);

            for(let match of accidentalMatches){

                let noAccidental = match[0].toUpperCase();
                let accidental = match[1];

                let accidentalMatch;

                if(accidental == "#"){
                    accidentalMatch = allNotes.value[(allNotes.value.indexOf(noAccidental)+1)%12];
                } else {
                    accidentalMatch = allNotes.value[(allNotes.value.indexOf(noAccidental)+11)%12];
                }

                input = input.replace(match, accidentalMatch);

            }

        }

        let majorRegex = /(major)|(maj)/i;
        if(majorRegex.test(input)){
            input = input.replace(/^[a-g]/i, input[0].toUpperCase());
            input = input.replace(/(major)/, "maj");
        }

        let minorRegex = /(minor)|((?<!(di))(min))/i;
        if(minorRegex.test(input)){
            input = input.replace(/^[a-g]/i, input[0].toLowerCase());
            input = input.replace(/(minor)/, "min");
        }

        console.log("sanitised: " + input);

        return input
    }

    function scaleDegreeToSemitone(semitone, mode){
        
        semitone = "" + semitone;
        
        let number = semitone.match(/[0-9]+/)[0];
        let accidental = "";

        let accidentalCheckRegex = /(#|b)/;
        if(accidentalCheckRegex.test(semitone)){
            accidental = semitone.match(accidentalCheckRegex)[0];
        }

        let extensionSemitones = 0;

        if(accidental == "#"){
            extensionSemitones++;
        }
        else if(accidental == "b"){
            extensionSemitones--;
        }

        for(let i = 0; i < number-1; i++){

            if(modes.value[mode][i%7] == "T"){
                extensionSemitones += 2;
            } else {
                extensionSemitones ++;
            }

        }

        return extensionSemitones;
    }

    function chordToNotes(chord){

        console.log(`chord: ${chord}`);

        let initTimeObj = new Date();
        let initTime = initTimeObj.getTime();

        other.resetClass("computed");
        data.value.omissions = [];

        // chord = sanitise(chord);

        //Remove activity from old notes

        //Polychord support
        let chords = chord.split("_");

        for(let i in chords){

            chords[i] = numeralsToChord(chords[i], data.value.advanced.key, data.value.advanced.mode);
            console.log(`chord: ${chords[i]}`);

            //Finds a-g (case insensitive) followed by zero or one occurences of # or b
            let scaleKeyRegex = /[A-G]b?/i;
            let scaleKeyMatch = "don't understand";
            if(scaleKeyRegex.test(chords[i])){
                scaleKeyMatch = chords[i].match(scaleKeyRegex)[0];
            }

            let root = scaleKeyMatch[0];
            root = root.toUpperCase();
            root += scaleKeyMatch.slice(1);

            //Is valid input
            if(!(allNotes.value.indexOf(root) == -1)){

                root += `${4-i}`;

                let semitones = getSemitones(chords[i]);

                let notes = semitonesToNotes(semitones, root);

                other.activateNotes(notes, "computed");

                //Adds all to data structure
                data.value.semitones = semitones;
                data.value.notes.computed = notes;

                // console.log(`Chord after finished: ${chord}`);
                // console.log(chord);

            } else {
                console.log("invalid input");
            }

        }

        let endTimeObj = new Date();
        let endTime = endTimeObj.getTime();

        console.log(`~${endTime - initTime}ms`);
    }

    // ---- Compute notes

    function getSemitones(chord){
        let semitones = [];

        data.value.semitones = [];
        alertsDiv.value.innerHTML = "";
        

        //scale.key
        semitones.push(0);

        //Third (major or minor)
        let third;

        let susRegex = /(?<=(sus))(#|b)?[0-9]+/i;
        if(susRegex.test(chord)){
            let sus = chord.match(susRegex)[0];

            // chord = chord.replace(/(sus)b?[0-9]+/, "");

            // console.log(`sus: ${sus}`);
            // console.log(`chord.match(susRegex):`);
            // console.log(chord.match(susRegex));

            if(!(sus == 2 || sus == 4)){
                other.alert("sus" + sus + " chords don't technically exist or are used very sparsely");
            }

            let mode = other.getQuality(chord);
            third = scaleDegreeToSemitone(sus, mode);

        } else {

            let majorOrMinorRegex = /(^[a-g])|(dim)|(°)|(ø)/;
            if(majorOrMinorRegex.test(chord)){
                third = 3;
            } else {
                third = 4;
            }

        }

        semitones.push(third);

        //Fifth
        let fifth = 7;

        let augDimCheckRegex = /((\+)(?![0-9]+))|(dim)|(°)|(ø)/i;
        if(augDimCheckRegex.test(chord)){

            let augDimCheckMatch = chord.match(augDimCheckRegex)[0];
            // chord = chord.replace(augDimCheckMatch, "");
            if(augDimCheckMatch == "+"){
                fifth = 8;
            } else {
                fifth = 6;
            }
        }

        semitones.push(fifth);

        semitones = checkExtension(chord, semitones);
        semitones = checkInversion(chord, semitones);
        semitones = checkSlashChord(chord, semitones);

        return semitones
    }

    function numeralsToChord(chord, key, mode){

        //Computes integer from roman numerals, only supports i and v
        let numeralsRegex = /((i)|(v))+/i;
        if(numeralsRegex.test(chord)){

            let integer;

            let numeralsMatch = chord.match(numeralsRegex)[0];

            let onesRegex = /i+/i;
            let onesMatch = [];
            if(onesRegex.test(numeralsMatch)){
                onesMatch = numeralsMatch.match(onesRegex)[0];
            }

            let vRegex = /v/i;
            if(vRegex.test(numeralsMatch)){

                let onesBeforeFiveRegex = /(?<=(i))(V)/i;
                let onesAfterFiveRegex = /(V)(?=(i))/i;
                if(onesBeforeFiveRegex.test(numeralsMatch)){
                    integer = 5-onesMatch.length;
                } else {
                    integer = 5+onesMatch.length;
                }

            } else {
                integer = onesMatch.length;
            }

            //Converts to chord
            let keyIndex = allNotes.value.indexOf(key);
            let chordIndex = scaleDegreeToSemitone(keyIndex + integer, mode);
            let computedChord = allNotes.value[chordIndex];

            let lowercaseRegex = /^[a-z]/;
            if(numeralsMatch.match(lowercaseRegex)){
                computedChord = computedChord.toLowerCase();
            }

            chord = chord.replace(numeralsRegex, computedChord);

        }

        return chord;

    }

    function checkExtension(chord, semitones){

        //Checks for add followed by numbers
        let checkAddExtensions = /(?<=add)((#|b)?([0-9]+))/i;
        let quality = other.getQuality(chord);

        if(checkAddExtensions.test(chord)){

            //Figures out the extension by getting the scale and moving through that scale's tone pattern as defined above

            //Recomputes whether it is minor or major

            let match = chord.match(checkAddExtensions)[0];
            console.log(`match: ${match}`);
            console.log(`replaced: ${chord.replace(/(add)(#|b)?[0-9]+/i, "")}`);
            chord = chord.replace(/(add)(#|b)?[0-9]+/i, "");

            let extensionSemitones = scaleDegreeToSemitone(match, quality);

            semitones.push(extensionSemitones);

        }

        let checkBigExtensions = /(?<!(add))(?<!(\+))(((maj)|(dim)|(°)|(ø))?[0-9]+)(((b|#)[0-9]+)+)?/i;
        if(checkBigExtensions.test(chord)){

            console.log(`chord: ${chord}`);
            console.log(`extension match: `);
            console.log(chord.match(checkBigExtensions));

            let extension = chord.match(checkBigExtensions)[0];
            let extensionNumber = extension.match(/[0-9]+/)[0];          

            //If is odd and above 6
            if(extensionNumber%2 == 1 && extensionNumber > 6){
                let amtOfThirds = Math.ceil((extensionNumber-6)/2);

                console.log(`extension: `);
                console.log(extension);

                let seventh = 10;
                //7th (major or minor)
                if(extension.includes("maj")){
                    seventh = 11;
                }
                else if(extension.includes("dim") || extension.includes("°")){
                    seventh = 9;
                }

                semitones.push(seventh);

                // for(let i = 0; i < alterations.length; i++){
                //     if(alterations[i].includes("7")){
                //         if(alterations[i].includes("+")){
                //             semitones.push(seventh+1);
                //         } else {
                //             semitones.push(seventh-1);
                //         }
                //     }
                // }

                amtOfThirds--;

                let scalePos = -1;
                let currentSemitone = 11;

                //Up one the first time, then more after that
                //9th
                // if(amtOfThirds > 0){
                //     if(modes.value[quality][scalePos%(modes.value[quality].length)] == "T"){
                //         currentSemitone += 2;
                //     }  else {
                //         currentSemitone++;
                //     }

                //     semitones.push(currentSemitone);
                //     scalePos++;
                //     amtOfThirds--;
                // }

                //Alterations
                let alterationsRegex = /((#|b)[0-9]+)/g;
                let alterations = [];
                if(alterationsRegex.test(chord)){
                    alterations = chord.match(alterationsRegex);
                    
                    console.log(`alterations: `);
                    console.log(alterations);
                }

                //Everything else
                for(let i = 0; i < amtOfThirds; i++){
                    for(let j = 0; j < 2; j++){
                        // console.log(`scalePos: ${scalePos%(modes.value[quality].length)}`)
                        // console.log(modes.value[quality]);
                        // console.log(`modes.value[quality][scalePos%(modes.value[quality].length)]: ${modes.value[quality][scalePos%(modes.value[quality].length)]}`);

                        if(modes.value[quality][scalePos%(modes.value[quality].length)] == "T"){
                            currentSemitone += 2;
                        }  else {
                            currentSemitone++;
                        }

                        // console.log(`current semitone: ${currentSemitone}`)
                        scalePos++;
                    }

                    //If is a dominant 13th chord and we are looking at the 11th
                    if(extensionNumber == 13 && i == 0){
                        let root = other.getRoot(chord);
                        let omittedNote = semitonesToNotes([currentSemitone], root)[0];

                        //Calculates third
                        let semitonesOfThird = 0;
                        for(let i = 0; i < 2; i++){
                            if(modes.value[quality][i] == "T"){
                                semitonesOfThird += 2;
                            } else {
                                semitonesOfThird++;
                            }
                        }

                        let third = semitonesToNotes([semitonesOfThird], root);

                        data.value.omissions.push({
                            note: "11th(" + omittedNote + ")",
                            reason: " it can clash with the third(" + third + ")"
                        });
                    }

                    let goneIn = false;

                    console.log(`alteration: ${9 + 2*i}`);
                    console.log(`For loop start --------------`);
                    console.log(`alterations.length: ${alterations.length}`);
                    for(let k in alterations){

                        console.log(`Checking alteration ${k}: ${alterations[k]}`);
                        console.log(`${alterations[k]} includes ${9 + 2*i}?: ${alterations[k].includes(9+2*i)}`);

                        if(alterations[k].includes(9 + 2*i)){

                            console.log(`alteration found at index ${k}: ${alterations[k]}`)
                            //Adds sharped or flattened alterations
                            if(alterations[k].includes("#")){
                                semitones.push(currentSemitone+1);
                            }
                            else if(alterations[k].includes("b")){
                                semitones.push(currentSemitone-1);
                            }
                            goneIn = true;

                            //Remove element from alterations
                            alterations.splice(k, 1);
                            break;
                        }
                    }
                    console.log(`for loop end ----------`);

                    // console.log(`found semitone: ${currentSemitone}`);
                    if(!goneIn){
                        semitones.push(currentSemitone);
                    }
                }

                alterations.forEach((alteration) => {
                    semitones.push(scaleDegreeToSemitone(alteration, quality));
                })
                // console.log(`amtOfThirds: ${amtOfThirds}
                // semitones:`);
                // console.log(semitones);

                chord = chord.replace(checkBigExtensions, "");
            }
        }

        let checkOtherExtensions = /(6\/9)/i;
        if(checkOtherExtensions.test(chord)){
            semitones.push(scaleDegreeToSemitone(6), quality);
            semitones.push(scaleDegreeToSemitone(9), quality);

            chord = chord.replace(checkOtherExtensions, "");
        }

        return semitones;
    }

    function checkInversion(chord, semitones){
        let inversionRegex = /(?<=inv)[0-9]+/i;

        if(inversionRegex.test(chord)){

            let inversion = chord.match(inversionRegex)[0];
            chord = chord.replace(/(inv)[0-9]+/i, "");

            //Inversion algorithm, rotates array to the right and adds 12 to the last element (moving it up an octave)
            for(let i = 0; i < inversion; i++){

                let temp = semitones[0];

                for(let j = 0; j < semitones.length-1; j++){

                    semitones[j] = semitones[j+1];

                }

                semitones[semitones.length-1] = temp + 12;

            }

        }

        return semitones;
    }

    function checkSlashChord(chord, semitones){
        //SlashChord: checks for a '/' followed by [a-g](case insensitive), optionally followed by a # or b in input
        let slashChord = /(?<=(\/))[A-G]b?/i;

        if(slashChord.test(chord)){

            //Uppercases only the first letter
            let rootNoteRegex = /^[A-G]b?/i;
            let rootMatch = chord.match(rootNoteRegex)[0];
            let root = rootMatch[0].toUpperCase();
            root += rootMatch.slice(1);

            //Uppercases only the first letter
            let slashMatch = chord.match(slashChord)[0];
            let slashNote = slashMatch[0].toUpperCase();
            slashNote += slashMatch.slice(1);

            chord = chord.replace(/\/[A-G]b?/i, "");

            let slashNoteIndex = allNotes.value.indexOf(slashNote);

            let slashNoteDifference = allNotes.value.indexOf(root) - slashNoteIndex;

            //If bass note is higher than scale.key, lower bass note by an octave, plus because it gets minussed later
            if(slashNoteDifference <= 0){
                slashNoteDifference += 12;
            }

            semitones.unshift(0-slashNoteDifference);
        }

        return semitones;
    }

    // -----

    function semitonesToNotes(semitones, root){

        if(!(/[0-9]/.test(root))){
            console.log("octave must be supplied to root");
        }

        let rootNote = root.match(/\D*/)[0];
        let rootOctave = parseInt(root.match(/[0-9]+/)[0]);

        let notes = [];

        semitones.forEach(step => {

            let octave = rootOctave;
            let index = allNotes.value.indexOf(rootNote) + step;

            // //If note is off screen
            // let octavesAbove = Math.floor(this.myData[this.activeFinder].numberOfOctaves/2)+1;
            // let octavesBelow = Math.floor((this.myData[this.activeFinder].numberOfOctaves-1)/2);
            // if(index >= octavesAbove * 12){
            //     console.log("off keyboard");
            // }
            // else if(index <= 0-(octavesBelow*12)){
            //     console.log("off keyboard");
            // }

            octave += Math.floor(index/12);

            if(index < 0){
                index = 12 - Math.abs(index);
            }

            let newNote = allNotes.value[index%12];
            newNote += octave;

            notes.push(newNote);
        })

        return notes;
    }

    return { chordToNotes }

}