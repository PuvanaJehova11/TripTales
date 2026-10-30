// TripTales: simple travel planner using JavaScript and browser localStorage.
const STORAGE_KEY = "triptales_trip_data";
let trip = null;
let stops = [];

const $ = (id) => document.getElementById(id);
const money = (amount) => "₹" + Number(amount || 0).toLocaleString("en-IN");

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ trip, stops }));
}

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      trip = saved.trip || null;
      stops = Array.isArray(saved.stops) ? saved.stops : [];
    }
  } catch (error) {
    console.warn("Could not load saved TripTales data.", error);
  }
  render();
}

function showMessage(id, message) {
  $(id).textContent = message;
}

function render() {
  // Update the trip overview.
  if (trip) {
    $("overviewDestination").innerHTML =
      `<span class="pin">⌖</span><div><strong>${escapeHTML(trip.name)} · ${escapeHTML(trip.destination)}</strong><small>Starting ${formatDate(trip.date)}</small></div>`;
    $("overviewDays").textContent = trip.days;
    $("overviewBudget").textContent = money(trip.budget);
    $("tripName").value = trip.name;
    $("destination").value = trip.destination;
    $("travelDate").value = trip.date;
    $("days").value = trip.days;
    $("budget").value = trip.budget;
    updateDayOptions();
  } else {
    $("overviewDestination").innerHTML = '<span class="pin">⌖</span><div><strong>No trip added yet</strong><small>Create your trip to see its details here.</small></div>';
    $("overviewDays").textContent = "—";
    $("overviewBudget").textContent = "₹0";
  }

  const totalCost = stops.reduce((sum, stop) => sum + Number(stop.cost || 0), 0);
  const budget = trip ? Number(trip.budget) : 0;
  const percent = budget > 0 ? Math.round((totalCost / budget) * 100) : 0;
  $("overviewStops").textContent = stops.length;
  $("budgetPercent").textContent = percent + "%";
  $("budgetBar").style.width = Math.min(percent, 100) + "%";
  $("budgetHint").textContent = budget
    ? `${money(totalCost)} estimated across your stops · ${money(Math.max(0, budget - totalCost))} remaining`
    : "Create a trip and add expenses to track your budget.";

  $("stopCount").textContent = `${stops.length} stop${stops.length === 1 ? "" : "s"} planned`;
  renderStops();
}

function updateDayOptions() {
  const maxDays = trip ? Number(trip.days) : 2;
  const selected = Number($("stopDay").value || 1);
  $("stopDay").innerHTML = Array.from({ length: maxDays }, (_, index) =>
    `<option value="${index + 1}">Day ${index + 1}</option>`
  ).join("");
  $("stopDay").value = Math.min(selected, maxDays);
  const filter = $("dayFilter");
  const oldFilter = filter.value;
  filter.innerHTML = '<option value="all">All days</option>' +
    Array.from({ length: maxDays }, (_, index) =>
      `<option value="${index + 1}">Day ${index + 1}</option>`
    ).join("");
  filter.value = oldFilter === "all" || Number(oldFilter) <= maxDays ? oldFilter : "all";
}

function renderStops() {
  const filter = $("dayFilter").value;
  const visible = stops
    .filter(stop => filter === "all" || Number(stop.day) === Number(filter))
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  if (visible.length === 0) {
    $("itineraryList").innerHTML = '<div class="empty-state"><span>🧭</span><strong>Your adventure is waiting.</strong><p>Add your first place using the form.</p></div>';
    return;
  }
  $("itineraryList").innerHTML = visible.map(stop => `
    <div class="stop-card">
      <div class="stop-time">DAY ${stop.day}<br>${escapeHTML(stop.time || "--:--")}</div>
      <div><h4>${escapeHTML(stop.place)}</h4>
        <div class="stop-meta">${escapeHTML(stop.category)}</div>
        ${stop.notes ? `<p class="stop-notes">${escapeHTML(stop.notes)}</p>` : ""}
      </div>
      <div><div class="stop-cost">${money(stop.cost)}</div>
        <button class="delete-stop" type="button" data-delete="${stop.id}" aria-label="Delete ${escapeHTML(stop.place)}">×</button>
      </div>
    </div>`).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function formatDate(dateString) {
  if (!dateString) return "date not selected";
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });
}

$("tripForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("tripName").value.trim();
  const destination = $("destination").value.trim();
  const date = $("travelDate").value;
  const days = Number($("days").value);
  const budget = Number($("budget").value);
  if (!name || !destination || !date || days < 1 || days > 30 || budget < 0) {
    showMessage("tripMessage", "Please enter valid trip details. Choose 1–30 days.");
    return;
  }
  trip = { name, destination, date, days, budget };
  stops = stops.filter(stop => Number(stop.day) <= days);
  updateDayOptions();
  saveData();
  render();
  showMessage("tripMessage", "Your trip has been saved successfully!");
});

$("stopForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!trip) {
    showMessage("stopMessage", "Please create and save your trip first.");
    return;
  }
  const place = $("placeName").value.trim();
  const day = Number($("stopDay").value);
  const cost = Number($("stopCost").value);
  if (!place || day < 1 || day > trip.days || cost < 0) {
    showMessage("stopMessage", "Please check the place, day and estimated cost.");
    return;
  }
  stops.push({
    id: Date.now().toString() + Math.random().toString(16).slice(2),
    place,
    day,
    time: $("stopTime").value,
    category: $("stopCategory").value,
    cost,
    notes: $("stopNotes").value.trim()
  });
  saveData();
  render();
  $("stopForm").reset();
  $("stopTime").value = "10:00";
  $("stopCost").value = "0";
  showMessage("stopMessage", "Place added to your itinerary!");
});

$("itineraryList").addEventListener("click", event => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  stops = stops.filter(stop => stop.id !== button.dataset.delete);
  saveData();
  render();
});

$("dayFilter").addEventListener("change", renderStops);

$("clearAllBtn").addEventListener("click", () => {
  if (!confirm("Clear this trip and all its planned stops?")) return;
  trip = null;
  stops = [];
  localStorage.removeItem(STORAGE_KEY);
  $("tripForm").reset();
  $("stopForm").reset();
  $("stopTime").value = "10:00";
  $("stopCost").value = "0";
  updateDayOptions();
  render();
  showMessage("tripMessage", "Trip cleared. You can start a new one!");
  showMessage("stopMessage", "");
});

// Set the date field to today as a convenient default.
$("travelDate").value = new Date().toISOString().slice(0, 10);
loadData();
