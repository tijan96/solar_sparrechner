document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("solarForm");
    const formSteps = document.querySelectorAll(".form-step");
    const progressSteps = document.querySelectorAll(".progress-step");
    const progressBar = document.getElementById("progress");
    
    // Index of the current step
    let currentStep = 0;
  
    // Data object to hold user inputs
    let formData = {
      bundesland: "",
      plz: "",
      address: "",
      dachtyp: "",
      roofSize: 100,
      stromverbrauch: 2500,
      ersparnis: 0,
      fullName: "",
      email: "",
      phone: ""
    };
  
    // Show initial step
    showStep(currentStep);
  
    // Next / Prev Buttons
    const nextButtons = document.querySelectorAll("[data-next-step]");
    const prevButtons = document.querySelectorAll("[data-prev-step]");
  
    nextButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        changeStep("next");
      });
    });
  
    prevButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        changeStep("prev");
      });
    });
  
    // Bundesland Buttons
    document.querySelectorAll(".bundesland-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        formData.bundesland = e.target.getAttribute("data-bundesland");
      });
    });
  
    // Dachtyp Buttons
    document.querySelectorAll(".dachtyp-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        formData.dachtyp = e.currentTarget.getAttribute("data-dachtyp");
        // Automatically go to the next step
        changeStep("next");
      });
    });    
  
    // Haushaltsgröße Buttons
    document.querySelectorAll(".haushalt-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const persons = parseInt(e.currentTarget.getAttribute("data-haushalt"));
        // e.g. prefill consumption
        const usage = persons * 1200;
        document.getElementById("stromverbrauch").value = usage;
        formData.stromverbrauch = usage;
    
        // Move to the next step automatically
        changeStep("next");
      });
    });
    
  
    // Range for roof size
    const roofSizeRange = document.getElementById("roofSizeRange");
    const roofSizeValue = document.getElementById("roofSizeValue");
    roofSizeRange.addEventListener("input", () => {
      roofSizeValue.textContent = roofSizeRange.value;
      formData.roofSize = parseInt(roofSizeRange.value);
    });
  
    // Stromverbrauch
    const stromInput = document.getElementById("stromverbrauch");
    stromInput.addEventListener("input", () => {
      formData.stromverbrauch = parseInt(stromInput.value) || 0;
    });
  
    // PLZ & Address
    const plzInput = document.getElementById("plz");
    const addressInput = document.getElementById("address");
    plzInput.addEventListener("input", () => {
      formData.plz = plzInput.value;
    });
    addressInput.addEventListener("input", () => {
      formData.address = addressInput.value;
    });
  
    // Personal Data
    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    fullNameInput.addEventListener("input", () => {
      formData.fullName = fullNameInput.value;
    });
    emailInput.addEventListener("input", () => {
      formData.email = emailInput.value;
    });
    phoneInput.addEventListener("input", () => {
      formData.phone = phoneInput.value;
    });
  
    // Submit / Abschluss
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Here you would send `formData` to your server, e.g. via fetch/axios
      alert("Daten wurden gesendet!\n" + JSON.stringify(formData, null, 2));
      // Optionally reset or redirect
    });
  
    // Helper to change steps
    function changeStep(direction) {
      // Hide current step
      formSteps[currentStep].classList.remove("active");
  
      if (direction === "next") {
        currentStep++;
      } else if (direction === "prev") {
        currentStep--;
      }
  
      if (currentStep < 0) currentStep = 0;
      if (currentStep >= formSteps.length) currentStep = formSteps.length - 1;
  
      // Show new step
      showStep(currentStep);
  
      // If we’ve just arrived at step 5 (index=4 => Ersparnis), do a quick calculation:
      if (currentStep === 4) {
        calculateSavings();
      }
    }
  
    // Show the correct step and update progress bar
    function showStep(stepIndex) {
      formSteps[stepIndex].classList.add("active");
      updateProgressBar(stepIndex);
    }
  
    // Update the progress bar
    function updateProgressBar(stepIndex) {
      const totalSteps = progressSteps.length; // e.g. 7
      let progressPercent = (stepIndex / (totalSteps - 1)) * 100;
      progressBar.style.width = progressPercent + "%";
  
      progressSteps.forEach((step, idx) => {
        if (idx <= stepIndex) {
          step.classList.add("active");
        } else {
          step.classList.remove("active");
        }
      });
    }
  
    // Very simple placeholder calculation for cost savings
    function calculateSavings() {
      // For example:
      // roofSize (m²) * 10 (Watt per m² => 10 W => 0.01 kW per m2)
      // times 1000 sun hours => total kWh production => compare with consumption
      // This is extremely simplified!
      const production = formData.roofSize * 10; 
      const approximateKwh = production * 1000 / 1000; 
      const offset = Math.min(approximateKwh, formData.stromverbrauch);
      // Assume 0.35€ per kWh
      const ersparnis = offset * 0.35;
  
      // Round to an integer
      formData.ersparnis = Math.round(ersparnis);
      document.getElementById("ersparnisValue").textContent = formData.ersparnis;
    }
  });
  