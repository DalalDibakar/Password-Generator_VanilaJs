const display = document.querySelector("#display-password");
const copy = document.querySelector("#copy");
const tick = document.querySelector("#tick");
const text = document.querySelector("#text");
const pass_len = document.querySelector(".length-var");
const p_length = document.querySelector("#p-length");
const checkbox = document.querySelectorAll(".checkbox");
const indicator = document.querySelector(".strength-indicator");
const submit = document.querySelector("#generator");
let array_of_fun = [];
let password_length, check_count;

window.addEventListener("load", () => {
  array_of_fun.push(onlyNumber);
  password_length = 10;
  check_count = 1;
});

// random range function
let randomRange = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// generating randomly number
let onlyNumber = () => randomRange(0, 10);

// generating randomly number upper case character
let onlyUpperCase = () => {
  let number = randomRange(65, 91);
  let upper = String.fromCharCode(number);
  return upper;
};

// generating randomly number lower case character
let onlyLowerCase = () => {
  let number = randomRange(97, 123);
  let lower = String.fromCharCode(number);
  return lower;
};

// generating randomly symbol
let onlySymbol = () => {
  let symbols = '"`~!@#$%^&*())_+-=[]{}|;:?/>.<,';
  let symbol = symbols.charAt(randomRange(0, symbols.length));
  return symbol;
};

// checkbox handeling

let handleCheckbox = function () {
  if (this.checked) {
    if (this.name === "number") 
      array_of_fun.push(onlyNumber);
     
    if (this.name === "uppercase") 
      array_of_fun.push(onlyUpperCase);
     
    if (this.name === "lowercase") 
      array_of_fun.push(onlyLowerCase);
     
    if (this.name === "symbol")
      array_of_fun.push(onlySymbol);
    
    check_count++;
  } else {
    let mapping_object = {
      number: "onlyNumber",
      uppercase: "onlyUpperCase",
      lowercase: "onlyLowerCase",
      symbol: "onlySymbol",
    };
    for (const key in array_of_fun) {
      if (array_of_fun[key].name === mapping_object[this.name]) {
        // console.log(typeof(key));
        for (let j = parseInt(key); j < array_of_fun.length - 1; j++) {
          array_of_fun[j] = array_of_fun[j + 1];
        }
        check_count--;
        array_of_fun.length--;
        break;
      }
    }
  }
  // console.log(check_count);
  // console.log(array_of_fun);
  // array_of_fun.forEach((n) => console.log(n));
};

for (const checkitem of checkbox) {
  checkitem.addEventListener("change", handleCheckbox);
}

// copy to clipboard
let copyText = async () => {
  // Select the text field
  display.select();
  let content = display.value;
  if (content != "") {
    try {
      // Copy the text inside the text field
      await navigator.clipboard.writeText(content);
      tick.style.cssText = "opacity: 1;color: blue";
      text.style.cssText = "opacity: 1;color: blue";
    } catch (e) {
      console.log(e);
    }
  }
};

// Slider controling
let controlSlider = () => {
  let value = p_length.value;
  pass_len.innerText = value;
  password_length = value;
  // console.log(password_length);
};

// Generating password
let generatePassword = () => {
  if (password_length < check_count) {
    alert("Password length is smaller than the items selected");
    password_length = check_count;
    p_length.value = check_count;
    pass_len.innerText = check_count;
  } 
  if (check_count === 0) {
    alert("Please select one item from below");
    return false;
  }
  let final_result = "";
  let functionToBeExecuted;
  for (let i = 0; i < password_length; i++) {
    functionToBeExecuted = array_of_fun[randomRange(0, check_count)];
    final_result += functionToBeExecuted();
  }
  // make sure all the checkbox items is present in password
  let display_condition = validatePassword(final_result);
  if (display_condition) {
    display.value = final_result;
    tick.style.cssText = "opacity: 0;";
    text.style.cssText = "opacity: 0;";
    let strength = strengthCheck(final_result);
    let old_style = "height: 20px;width: 20px; border-radius: 999px;"
    if(strength)
      indicator.style.cssText = old_style + "background-color: rgb(15, 197, 15);"
    else
      indicator.style.cssText = old_style + "background-color: red;"
    return true;
  }
  // console.log("False case");
  generatePassword();
};

// Validating password
function validatePassword(password){
  let condition = true;
  for (const fun of array_of_fun) {
    if(fun.name==="onlyNumber"){
      // console.log("From number validation part");
      if(!password.match(/[0-9]/g)){
        condition = false;
        break;
      }
    }
    if(fun.name==="onlyUpperCase"){
      // console.log("From uppercase validation part");
      if(!password.match(/[A-Z]/g))
      {
        condition = false;
        break;
      }
    }
    if(fun.name==="onlyLowerCase"){
      // console.log("From lowercase validation part");
      if(!password.match(/[a-z]/g))
      {
        condition = false;
        break;
      }
    }
    if(fun.name==="onlySymbol"){
      // console.log("From symbol validation part");
      if(!password.match(/[^a-zA-Z0-9\d]/g))
      {
        condition = false;
        break;
      }
    }
  }
  return condition;
};

function strengthCheck(password) {
  // console.log("From strengthCheck function");
  if(check_count > 2 && password.length > 7)
    return true;
  else
    return false;  
  
}