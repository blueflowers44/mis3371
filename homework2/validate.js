/*
File name: validate.js
Author: Asia Roy 
Date created: 02/09/2026
Date last edited: 02/11/2026
Version: 2.0
Description: HW2 validation + review display logic for patient registration form
*/
(function () {
"use strict";

/* ================= HELPERS ================= */

function $(id){ return document.getElementById(id); }

function setErr(id,msg){
  const el = $(id);
  if(el) el.textContent = msg || "";
}

function fmtMoney(n){
  return Number(n).toLocaleString("en-US",
    {style:"currency",currency:"USD",maximumFractionDigits:0});
}

function getRadioValue(name){
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : "";
}

function getCheckedValues(name){
  return Array.from(
    document.querySelectorAll(`input[name="${name}"]:checked`)
  ).map(x=>x.value);
}

/* ================= HEADER DATE ================= */

function setHeaderDate(){
  if(!$("currentDate")) return;
  const today = new Date();
  $("currentDate").textContent =
    today.toLocaleDateString("en-US",
      {weekday:"long",year:"numeric",month:"long",day:"numeric"});
}

/* ================= SALARY SLIDER ================= */

function wireSalary(){
  const slider = $("salary");
  const display = $("salaryDisplay");
  if(!slider || !display) return;

  function update(){
    display.textContent = fmtMoney(slider.value);
  }

  slider.addEventListener("input", update);
  update();
}

/* ================= DOB ================= */

function validateDOB(){
  setErr("err_dob","");

  const mm=$("dobMM").value.trim();
  const dd=$("dobDD").value.trim();
  const yy=$("dobYYYY").value.trim();

  if(!mm||!dd||!yy){
    setErr("err_dob","DOB required");
    return false;
  }

  const d=new Date(yy,mm-1,dd);
  if(d.getMonth()!=mm-1||d.getDate()!=dd){
    setErr("err_dob","Invalid date");
    return false;
  }

  if(d>new Date()){
    setErr("err_dob","DOB cannot be future");
    return false;
  }

  return true;
}

/* ================= PASSWORD ================= */

function validatePasswords(){
  setErr("err_pw1","");
  setErr("err_pw2","");

  const pw1=$("pw1").value;
  const pw2=$("pw2").value;

  if(pw1.length<8){
    setErr("err_pw1","Min 8 chars");
    return false;
  }

  if(!/[A-Z]/.test(pw1)||
     !/[a-z]/.test(pw1)||
     !/[0-9]/.test(pw1)){
    setErr("err_pw1","Need upper/lower/number");
    return false;
  }

  if(pw1!==pw2){
    setErr("err_pw2","Passwords must match");
    return false;
  }

  return true;
}

/* ================= ZIP ================= */

function validateZip(){
  setErr("err_zip","");
  const z=$("zip").value.trim();
  if(!/^\d{5}/.test(z)){
    setErr("err_zip","ZIP invalid");
    return false;
  }
  $("zip").value=z.substring(0,5);
  return true;
}

/* ================= RADIOS ================= */

function validateRadios(){
  let ok=true;

  if(!getRadioValue("housing")){
    setErr("err_housing","Choose one"); ok=false;
  }
  if(!getRadioValue("vax")){
    setErr("err_vax","Choose one"); ok=false;
  }
  if(!getRadioValue("ins")){
    setErr("err_ins","Choose one"); ok=false;
  }

  return ok;
}

/* ================= BASIC ================= */

function validateBasic(){
  const form=$("patientForm");
  if(!form.checkValidity()){
    form.reportValidity();
    return false;
  }
  return true;
}

/* ================= MASTER ================= */

function validateAll(){
  return validateBasic()
      && validateDOB()
      && validatePasswords()
      && validateZip()
      && validateRadios();
}

/* ================= REVIEW PANEL ================= */

function buildReview(){

  const name = `${$("firstName").value} ${$("middleInitial").value} ${$("lastName").value}`;
  const dob  = `${$("dobMM").value}/${$("dobDD").value}/${$("dobYYYY").value}`;
  const email = $("email").value;
  const phone = $("phone").value;

  const addr = `
    ${$("addr1").value}<br>
    ${$("addr2").value}<br>
    ${$("city").value}, ${$("state").value} ${$("zip").value}
  `;

  const history = getCheckedValues("hist").join(", ") || "None";
  const housing = getRadioValue("housing");
  const vax = getRadioValue("vax");
  const ins = getRadioValue("ins");

  const salary = fmtMoney($("salary").value);
  const userId = $("userId").value.toLowerCase();

  $("reviewArea").innerHTML = `
    <div class="review-row"><span>Name</span><span>${name}</span><span>OK</span></div>
    <div class="review-row"><span>DOB</span><span>${dob}</span><span>OK</span></div>
    <div class="review-row"><span>Email</span><span>${email}</span><span>OK</span></div>
    <div class="review-row"><span>Phone</span><span>${phone}</span><span>OK</span></div>
    <div class="review-row"><span>Address</span><span>${addr}</span><span>OK</span></div>
    <div class="review-row"><span>History</span><span>${history}</span><span>OK</span></div>
    <div class="review-row"><span>Housing</span><span>${housing}</span><span>OK</span></div>
    <div class="review-row"><span>Vaccinated</span><span>${vax}</span><span>OK</span></div>
    <div class="review-row"><span>Insurance</span><span>${ins}</span><span>OK</span></div>
    <div class="review-row"><span>Salary</span><span>${salary}</span><span>OK</span></div>
    <div class="review-row"><span>User ID</span><span>${userId}</span><span>OK</span></div>
  `;
}

/* ================= BUTTONS ================= */

function wireButtons(){

  $("patientForm").addEventListener("submit", function(e){
    if(!validateAll()){
      e.preventDefault();
      buildReview();
      alert("Submission blocked — fix errors");
    }
  });

  $("btnReview").addEventListener("click", function(){
    validateAll();
    buildReview();
  });

  $("btnReset").addEventListener("click", function(){
    setTimeout(()=>{
      document.querySelectorAll(".err")
        .forEach(e=>e.textContent="");
      $("reviewArea").innerHTML='<p class="muted">Click Review</p>';
      wireSalary();
    },0);
  });
}

/* ================= INIT ================= */

function init(){
  setHeaderDate();
  wireSalary();
  wireButtons();
}

document.addEventListener("DOMContentLoaded", init);

})();
