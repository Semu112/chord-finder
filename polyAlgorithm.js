
/*Algorithm description*/
/*
Calculates how many chords can be used to display the inputted array size of notes
    For example, 6 would result 1 or 2, because you can display 6 notes as a result of 1 big chord of 6 notes or two little chords of 7 notes
    Does this by dividing the array size by 3, since math rounding in C is naturally floor rounding for integers, 0-2 results in 0, 3-5 results in 1, 6-8 results in 3 etc.
Calculates the sizes of those individual chords
    For example if you can display an array of notes in 1 chord, the size of that chord should be the size of the array of the notes
    If you can display the array of notes in 2 chords and the array of notes is of size 8, the size of the chords should be [3, 5], [4, 4] and [5, 3]
    Does this by (recursion):
        base case: remainingAmtOfChords == 1
        looks at remainingNotes, if is greater than 6, sets number to 3, else sets it to remainingNotes

        Ex: 10
            [3, =>]
                [3, =>]
                    [4]
                    //Add to storage
                [4, =>]
                    [3]
                    //Add to storage
            [4, =>]
                [3, =>]
                    [3]
                    //Add to storage
        with code: 10
            [3, =>]
                [3, =>]
                    [4] //Base case, amtOfChordsRemaining = 0, return remainingNotes
                    //Add to storage
                [4, =>] //Increment 1 until remainingNotes = 3
                    [3]
                    //Add to storage
            [4, =>] //Increment 1 until remainingNotes = 6
                [3, =>]
                    [3]
                    //Add to storage

        with code: 10
            [3, =>]
                [3, =>]
                    [4] //Base case, amtOfChordsRemaining = 0, return remainingNotes
                    //Add to storage
                [4, =>] //Increment 1 until remainingNotes = amtOfChordsRemaining * 3
                    [3]
                    //Add to storage
            [4, =>] //Increment 1 until remainingNotes = amtOfChordsRemaining * 3
                [3, =>]
                    [3]
                    //Add to storage

        with code: 10
            int chordArray[amtOfChordsRemaining];
            int currentChordSize = 3;
            while(remainingNotes > amtOfChordsRemaining * 3){
                chordArray.push(currentChordSize);
                remainingNotes -= currentChordSize;
                chordArray.push(polyHelper(remainingNotes - currentChordSize, remainingAmtOfChords--, storage));

                currentChordSize++;
            }
                [3, =>]
                    [3, =>]
                        [4] //Base case, amtOfChordsRemaining = 0, return remainingNotes
                        //Add to storage
                    [4, =>] //Increment 1 until remainingNotes = amtOfChordsRemaining * 3
                        [3]
                        //Add to storage
                [4, =>] //Increment 1 until remainingNotes = amtOfChordsRemaining * 3
                    [3, =>]
                        [3]
                        //Add to storage

    Shouldn't actually return [3, 5] and [5, 3], in the chord finder they will result in the same thing, same with [3, 3, 4], [3, 4, 3] and [4, 3, 3]
    But, in the case where there are 11 notes, there should be [3, 3, 5] and [3, 4, 4]
    12, 
    [3, 3, 6], [3, 4, 5], [4, 4, 4]
    17: 
    [3, 3, 11], [3, 4, 10], [3, 5, 9], [3, 6, 8], [3, 7, 7]
    [4, 6, 7], [4, 5, 8], [4, 4, 9]
    [5, 5, 7], [5, 6, 6]
    25: 
    [3, 3, 19], [3, 4, 18], [3, 5, 17], [3, 6, 16], [3, 7, 15], [3, 8, 14], [3, 9, 13], [3, 10, 12], [3, 11, 11] t: 9, v: 9
    [4, 10, 11], [4, 9, 12], [4, 8, 13], [4, 7, 14], [4, 6, 15], [4, 5, 16], [4, 4, 17] >8 [4, 3, 18] t: 8, v: 7
    //minussing two off 18 because second dig was at 3
    >8 [5, 3, 17], [5, 4, 16] 8< [5, 5, 15], [5, 6, 14], [5, 7, 13], [5, 8, 12], [5, 9, 11], [5, 10, 10] t: 8, v: 6
    //Minussing an extra one off the last digit
    [6, 9, 10], [6, 8, 11], [6, 7, 12], [6, 6, 13] >8 [6, 5, 12], [6, 4, 13], [6, 3, 14] t: 7, 4
    //Minussing two off 16
    >8 [7, 5, 13], [7, 6, 13], <8 [7, 7, 12], [7, 8, 11], [7, 9, 10] t: 5, v: 3
    [8, 8, 10], >8 [8, 7, 11], [8, 6, 12], [8, 5, 12], [8, 4, 13], [8, 3, 14] t: 6, v: 1
    25: 
    [3, 3, 3, 16], [3, 3, 4, 15], [3, 3, 5, 14], [3, 3, 6, 13], [3, 3, 7, 12], [3, 3, 8, 11], [3, 3, 9, 10]
    [3, 4, 9, 9], [3, 4, 8, 10], [3, 4, 7, 11], [3, 4, 6, 12], [3, 4, 5, 13], [3, 4, 4, 14] >8, [3, 4, 3, 15]
    >8[3, 5, 3, 14], [3, 5, 4, 13],<8 [3, 5, 5, 12], [3, 5, 6, 11], [3, 5, 7, 10], [3, 5, 8, 9]
    [3, 6, 8, 8], [3, 6, 7, 9], [3, 6, 6, 10]>8, [3, 6, 5, 11], [3, 6, 4, 12], [3, 6, 3, 13] <8
    >8[3, 7, 3, 12], [3, 7, 4, 11], [3, 7, 5, 10], [3, 7, 6, 9],<8 [3, 7, 7, 8] >>8
    [3, 8, 7, 7], [3, 8, 6, 8], [3, 8, 5, 9], [3, 8, 4, 10], [3, 8, 3, 11]
    [3, 9, 3, 10], [3, 9, 4, 9], [3, 9, 5, 8], [3, 9, 6, 7]
    [3, 10, 6, 6], [3, 10, 5, 7], [3, 10, 4, 8], [3, 10, 3, 9]
    [3, 11, 3, 8], [3, 11, 4, 7], [3, 11, 5, 6]
    [3, 12, 5, 5], [3, 12, 4, 6], [3, 12, 3, 7]
    [3, 13, 3, 6], [3, 13, 4, 5]
    [3, 14, 4, 4], [3, 14, 3, 5]
    [3, 15, 3, 4]
    [3, 16, 3, 3] << 88
    [4, 3, 3, 15], [4, 3, 4, 14], [4, 3, 5, 13], [4, 3, 6, 12], [4, 3, 7, 11], [4, 3, 8, 10], [4, 3, 9, 9]
    [4, 4, 8, 9], [4, 4, 7, 10], [4, 4, 6, 11], [4, 4, 5, 12], [4, 4, 4, 13], [4, 4, 3, 14]
    [4, 5, 3, 13], [4, 5, 4, 12], [4, 5, 5, 11], [4, 5, 6, 10], [4, 5, 7, 9], [4, 5, 8, 8]

    ---
    NON REDUNDNANTS
    [3, 3, 3, 16], [3, 3, 4, 15], [3, 3, 5, 14], [3, 3, 6, 13], [3, 3, 7, 12], [3, 3, 8, 11], [3, 3, 9, 10]
    [3, 4, 9, 9], [3, 4, 8, 10], [3, 4, 7, 11], [3, 4, 6, 12], [3, 4, 5, 13], [3, 4, 4, 14]
    [3, 5, 5, 12], [3, 5, 6, 11], [3, 5, 7, 10], [3, 5, 8, 9]
    [3, 6, 8, 8], [3, 6, 7, 9], [3, 6, 6, 10]
    [3, 7, 7, 8]
    [4, 7, 7, 7], [4, 7, 6, 8], [4, 7, 5, 9], [4, 7, 4, 10]
    [4, 6, 4, 11], [4, 6, 5, 10], [4, 6, 6, 9]
    [4, 5, 8, 8]
    [4, 4, 8, 9]

    [4, 5, 5, 11], [4, 5, 6, 10], [4, 5, 7, 9], [4, 5, 8, 8]




    What if you just had a recursive call that activated on the sub array?
    like, for [3, 3, 3, 16], you would call the iterator function on [3, 3, 16] and then on [3, 16] and just return [3, 3, ?, ?] for every iteration
    //ONLY CALL HELPER FOR MULTIPLE CHORDS, WILL SEG FAULT WITH 1 CHORD IN CHORD ARRAY
    //FIRST CALL TO HELPER SHOULD HAVE prev = 3 and increase = 1
            helper(array, prev, start, length){
                if(length-1 - start > 2){
                    helper(array, array[start], start+1, length);
                    array[start]++;
                } else {
                    //Do the skippy thing starting at prev
                    if(array[start+1] - array[start] > 1){
                        array[start+1]--;

                        while(array[start] > prev){
                            array[start+1]--;
                            array[start]++;

                            console.log(array);
                        }
                        //decrease skippy
                    } 
                    else {
                        if(array[start+1] - array[start] == 1){
                            array[start+1]--;
                        } else {
                            array[start]--;
                        }

                        while(array[start+1] - array[start] > 1){
                            array[start]++;
                            array[start+1]--;

                            console.log(array);
                        }
                        //increase skippy
                    }
                    //Prev = 3 initially (in initial call to helper)
                }
            }

    New algorithm:
            Gets to the end value, [6] of [3, 3, 6], and minusses 1 off there and puts it in the adjaent position, becomes [3, 4, 5], then does it again, [3, 5, 4], which becomes [4, 4, 4]
            Once next number has been reached, go up again on the next two ints, for example, once [4, 6, 7] has been reached, go [4, 5, 8] then [4, 5, 9]
            Whenever a number increases, follow that increase down the line
            an increase from [3, 7, 7] to [4, 6, 7] would mean that you need to go back to the [6, 7] and go down until you hit 3 on the left index, i.e. [5, 8], [4, 9], [3, 10], so it would become [4, 5, 8], [4, 4, 9], [4, 3, 10]
            An increase from [4, 6, 5, 5, 5] to [5, 5, 5, 5, 5] would mean your next move should be [5, 4, 6, 5, 5]
*/

