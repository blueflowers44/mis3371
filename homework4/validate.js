/*
File name: validate.js
Author: Asia Roy 
Date created: 03/09/2026
Date last edited: 03/09/2026
Version: 4.0
Description: HW4 validation + review display logic for patient registration form
*/
(function () {

"use strict";

/* ================= FETCH STATES ================= */

async function loadStates(){

try{

const response = await fetch("states.txt");
const data = await response.text();

document.getElementById("state").innerHTML = data;

}

catch(error){

console.log("Error loading state list");

}

}

/* ================= HELPERS ================= */

function $(id){
return document.getElementById(id);
}

function setErr(id,msg){

const el = $(id);
if(el) el.textContent = msg || "";

}

/* ================= COOKIE FUNCTIONS ================= */

function setCookie(name,value,days){

const d = new Date();
d.setTime(d.getTime() + (days*24*60*60*1000));

document.cookie =
name + "=" + value +
";expires=" + d.toUTCString() +
";path=/";

}

function getCookie(name){

let cname = name + "=";

let decodedCookie = decodeURIComponent(document.cookie);
let ca = decodedCookie.split(';');

for(let i=0;i<ca.length;i++){

let c = ca[i];

while(c.charAt(0)==' '){
c = c.substring(1);
}

if(c.indexOf(cname)==0){
return c.substring(cname.length,c.length);
}

}

return "";

}

/* ================= LOCAL STORAGE ================= */

function saveLocal(id){

const el = $(id);

if(!el) return;

el.addEventListener("blur",function(){

localStorage.setItem(id,el.value);

});

}

function loadLocal(id){

const val = localStorage.getItem(id);

if(val && $(id)){
$(id).value = val;
}

}

/* ================= COOKIE CHECK ================= */

function checkUserCookie(){

const name = getCookie("firstName");

if(name!=""){

document.querySelector("#header h1").innerText =
"Welcome back, " + name;

if($("firstName")){
$("firstName").value = name;
}

}else{

document.querySelector("#header h1").innerText =
"Welcome New User";

}

}

/* ================= FORMAT MONEY ================= */

function fmtMoney(n){

return Number(n).toLocaleString("en-US",{
style:"currency",
currency:"USD",
maximumFractionDigits:0
});

}

/* ================= RADIO + CHECKBOX HELPERS ================= */

function getRadioValue(name){

const el =
document.querySelector(`input[name="${name}"]:checked`);

return el ? el.value : "";

}

function getCheckedValues(name){

return Array.from(
document.querySelectorAll(`input[name="${name}"]:checked`)
).map(x=>x.value);

}

/* ================= ZIP HELPER ================= */

function only5Zip(zip){

const m = String(zip).match(/^(\d{5})/);
return m ? m[1] : "";

}

/* ================= HEADER DATE ================= */

function setHeaderDate(){

const today = new Date();
const target = $("currentDate");

if(!target) return;

target.textContent =
today.toLocaleDateString("en-US",{

weekday:"long",
year:"numeric",
month:"long",
day:"numeric"

});

}

/* ================= SALARY SLIDER ================= */

function wireSalary(){

const slider = $("salary");
const display = $("salaryDisplay");

if(!slider || !display) return;

const update = function(){

display.textContent = fmtMoney(slider.value);

};

slider.addEventListener("input",update);
update();

}

/* ================= DOB VALIDATION ================= */

function validateDOB(){

setErr("err_dob","");

const mm = ($("dobMM")?.value || "").trim();
const dd = ($("dobDD")?.value || "").trim();
const yy = ($("dobYYYY")?.value || "").trim();

if(!mm || !dd || !yy){

setErr("err_dob","DOB is required (MM/DD/YYYY).");
return false;

}

const month = Number(mm);
const day = Number(dd);
const year = Number(yy);

const dob = new Date(year,month-1,day);

if(

dob.getFullYear() !== year ||
dob.getMonth() !== (month-1) ||
dob.getDate() !== day

){

setErr("err_dob","DOB is not a valid calendar date.");
return false;

}

const today = new Date();
today.setHours(0,0,0,0);

if(dob > today){

setErr("err_dob","ERROR: DOB cannot be in the future.");
return false;

}

const min =
new Date(today.getFullYear()-120,today.getMonth(),today.getDate());

if(dob < min){

setErr("err_dob","ERROR: DOB cannot be more than 120 years ago.");
return false;

}

return true;

}

/* ================= PASSWORD VALIDATION ================= */

function validatePasswords(){

setErr("err_pw1","");
setErr("err_pw2","");

const pw1 = $("pw1")?.value || "";
const pw2 = $("pw2")?.value || "";

if(pw1.length < 8){

setErr("err_pw1","Password must be at least 8 characters.");
return false;

}

if(!/[A-Z]/.test(pw1) ||
   !/[a-z]/.test(pw1) ||
   !/[0-9]/.test(pw1)){

setErr("err_pw1",
"Password must include upper, lower, and number.");

return false;

}

if(pw1 !== pw2){

setErr("err_pw2","Passwords do not match.");
return false;

}

return true;

}

/* ================= ZIP VALIDATION ================= */

function validateZip(){

setErr("err_zip","");

const zipEl = $("zip");

if(!zipEl) return true;

const z = (zipEl.value || "").trim();

const five = only5Zip(z);

if(!five){

setErr("err_zip",
"ZIP is required (##### or #####-####).");

return false;

}

zipEl.value = five;

return true;

}

/* ================= RADIO VALIDATION ================= */

function validateRadios(){

setErr("err_housing","");
setErr("err_vax","");
setErr("err_ins","");

let ok = true;

if(!getRadioValue("housing")){
setErr("err_housing","Choose one.");
ok = false;
}

if(!getRadioValue("vax")){
setErr("err_vax","Choose one.");
ok = false;
}

if(!getRadioValue("ins")){
setErr("err_ins","Choose one.");
ok = false;
}

return ok;

}

/* ================= MASTER VALIDATE ================= */

function validateAll(){

const dob = validateDOB();
const zip = validateZip();
const radios = validateRadios();
const pw = validatePasswords();

return dob && zip && radios && pw;

}

/* ================= REVIEW PANEL ================= */

function buildReview(){

const reviewArea = $("reviewArea");

if(!reviewArea) return;

const first = $("firstName")?.value || "";
const last = $("lastName")?.value || "";

reviewArea.innerHTML =

`
<div class="review-row">

<span class="review-label">Name</span>
<span class="review-val">${first} ${last}</span>

</div>
`;

}

/* ================= LIVE VALIDATION ================= */

function wireLiveValidation(){

if($("email")){

$("email").addEventListener("blur",function(){

if(!this.checkValidity()){

setErr("err_email","Must be name@domain.tld");

}else{

setErr("err_email","");

}

});

}

}

/* ================= BUTTONS ================= */

function wireButtons(){

const btnValidate = $("btnValidate");
const btnSubmit = $("btnSubmit");

if(btnValidate){

btnValidate.addEventListener("click",function(){

const ok = validateAll();
buildReview();

if(ok){

const remember = $("rememberMe");

if(remember && remember.checked){

setCookie("firstName",$("firstName").value,2);

}

alert("All fields look good. You can now submit.");

btnSubmit.disabled = false;

}else{

alert("Please fix the highlighted errors.");

btnSubmit.disabled = true;

}

});

}

}

/* ================= INIT ================= */

function init(){

setHeaderDate();
wireSalary();
wireLiveValidation();
wireButtons();
loadStates();
checkUserCookie();

/* activate local storage */

[
"firstName",
"lastName",
"email",
"phone",
"city",
"zip"

].forEach(function(id){

saveLocal(id);
loadLocal(id);

});

}

document.addEventListener("DOMContentLoaded",init);

})();
