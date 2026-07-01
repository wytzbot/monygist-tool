// ===============================
// MonyGist Subscription Manager
// Part 1 - Setup & Local Storage
// ===============================

let subscriptions = JSON.parse(localStorage.getItem("monygistSubscriptions")) || [];

const form = document.getElementById("subscriptionForm");
const table = document.getElementById("subscriptionTable");
const monthlyTotal = document.getElementById("monthlyTotal");
const yearlyTotal = document.getElementById("yearlyTotal");
const totalSubscriptions = document.getElementById("totalSubscriptions");

function saveSubscriptions() {
    localStorage.setItem(
        "monygistSubscriptions",
        JSON.stringify(subscriptions)
    );
}

function daysRemaining(date) {

    const today = new Date();

    const renewal = new Date(date);

    const diff = renewal - today;

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) {
        return "Expired";
    }

    return days + " days";
}

function updateSummary() {

    let monthly = 0;

    let yearly = 0;

    subscriptions.forEach(item => {

        if (item.billing === "Monthly") {

            monthly += Number(item.cost);

            yearly += Number(item.cost) * 12;

        } else {

            yearly += Number(item.cost);

            monthly += Number(item.cost) / 12;

        }

    });

    monthlyTotal.textContent = "$" + monthly.toFixed(2);

    yearlyTotal.textContent = "$" + yearly.toFixed(2);

    totalSubscriptions.textContent = subscriptions.length;

}
// ===============================
// Part 2 - Add & Display Subscriptions
// ===============================

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

                <button
                class="delete-btn"
                onclick="deleteSubscription(${index})">

                Delete

                </button>

            </td>

        </tr>
        `;

    });

    updateSummary();

}

form.addEventListener("submit", function(e){

    e.preventDefault();

    const service =
    document.getElementById("service").value;

    const cost =
    document.getElementById("cost").value;

    const renewal =
    document.getElementById("renewal").value;

    const billing =
    document.getElementById("billing").value;

    subscriptions.push({

        service,
        cost,
        renewal,
        billing

    });

    saveSubscriptions();

    renderTable();

    form.reset();

});
// ===============================
// Part 3 - Delete & Load Data
// ===============================

function deleteSubscription(index){

    if(confirm("Delete this subscription?")){

        subscriptions.splice(index,1);

        saveSubscriptions();

        renderTable();

    }

}

// Load saved subscriptions when page opens

renderTable();
