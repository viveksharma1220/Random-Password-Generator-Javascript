const inputSlider = document.querySelector("[data-lengthSlider]"); 
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-displayPassword]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");

const upperCaseCheck=document.querySelector("#uppercase");
const lowerCaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");

const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
// const allCheckBox=document.querySelector("input[type=checkbox]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols='~`!@#$%^&*()_+-={}[]|;:"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//set strength circle to grey


//set password length
function handleSlider(){
   inputSlider.value=passwordLength;
   lengthDisplay.innerText=passwordLength;
}

function setIndicator(color){
  indicator.style.backgroundColor=color;
  //shadow
}
function getRndInt(min,max){
   return Math.floor(Math.random()* (max-min))+min;
}

function generateRandomNumber(){
    return getRndInt(0,9);
}

function generateLowerCase(){
   return String.fromCharCode(getRndInt(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInt(65,91));
}
function generateSymbols(){
       const randNum=getRndInt(0,symbols.length);
       return symbols.charAt(randNum);
}
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(upperCaseCheck.checked) hasUpper=true;
    if(lowerCaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true; 
    
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    } else if(
        (hasLower || hasUpper)&&
        (hasNum || hasSym)&&
        passwordLength>=6
    ){
      setIndicator("#0ff0");
    }
    else{
        setIndicator("#0f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    //fisher yates method-:algo
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[i]=temp;
    }
    let str="";
    array.forEach((el)=>(str += el));
    return str;

}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
         checkCount++;
    });
    //speical condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})




inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider(); 
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
      copyContent(); 
})

generateBtn.addEventListener('click',()=>{
   //none of the checkbox are selected 
   if(checkCount==0) 
       return;
   //special case
   if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
   }

//    let's start the journey to find new password 
      //remove old password
      password="";

      //let's put the  stuff mentioned by checkboxes
    //   if(upperCaseCheck.checked){
    //     password+= generateUpperCase();
    //   }
    //   if(lowerCaseCheck.checked){
    //     password+= generateLowerCase();
    //   }
    //   if(numbersCheck.checked){
    //     password+= generateRandomNumber();
    //   }
    //   if(symbolsCheck.checked){
    //     password+= generateSymbols();
    //   }
    let funcArr=[];

    if(upperCaseCheck.checked){
        funcArr.push(generateUpperCase); 
    }
    if(lowerCaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }
    
    //complsory addition
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    //remaining additon
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIdx=getRndInt(0,funcArr.length);
        password+=funcArr[randIdx]();
    }
    //shiffle the password
    password=shufflePassword(Array.from(password));
    //pasword display
    passwordDisplay.value=password;
    //calculate strength function 
    calcStrength();
});