function polyHelper(array, prev, start, length){

    if(length - start > 2){
        let endIndex = Math.floor(array[length-1]/2);
        console.log(`endIndex: ${endIndex}`);

        while(array[start] <= endIndex){
            polyHelper(array, array[start], start+1, length);
            array[start]++;

            if(array[start+2] - array[start+1] == 1){
                array[start+2]--;
            } else {
                array[start+1]--;
            }
        }

    } else {

        console.log(`skippy checked`);
        console.log(array);

        //Do the skippy thing starting at prev
        if(array[start+1] - array[start] <= 1){

            //decrease skippy
            while(array[start] > prev){

                array[start]--;
                array[start+1]++;

                console.log(array);
            }
        } 
        else {

            //increase skippy
            while(array[start+1] - array[start] > 1){

                array[start]++;
                array[start+1]--;

                console.log(array);
            }
        }
    }
}

/*function polyHelper(remainingNotes, remainingAmtOfChords, storage/*, curChordArray){

    console.log(`remainingNotes: ${remainingNotes}`);

    if(remainingAmtOfChords <= 1){
        // curChordArray.push(remainingNotes);
        // storage[storage.length] = curChordArray;
        console.log(`storage.length: ${storage.length}, storage[storage.length-1]: ${storage[storage.length-1]}`);
        storage[storage.length-1].push(remainingNotes);
        // curChordArray.splice(0, curChordArray.length);
        return;
    }

    let currentChordSize = 3;
    while(remainingNotes-currentChordSize >= (remainingAmtOfChords-1) * 3){
        // curChordArray.push(currentChordSize);
        storage[storage.length-1].push(currentChordSize);
        polyHelper(remainingNotes - currentChordSize, remainingAmtOfChords-1, storage/*, curChordArray);
        storage.push([]);

        currentChordSize++;
    }

}*/

