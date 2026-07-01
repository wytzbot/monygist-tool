// ===============================
// MonyGist - script.js v7
// Runs on both index.html and manager.html
// ===============================

// Check if we're on manager.html before running manager code
const form = document.getElementById("subscriptionForm");
const table = document.getElementById("subscriptionTable");

if (form && table) {
  // ===============================
  // MANAGER.HTML CODE START
  // ===============================
  
  let subscriptions = JSON.parse(localStorage.getItem("monygistSubscriptions")) || [];

  const monthlyTotal = document.getElementById("monthlyTotal");
  const yearlyTotal = document.getElementById("yearlyTotal");
  const totalSubscriptions = document.getElementById("totalSubscriptions");

  function saveSubscriptions() {
    localStorage.setItem("monygistSubscriptions", JSON.stringify(subscriptions));
  }

  function daysRemaining(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const renewal = new Date(date);
    const diff = renewal - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "1 day";
    return days + " days";
  }

  function updateSummary() {
    let monthly = 0;
    let yearly = 0;

    subscriptions.forEach(item => {
      const cost = Number(item.cost);
      if (item.billing === "Monthly") {
        monthly += cost;
        yearly += cost * 12;
      } else {
        yearly += cost;
        monthly += cost / 12;
      }
    });

    monthlyTotal.textContent = "$" + monthly.toFixed(2);
    yearlyTotal.textContent = "$" + yearly.toFixed(2);
    totalSubscriptions.textContent = subscriptions.length;
  }

  function renderTable() {
    if (subscriptions.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="6">No subscriptions added yet.</td>
        </tr>
      `;
      updateSummary();
      return;
    }

    table.innerHTML = "";

    subscriptions.forEach((item, index) => {
      table.innerHTML += `
        <tr>
          <td>${item.service}</td>
          <td>$${Number(item.cost).toFixed(2)}</td>
          <td>${item.renewal}</td>
          <td>${item.billing}</td>
          <td>${daysRemaining(item.renewal)}</td>
          <td>
            <button class="delete-btn" onclick="deleteSubscription(${index})">
              Delete
            </button>
          </td>
        </tr>
      `;
    });

    updateSummary();
  }

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const service = document.getElementById("service").value.trim();
    const cost = document.getElementById("cost").value;
    const renewal = document.getElementById("renewal").value;
    const billing = document.getElementById("billing").value;

    if (!service || !cost || !renewal) {
      alert("Please fill all fields");
      return;
    }

    subscriptions.push({
      service,
      cost: parseFloat(cost),
      renewal,
      billing
    });

    saveSubscriptions();
    renderTable();
    form.reset();
  });

  // Make deleteSubscription global for onclick to work
  window.deleteSubscription = function(index) {
    if (confirm("Delete this subscription?")) {
      subscriptions.splice(index, 1);
      saveSubscriptions();
      renderTable();
    }
  };

  // Load saved subscriptions when manager.html opens
  renderTable();
  
  // ===============================
  // MANAGER.HTML CODE END
  // ===============================
}

// ===============================
// INDEX.HTML FEATURES GO HERE
// ===============================
// We'll add Feature #2 "Savings Goal" here next
// Example structure:
// const calcBtn = document.getElementById("calculateBtn");
// if (calcBtn) { /* index.html code */ }
