const letters=document.querySelectorAll('.scoreboardletter');
console.log(letters);
const loading=document.querySelector('.info');
const output=document.querySelector('.output');
const ANSWER_LENGTH=5;
const ROUNDS=6;
let done = false;
let isLoading=true;
async function init(){
    const res= await fetch('https://words.dev-apis.com/word-of-the-day');
    let {word}=await res.json()
    word=word.toUpperCase();
    wordParts=word.split("");
    setLoading(false);
    isLoading=false;
    console.log(word);
    let currentGuess='';
    let currentRow=0;
document.addEventListener('keydown',function handleKeypress(event){
    if(done || isLoading){
        return;
    }
    const action=event.key;
    console.log(action);

   if(action==='Enter'){
    commit();
   }
   else if(action==='Backspace'){
    backspace();
   }
   else if(isLetters(action)){
    addLetter(action.toUpperCase());
   }
   else{ 
    //do nothing
   }
})
function backspace(){
    currentGuess=currentGuess.substring(0,currentGuess.length-1);
}
async function commit(){
    if(currentGuess.length!==ANSWER_LENGTH){
        return;
    }
    isLoading=true;
    setLoading(true);
    const res=await fetch('https://words.dev-apis.com/validate-word',{
        method:"POST",
        body:JSON.stringify({word:currentGuess})
    })
    const resOBJ= await res.json();
    const {validWord}= resOBJ;
    console.log(validWord);

    isLoading=false;
    setLoading(false);
    if(!validWord){
     tellInvalidWord();
    }
    else{
        const map=makeMap(wordParts);
      const currentGuessCorrect=currentGuess.split("");
      for (let index = 0; index < ANSWER_LENGTH; index++) {
        if(currentGuessCorrect[index]===wordParts[index]){
        letters[currentRow*ANSWER_LENGTH + index].classList.add('correct');
        map[currentGuessCorrect[index]]--;
    }

    }

    for (let index = 0; index < ANSWER_LENGTH; index++) {
        if(currentGuessCorrect[index]===wordParts[index]){
            //do Nothing
        }
        else if(wordParts.includes(currentGuessCorrect[index]) && map[currentGuessCorrect[index]]>0){
            letters[ANSWER_LENGTH*currentRow+index].classList.add('close');
            map[currentGuessCorrect[index]]--;
            console.log(map);
        }
        else{
            letters[ANSWER_LENGTH*currentRow+index].classList.add('wrong');
            console.log(map);
        }
    
      }
      if(currentGuess===word){
        output.innerHTML="You Win";
        done=true;
    }
    
    currentGuess="";
    currentRow++;
    
    if(currentRow===ROUNDS){
          output.innerHTML=`You Lose,The Word was ${word}`;
        done=true;
      };

// console.log(map);
}




}
function backspace(){
    currentGuess=currentGuess.substring(0,currentGuess.length-1);
    letters[ANSWER_LENGTH*currentRow+currentGuess.length].innerHTML='';
}
function tellInvalidWord(){
    for(let i=0;i<ANSWER_LENGTH;i++){
        letters[currentRow * ANSWER_LENGTH+i].classList.remove("invalid");
    
        setTimeout(function(){
            letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid");
        },10);
    
    }
}
function isLetters(letter) {
    return /^[a-zA-Z]$/.test(letter);
}
function addLetter(letter){
    console.log(letter)
    if(currentGuess.length<ANSWER_LENGTH){
        currentGuess+=letter;
    }
    else{
        currentGuess=currentGuess.substring(0,currentGuess.length-1)+ letter
    }
    // console.log(currentGuess+" "+currentGuess.length);
    letters[ANSWER_LENGTH*currentRow+currentGuess.length-1].innerHTML=letter;

}
function makeMap(array){
    const obj={};
    for(let i=0;i<array.length;i++){
        if(obj[array[i]]){
            obj[array[i]]++
        }
        else{
            obj[array[i]]=1;
        }
    }
    return obj;

}
function setLoading(isLoading){
    loading.classList.toggle('hidden',!isLoading);
}
}
init();