function computePossibilities(notes){
    let amtOfChords;
    for(let i = 1; i < Math.floor(notes.length/3); i++){
        amtOfChords = i+1;
        console.log(`amtOfChords: ${amtOfChords}`);

        let chordArray = [];
        let theseNotes = notes.length;

        //Pushes [3, 3, 5] onto chordArray, i.e. eveything 3s except the last one which has the remainder
        for(let j = 0; j < amtOfChords-1; j++){
            chordArray.push(3);
            theseNotes -= 3;
        } 
        chordArray.push(theseNotes);

        // console.log(chordArray);

        polyHelper(chordArray, 3, 0, amtOfChords);

        //Primitive algorithm, I think
        //Repeat with each int in chordArray, starting at the end
        // for(let j = i; j > 0; j--){

        //     //Minussing 1 
        //     while((chordArray[j-1] + 1) <= (chordArray[j]-1)){
        //         chordArray[j-1]++;
        //         chordArray[j]--;
        //         console.log(chordArray);
        //     }

        //     //On finish
        // }
        // let curChordArray = [];

        // console.log(`calling with ${notes.length}, ${amtOfChords}, ${storage}`);
        // polyHelper(notes.length, amtOfChords, storage/*, curChordArray*/);

        // console.log("storage: ");
        // console.log(storage);
    }
    // checkChord(indexes);
}

//eslint-disable-next-line
function checkChord(indexes){
    console.log(`checking: ${indexes}`);
}

computePossibilities([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]);