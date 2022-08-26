#include <iostream>
#include <array>

/*Algorithm description*/
/*
Calculates how many chords can be used to display the inputted array size of notes
    For example, 6 would result 1 or 2, because you can display 6 notes as a result of 1 big chord of 6 notes or two little chords of 7 notes
    Does this by dividing the array size by 3, since math rounding in C is naturally floor rounding for integers, 0-2 results in 0, 3-5 results in 1, 6-8 results in 3 etc.
Calculates the sizes of those individual chords
    For example if you can display an array of notes in 1 chord, the size of that chord should be the size of the array of the notes
    If you can display the array of notes in 2 chords and the array of notes is of size 8, the size of the chords should be [3, 5], [4, 4] and [5, 3]
    Does this by recursion:
        base case: 
        sets first number to three

*/

int main(void){

    int notes;

    std::cin >> notes;

    std::cout << "note inputs of size " << notes << " can have: " << std::endl;
    for(int i = 0; i < notes/3; i++){

        int chords = i+1;
        std::cout << chords << " chords of size: ";

        for(int j = 0; j < (notes%3)+1; j++){ //Repeats with each array

            int chordSizes[chords];
            chordSizes[0] = (notes/chords) - j;

            for(int k = 1; k < chords; k++){
                chordSizes[k] = notes - chordSizes[0]*(chords-1);
            }

            // chordSizes[0] = (notes/chords) - j;
            // chordSizes[1] = notes - chordSizes[0];
            std::cout << "[";

            for(int k = 0; k < chords; k++){

                std::cout << chordSizes[k] << ", ";
                
            }

            std::cout << "]";
            // std::cout << "[" << chordSizes[0] << ", " << chordSizes[1] << "], [" << chordSizes[1] << ", " << chordSizes[0] << "], ";
        }

        std::cout << std::endl;
        std::cout << "or" << std::endl;
    }

    // for(int i = 0; i < (array.size()-1)/2; i++){
    //     for(int j = i+1; j < array.size(); j++){
    //         for(int k = j+1; k < array.size(); k++){
    //             std::cout << "[" << i << ", " << j << ", " << k << "], [";
    //             for(int l = 0; l < array.size(); l++){
    //                 if(!(i == l || j == l || k == l)){
    //                     std::cout << l << ", ";
    //                 }
    //             }
    //             std::cout << "]" << std::endl;
    //         }
    //     }
    // }

    return 0;

}

/*
[0, 1, 2], [3, 4, 5, ]
[0, 1, 3], [2, 4, 5, ]
[0, 1, 4], [2, 3, 5, ]
[0, 1, 5], [2, 3, 4, ]
[0, 2, 3], [1, 4, 5, ]
[0, 2, 4], [1, 3, 5, ]
[0, 2, 5], [1, 3, 4, ]
[0, 3, 4], [1, 2, 5, ]
[0, 3, 5], [1, 2, 4, ]
[0, 4, 5], [1, 2, 3, ]
[1, 2, 3], [0, 4, 5, ]
[1, 2, 4], [0, 3, 5, ]
[1, 2, 5], [0, 3, 4, ]
[1, 3, 4], [0, 2, 5, ]
[1, 3, 5], [0, 2, 4, ]
[1, 4, 5], [0, 2, 3, ]
*/