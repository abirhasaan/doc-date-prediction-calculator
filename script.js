function cal() {
  // Add loading state to button
  const button = document.querySelector(".calculate-btn");
  const resultDiv = document.getElementById("time");

  button.classList.add("loading");
  button.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i><span>Calculating...</span>';

  // Clear previous result
  resultDiv.classList.remove("show");

  setTimeout(() => {
    let d1 = Number(document.getElementById("date1").value);
    let m1 = Number(document.getElementById("month1").value);
    let y1 = Number(document.getElementById("year1").value);

    let d2 = Number(document.getElementById("date2").value);
    let m2 = Number(document.getElementById("month2").value);
    let y2 = Number(document.getElementById("year2").value);

    let d2x = d2;
    let m2x = m2;
    let y2x = y2;

    const date = new Date();
    let d3 = date.getDate();
    let m3;

    if (d3 <= 10) {
      m3 = date.getMonth();
    } else {
      m3 = date.getMonth() + 1;
    }

    let y3 = date.getFullYear();

    let numberOfDays = Number(document.getElementById("numberOfDays").value);

    let month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (d1 > d2) {
      d2 = d2 + month[m2 - 1];
      m2 = m2 - 1;
    }

    if (m1 > m2) {
      m2 = m2 + 12;
      y2 = y2 - 1;
    }

    let d = d2 - d1;
    let m = m2 - m1;
    let y = y2 - y1;

    let totalDays = Math.round(d + m * 30.5 + y * 365);
    let totalMonth = Math.round(totalDays / numberOfDays);
    let totalYear = Math.floor(totalMonth / 12);
    let remaningMonth = totalMonth % 12;

    let yDocYear = Math.floor(y3 + totalYear + (m3 + remaningMonth) / 12);
    let yDocM = (m3 + remaningMonth) % 12 || 1;
    let yDocD = 10;

    let yDocDx = yDocD;
    let yDocMx = yDocM;
    let yDocYearx = yDocYear;

    if (d2x > yDocDx) {
      yDocDx = yDocDx + month[yDocMx - 1];
      yDocMx = yDocMx - 1;
    }

    if (m2x > yDocMx) {
      yDocMx = yDocMx + 12;
      yDocYearx = yDocYearx - 1;
    }

    let dx = yDocDx - d2x;
    let mx = yDocMx - m2x;
    let yx = yDocYearx - y2x;

    // Format the result with better styling
    const resultHTML = `
      <div style="margin-bottom: 20px;">
        <i class="fas fa-calendar-check" style="font-size: 28px; color: #00eeff; margin-bottom: 15px;"></i>
      </div>
      <div style="font-size: 24px; font-weight: 700; color: #00eeff; margin-bottom: 10px;">
        Predicted Doc Arrival Date
      </div>
      <div style="font-size: 32px; font-weight: 800; color: #ffffff; margin-bottom: 20px;">
        ${String(yDocD).padStart(2, "0")}/${String(yDocM).padStart(
      2,
      "0"
    )}/${yDocYear}
      </div>
      <div style="font-size: 16px; color: rgba(255, 255, 255, 0.8); margin-bottom: 8px;">
        Approximate waiting period:
      </div>
      <div style="font-size: 20px; font-weight: 600; color: #ffffff;">
        <strong style="color: #00eeff;">${yx}</strong> Years 
        <strong style="color: #00eeff;">${mx}</strong> Months 
        <strong style="color: #00eeff;">${dx}</strong> Days
      </div>
    `;

    document.getElementById("time").innerHTML = resultHTML;

    // Reset button and show result
    button.classList.remove("loading");
    button.innerHTML =
      '<i class="fas fa-calculator"></i><span>Calculate Prediction</span>';

    // Show result with animation
    setTimeout(() => {
      resultDiv.classList.add("show");
    }, 100);
  }, 1000); // Small delay for better UX
}

// Add input validation and formatting
document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll('input[type="number"]');

  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      // Remove any non-digit characters
      this.value = this.value.replace(/[^0-9]/g, "");

      // Add visual feedback for valid inputs
      if (this.value && this.checkValidity()) {
        this.style.borderColor = "#00eeff";
      } else {
        this.style.borderColor = "rgba(255, 255, 255, 0.1)";
      }

      // Auto-advance to next field when current field is complete
      autoAdvanceToNextField(this);
    });

    input.addEventListener("focus", function () {
      this.style.transform = "translateY(-2px)";
      // Select all text when focusing for easier editing
      this.select();
    });

    input.addEventListener("blur", function () {
      this.style.transform = "translateY(0)";
    });

    // Handle Enter key to move to next field
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        moveToNextField(this);
      }
      // Handle backspace to move to previous field when current is empty
      else if (e.key === "Backspace" && this.value === "") {
        e.preventDefault();
        moveToPreviousField(this);
      }
    });
  });

  // Function to auto-advance when field is complete
  function autoAdvanceToNextField(currentInput) {
    const id = currentInput.id;
    const value = currentInput.value;

    // Check if field is complete based on expected length
    let shouldAdvance = false;

    if (id.includes("date") && value.length === 2) {
      // Day field complete (2 digits)
      shouldAdvance = true;
    } else if (id.includes("month") && value.length === 2) {
      // Month field complete (2 digits)
      shouldAdvance = true;
    } else if (id.includes("year") && value.length === 4) {
      // Year field complete (4 digits)
      shouldAdvance = true;
    } else if (id === "numberOfDays" && value.length >= 1) {
      // Don't auto-advance for numberOfDays as it can vary in length
      return;
    }

    if (shouldAdvance) {
      setTimeout(() => moveToNextField(currentInput), 100);
    }
  }

  // Function to move to next logical field
  function moveToNextField(currentInput) {
    const id = currentInput.id;
    let nextFieldId = "";

    // Define the flow of fields
    const fieldFlow = {
      date1: "month1",
      month1: "year1",
      year1: "date2",
      date2: "month2",
      month2: "year2",
      year2: "numberOfDays",
      numberOfDays: null, // Last field
    };

    nextFieldId = fieldFlow[id];

    if (nextFieldId) {
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus();
      }
    } else {
      // If it's the last field, focus on calculate button
      const calculateBtn = document.querySelector(".calculate-btn");
      if (calculateBtn) {
        calculateBtn.focus();
      }
    }
  }

  // Function to move to previous logical field
  function moveToPreviousField(currentInput) {
    const id = currentInput.id;
    let prevFieldId = "";

    // Define the reverse flow of fields
    const reverseFieldFlow = {
      month1: "date1",
      year1: "month1",
      date2: "year1",
      month2: "date2",
      year2: "month2",
      numberOfDays: "year2",
    };

    prevFieldId = reverseFieldFlow[id];

    if (prevFieldId) {
      const prevField = document.getElementById(prevFieldId);
      if (prevField) {
        prevField.focus();
        // Move cursor to end of previous field
        prevField.setSelectionRange(
          prevField.value.length,
          prevField.value.length
        );
      }
    }
  }
});
