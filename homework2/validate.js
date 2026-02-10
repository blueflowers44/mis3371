/*
File name: validate.js
Author: Asia Roy 
Date created: 02/09/2026
Date last edited: 02/09/2026
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
  const today = new Date();
  $("currentDate").textContent =
    today.toLocaleDateString("en-US",
      {weekday:"long",year:"numeric",month:"long",day:"numeric"});
}

/* ================= DOB VALIDATION ================= */

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

  const today=new Date();
  if(d>today){
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

/* ================= RADIO GROUPS ================= */

function validateRadios(){
  let ok=true;

  if(!getRadioValue("housing")){
    setErr("err_housing","Choose one");
    ok=false;
  }

  if(!getRadioValue("vax")){
    setErr("err_vax","Choose one");
    ok=false;
  }

  if(!getRadioValue("ins")){
    setErr("err_ins","Choose one");
    ok=false;
  }

  return ok;
}

/* ================= BASIC HTML CHECK ================= */

function validateBasic(){
  const form=$("patientForm");
  if(!form.checkValidity()){
    form.reportValidity();
    return false;
  }
  return true;
}

/* ================= MASTER VALIDATE ================= */

function validateAll(){
  const basic = validateBasic();
  const dob   = validateDOB();
  const pw    = validatePasswords();
  const zip   = validateZip();
  const rad   = validateRadios();

  return basic && dob && pw && zip && rad;
}

/* ================= REVIEW PANEL ================= */

function buildReview(){
  $("reviewArea").innerHTML = `
    <div class="review-row">
      <span class="review-label">Name</span>
      <span class="review-val">
        ${$("firstName").value} ${$("lastName").value}
      </span>
      <span class="review-status">OK</span>
    </div>`;
}

/* ================= BUTTON WIRING ================= */

function wireButtons(){

  const form = $("patientForm");
  if(!form){
    alert("Form not found — JS not attached");
    return;
  }

  /* SUBMIT BLOCKER */
  form.addEventListener("submit", function(e){
    if(!validateAll()){
      e.preventDefault();
      e.stopPropagation();
      buildReview();
      alert("Submission blocked — fix errors");
      return false;
    }
  });

  /* REVIEW */
  $("btnReview").addEventListener("click", function(){
    validateAll();
    buildReview();
  });

  /* RESET */
  $("btnReset").addEventListener("click", function(){
    setTimeout(()=>{
      document.querySelectorAll(".err")
        .forEach(e=>e.textContent="");
      $("reviewArea").innerHTML =
        '<p class="muted">Click Review</p>';
    },0);
  });
}

/* ================= INIT ================= */

function init(){
  setHeaderDate();
  wireButtons();
}

document.addEventListener("DOMContentLoaded", init);

})();
