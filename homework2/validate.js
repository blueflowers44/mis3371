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

  function $(id) { return document.getElementById(id); }

  function setErr(id, msg) {
    const el = $(id);
    if (el) el.textContent = msg || "";
  }

  function fmtMoney(n) {
    return Number(n).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    });
  }

  function getRadioValue(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : "";
  }

  function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
      .map(x => x.value);
  }

  function only5Zip(zip) {
    const m = String(zip).match(/^(\d{5})/);
    return m ? m[1] : "";
  }

  /* ================= HEADER DATE ================= */

  function setHeaderDate() {
    const today = new Date();
    const target = $("currentDate");
    if (!target) return;

    target.textContent = today.toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
  }

  /* ================= SALARY SLIDER ================= */

  function wireSalary() {
    const slider = $("salary");
    const display = $("salaryDisplay");
    if (!slider || !display) return;

    const update = () => { display.textContent = fmtMoney(slider.value); };
    slider.addEventListener("input", update);
    update();
  }

  /* ================= DOB VALIDATION (120 years, not future) ================= */

  function validateDOB() {
    setErr("err_dob", "");

    const mm = ($("dobMM")?.value || "").trim();
    const dd = ($("dobDD")?.value || "").trim();
    const yy = ($("dobYYYY")?.value || "").trim();

    if (!mm || !dd || !yy) {
      setErr("err_dob", "DOB is required (MM/DD/YYYY).");
      return false;
    }

    const month = Number(mm);
    const day = Number(dd);
    const year = Number(yy);

    const dob = new Date(year, month - 1, day);

    if (dob.getFullYear() !== year || dob.getMonth() !== (month - 1) || dob.getDate() !== day) {
      setErr("err_dob", "DOB is not a valid calendar date.");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dob > today) {
      setErr("err_dob", "ERROR: DOB cannot be in the future.");
      return false;
    }

    const min = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    if (dob < min) {
      setErr("err_dob", "ERROR: DOB cannot be more than 120 years ago.");
      return false;
    }

    return true;
  }

  /* ================= PASSWORD VALIDATION ================= */

  function validatePasswords() {
    setErr("err_pw1", "");
    setErr("err_pw2", "");

    const pw1 = $("pw1")?.value || "";
    const pw2 = $("pw2")?.value || "";
    const userId = ($("userId")?.value || "").toLowerCase();
    const first = ($("firstName")?.value || "").toLowerCase();
    const last = ($("lastName")?.value || "").toLowerCase();

    if (pw1.includes('"') || pw2.includes('"')) {
      setErr("err_pw1", 'Password cannot contain double quotes (").');
      return false;
    }

    if (pw1.length < 8 || pw1.length > 30) {
      setErr("err_pw1", "Password must be 8–30 characters.");
      return false;
    }

    const hasUpper = /[A-Z]/.test(pw1);
    const hasLower = /[a-z]/.test(pw1);
    const hasDigit = /[0-9]/.test(pw1);
    const hasSpecial = /[!@#%^&*()\-_+=\\/><.,`~$]/.test(pw1);

    if (!(hasUpper && hasLower && hasDigit && hasSpecial)) {
      setErr("err_pw1", "Password must include upper, lower, number, and special character.");
      return false;
    }

    const pwLower = pw1.toLowerCase();
    if (userId && pwLower.includes(userId)) {
      setErr("err_pw1", "Password cannot equal or contain your User ID.");
      return false;
    }
    if (first && pwLower.includes(first)) {
      setErr("err_pw1", "Password cannot contain your first name.");
      return false;
    }
    if (last && pwLower.includes(last)) {
      setErr("err_pw1", "Password cannot contain your last name.");
      return false;
    }

    if (pw1 !== pw2) {
      setErr("err_pw2", "Passwords do not match.");
      return false;
    }

    return true;
  }

  /* ================= ZIP TRUNCATE ================= */

  function validateZip() {
    setErr("err_zip", "");
    const zipEl = $("zip");
    if (!zipEl) return true;

    const z = (zipEl.value || "").trim();
    const five = only5Zip(z);
    if (!five) {
      setErr("err_zip", "ZIP is required (##### or #####-####).");
      return false;
    }
    zipEl.value = five;
    return true;
  }

  /* ================= RADIO GROUPS ================= */

  function validateRadios() {
    setErr("err_housing", "");
    setErr("err_vax", "");
    setErr("err_ins", "");

    let ok = true;
    if (!getRadioValue("housing")) { setErr("err_housing", "Choose one."); ok = false; }
    if (!getRadioValue("vax")) { setErr("err_vax", "Choose one."); ok = false; }
    if (!getRadioValue("ins")) { setErr("err_ins", "Choose one."); ok = false; }
    return ok;
  }

  /* ================= BASIC HTML CHECK ================= */

  function validateBasic() {
    const form = $("patientForm");
    if (!form) return false;

    // Clear common errors first (optional)
    setErr("err_firstName", "");
    setErr("err_middleInitial", "");
    setErr("err_lastName", "");
    setErr("err_idNumber", "");
    setErr("err_email", "");
    setErr("err_phone", "");
    setErr("err_addr1", "");
    setErr("err_addr2", "");
    setErr("err_city", "");
    setErr("err_state", "");
    setErr("err_userId", "");

    const ok = form.checkValidity();

    if (!ok) {
      if (!$("firstName")?.checkValidity()) setErr("err_firstName", "Fix First Name format.");
      if (!$("middleInitial")?.checkValidity()) setErr("err_middleInitial", "Middle Initial must be 1 letter or blank.");
      if (!$("lastName")?.checkValidity()) setErr("err_lastName", "Fix Last Name format.");
      if (!$("idNumber")?.checkValidity()) setErr("err_idNumber", "ID must be 5–30 digits.");
      if (!$("email")?.checkValidity()) setErr("err_email", "Enter a valid email.");
      if (!$("phone")?.checkValidity()) setErr("err_phone", "Phone must be 000-000-0000.");
      if (!$("addr1")?.checkValidity()) setErr("err_addr1", "Address Line 1 is required (2–30).");
      if ($("addr2")?.value.trim() && !$("addr2")?.checkValidity()) setErr("err_addr2", "Address Line 2 must be 2–30 if entered.");
      if (!$("city")?.checkValidity()) setErr("err_city", "City is required (2–30).");
      if (!$("state")?.checkValidity()) setErr("err_state", "Select a state.");
      if (!$("userId")?.checkValidity()) setErr("err_userId", "User ID rules not met.");

      form.reportValidity(); // shows browser popups too
    }

    return ok;
  }

  function validateAll() {
    const basic = validateBasic();
    const dob = validateDOB();
    const zip = validateZip();
    const radios = validateRadios();
    const pw = validatePasswords();
    return basic && dob && zip && radios && pw;
  }

  /* ================= REVIEW PANEL ================= */

  function buildReview() {
    const reviewArea = $("reviewArea");
    if (!reviewArea) {
      alert("Review area not found (missing id='reviewArea').");
      return;
    }

    // read values
    const first = ($("firstName")?.value || "").trim();
    const mi = ($("middleInitial")?.value || "").trim();
    const last = ($("lastName")?.value || "").trim();

    const dob = `${($("dobMM")?.value || "").trim()}/${($("dobDD")?.value || "").trim()}/${($("dobYYYY")?.value || "").trim()}`;

    const email = ($("email")?.value || "").trim();
    const phone = ($("phone")?.value || "").trim();

    const addr1 = ($("addr1")?.value || "").trim();
    const addr2 = ($("addr2")?.value || "").trim();
    const city = ($("city")?.value || "").trim();
    const state = ($("state")?.value || "").trim();
    const zip = ($("zip")?.value || "").trim();

    const history = getCheckedValues("hist");
    const housing = getRadioValue("housing");
    const vax = getRadioValue("vax");
    const ins = getRadioValue("ins");

    const salary = fmtMoney($("salary")?.value || 0);
    const symptomsRaw = ($("symptoms")?.value || "").trim();
    const symptoms = symptomsRaw ? symptomsRaw.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "(none)";

    const userId = ($("userId")?.value || "").trim();

    // pass/error checks
    const nameOK = (first && last);
    const dobOK = validateDOB();
    const emailOK = $("email")?.checkValidity();
    const phoneOK = $("phone")?.checkValidity();
    const addressOK = (addr1 && city && state && zip);
    const userIdOK = $("userId")?.checkValidity();
    const pwOK = validatePasswords();

    reviewArea.innerHTML = `
      <div class="review-block">

        <div class="review-subtitle">BASIC INFO</div>
        <div class="review-row">
          <span class="review-label">Name</span>
          <span class="review-val">${first} ${mi ? mi + "." : ""} ${last}</span>
          <span class="review-status">${nameOK ? "pass" : "ERROR"}</span>
        </div>

        <div class="review-row">
          <span class="review-label">Date of Birth</span>
          <span class="review-val">${dob}</span>
          <span class="review-status">${dobOK ? "pass" : "ERROR"}</span>
        </div>

        <div class="review-subtitle">CONTACT</div>
        <div class="review-row">
          <span class="review-label">Email</span>
          <span class="review-val">${email}</span>
          <span class="review-status">${emailOK ? "pass" : "ERROR"}</span>
        </div>

        <div class="review-row">
          <span class="review-label">Phone</span>
          <span class="review-val">${phone}</span>
          <span class="review-status">${phoneOK ? "pass" : "ERROR"}</span>
        </div>

        <div class="review-subtitle">ADDRESS</div>
        <div class="review-row">
          <span class="review-label">Address</span>
          <span class="review-val">
            ${addr1}${addr2 ? "<br>" + addr2 : ""}<br>
            ${city}, ${state} ${zip}
          </span>
          <span class="review-status">${addressOK ? "pass" : "ERROR"}</span>
        </div>

        <div class="review-subtitle">REQUESTED INFO</div>
        <div class="review-row">
          <span class="review-label">Medical History</span>
          <span class="review-val">${history.length ? history.join(", ") : "None selected"}</span>
          <span class="review-status">pass</span>
        </div>

        <div class="review-row">
          <span class="review-label">Housing</span>
          <span class="review-val">${housing || "—"}</span>
          <span class="review-status">${housing ? "pass" : "ERROR"}</span>
        </div>

        <div class="review-row">
          <span class="review-label">Vaccinated?</span>
          <span class="review-val">${vax || "—"}</span>
          <span class="review-status">${vax ? "pass" : "ERROR"}</span>
        </div>

        <div class="review-row">
          <span class="review-label">Insurance?</span>
          <span class="review-val">${ins || "—"}</span>
          <span class="review-status">${ins ? "pass" : "ERROR"}</span>
        </div>

        <div class="review-row">
          <span class="review-label">Desired Salary</span>
          <span class="review-val">${salary}</span>
          <span class="review-status">pass</span>
        </div>

        <div class="review-row">
          <span class="review-label">Symptoms</span>
          <span class="review-val">${symptoms}</span>
          <span class="review-status">pass</span>
        </div>

        <div class="review-subtitle">ACCOUNT</div>
        <div class="review-row">
          <span class="review-label">User ID</span>
          <span class="review-val">${userId}</span>
          <span class="review-status">${userIdOK ? "pass" : "ERROR"}</span>
        </div>

        <div class="review-row">
          <span class="review-label">Password</span>
          <span class="review-val">(hidden)</span>
          <span class="review-status">${pwOK ? "pass" : "ERROR"}</span>
        </div>

        <div class="note muted">
          Tip: Fix any “ERROR” items, click Review again, then Submit.
        </div>
      </div>
    `;
  }

  /* ================= BUTTON WIRING ================= */

  function wireButtons() {
    const form = $("patientForm");
    const btnReview = $("btnReview");
    const btnReset = $("btnReset");

    if (!form) { alert("Form not found (id='patientForm')."); return; }
    if (!btnReview) { alert("Review button not found (id='btnReview')."); return; }
    if (!$("reviewArea")) { alert("Review area not found (id='reviewArea')."); return; }

    // Review
    btnReview.addEventListener("click", function () {
      validateAll();
      buildReview();
    });

    // Submit
    form.addEventListener("submit", function (e) {
      const ok = validateAll();
      buildReview();
      if (!ok) {
        e.preventDefault();
        e.stopPropagation();
        alert("Fix the highlighted errors before submitting.");
      }
    });

    // Reset
    if (btnReset) {
      btnReset.addEventListener("click", function () {
        setTimeout(() => {
          document.querySelectorAll(".err").forEach(el => el.textContent = "");
          $("reviewArea").innerHTML =
            '<p class="muted">Click <b>Review</b> to display your entered information here.</p>';
          wireSalary(); // restore salary display
        }, 0);
      });
    }
  }

  /* ================= INIT ================= */

  function init() {
    setHeaderDate();
    wireSalary();
    wireButtons();
  }

  document.addEventListener("DOMContentLoaded", init);

})();
