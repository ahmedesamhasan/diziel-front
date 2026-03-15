const storageKeys = {
  auth: "diziel_auth",
  orders: "diziel_orders",
  drivers: "diziel_drivers",
  vehicles: "diziel_vehicles",
  settings: "diziel_settings",
  notifications: "diziel_notifications"
}

const demoSeed = {
  auth: {
    isLoggedIn: false,
    user: { name: "Ahmed Esam", email: "admin@diziel.app", role: "Admin" }
  },
  orders: [
    { id: "ORD-1001", customer: "Cairo Gas", from: "Cairo", to: "Suez", status: "Pending", amount: 2400, createdAt: "2026-03-12" },
    { id: "ORD-1002", customer: "Delta Fuel", from: "Ismailia", to: "Port Said", status: "Completed", amount: 3100, createdAt: "2026-03-13" },
    { id: "ORD-1003", customer: "Nile Energy", from: "Giza", to: "Monufia", status: "Active", amount: 1900, createdAt: "2026-03-14" },
    { id: "ORD-1004", customer: "Upper Road", from: "Alexandria", to: "Cairo", status: "Draft", amount: 1500, createdAt: "2026-03-14" }
  ],
  drivers: [
    { id: "DRV-01", name: "Mohamed Adel", phone: "01000000001", status: "Active", vehicle: "TRK-22" },
    { id: "DRV-02", name: "Omar Hassan", phone: "01000000002", status: "Active", vehicle: "TRK-14" },
    { id: "DRV-03", name: "Kareem Samy", phone: "01000000003", status: "Pending", vehicle: "VAN-31" }
  ],
  vehicles: [
    { id: "TRK-22", type: "Truck", plate: "س ب 2481", capacity: "20 Ton", status: "Active" },
    { id: "TRK-14", type: "Truck", plate: "ق ر 7312", capacity: "18 Ton", status: "Maintenance" },
    { id: "VAN-31", type: "Van", plate: "ع د 9921", capacity: "8 Ton", status: "Active" }
  ],
  settings: {
    companyName: "Diziel Logistics",
    supportEmail: "support@diziel.app",
    apiBaseUrl: "https://api.example.com",
    currency: "EGP",
    language: "ar",
    timezone: "Africa/Cairo"
  },
  notifications: [
    { id: 1, title: "New order received", time: "10 min ago" },
    { id: 2, title: "Vehicle TRK-14 moved to maintenance", time: "35 min ago" },
    { id: 3, title: "Driver DRV-01 completed delivery", time: "1 hour ago" }
  ]
}

function bootstrapData() {
  Object.entries(demoSeed).forEach(([key, value]) => {
    const storageKey = storageKeys[key]
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(value))
    }
  })
}

function readStore(key) {
  return JSON.parse(localStorage.getItem(storageKeys[key]))
}

function writeStore(key, value) {
  localStorage.setItem(storageKeys[key], JSON.stringify(value))
}

function resetDemoData() {
  Object.entries(demoSeed).forEach(([key, value]) => writeStore(key, value))
}

function isLoggedIn() {
  const auth = readStore("auth")
  return Boolean(auth && auth.isLoggedIn)
}

function navigateTo(hash) {
  window.location.hash = hash
}

function pageRoute() {
  return window.location.hash || "#/login"
}

function money(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0)) + " EGP"
}

function badgeClass(status) {
  const classes = {
    Pending: "badge-pending",
    Active: "badge-active",
    Completed: "badge-completed",
    Maintenance: "badge-maintenance",
    Draft: "badge-draft"
  }
  return classes[status] || "badge-active"
}

function safeText(text) {
  return String(text || "").replace(/[&<>"']/g, function (char) {
    const chars = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }
    return chars[char]
  })
}

function renderApp() {
  const route = pageRoute()
  const app = document.getElementById("app")

  if (!isLoggedIn() && route !== "#/login" && route !== "#/register") {
    navigateTo("#/login")
    return
  }

  if (isLoggedIn() && (route === "#/login" || route === "#/register" || route === "#/")) {
    navigateTo("#/dashboard")
    return
  }

  if (route === "#/login") {
    app.innerHTML = renderLoginPage()
    bindLoginPage()
    return
  }

  if (route === "#/register") {
    app.innerHTML = renderRegisterPage()
    bindRegisterPage()
    return
  }

  app.innerHTML = renderDashboardShell(route)
  bindPageEvents(route)
}

function renderLoginPage() {
  return `
    <section class="login-wrapper">
      <div class="card login-card">
        <div class="row g-0">
          <div class="col-md-5 login-side p-4 d-flex flex-column justify-content-center">
            <h1 class="h3 fw-bold mb-3">Diziel</h1>
            <p class="mb-2">نسخة كاملة جاهزة للرفع على GitHub Pages.</p>
            <p class="mb-0 text-light-emphasis">تعمل بدون Backend. كل البيانات محفوظة داخل localStorage.</p>
          </div>

          <div class="col-md-7">
            <div class="card-body p-4 p-md-5">
              <div class="mb-4 text-center">
                <h2 class="h4 mb-2">تسجيل الدخول</h2>
                <p class="text-muted mb-0">اكتب أي Email و Password للتجربة</p>
              </div>

              <form id="loginForm" novalidate>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input id="loginEmail" type="email" class="form-control" placeholder="admin@diziel.app" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input id="loginPassword" type="password" class="form-control" placeholder="••••••••" required />
                </div>

                <button class="btn btn-dark w-100" type="submit">دخول</button>
              </form>

              <div class="text-center mt-3">
                <a href="#/register">إنشاء حساب تجريبي</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
}

function renderRegisterPage() {
  return `
    <section class="login-wrapper">
      <div class="card login-card">
        <div class="card-body p-4 p-md-5">
          <div class="text-center mb-4">
            <h2 class="h4 mb-2">إنشاء حساب</h2>
            <p class="text-muted mb-0">هذه النسخة static للتجربة والعرض فقط</p>
          </div>

          <form id="registerForm" novalidate>
            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <input id="registerName" type="text" class="form-control" placeholder="Ahmed Esam" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Email</label>
              <input id="registerEmail" type="email" class="form-control" placeholder="admin@diziel.app" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input id="registerPassword" type="password" class="form-control" placeholder="••••••••" required />
            </div>

            <button class="btn btn-primary w-100" type="submit">إنشاء والدخول</button>
          </form>

          <div class="text-center mt-3">
            <a href="#/login">لديك حساب بالفعل</a>
          </div>
        </div>
      </div>
    </section>
  `
}

function renderDashboardShell(route) {
  const auth = readStore("auth")
  const user = auth.user

  return `
    <div class="app-shell d-lg-flex">
      <aside class="sidebar p-3 p-lg-4">
        <div class="mb-4">
          <div class="brand-title">Diziel</div>
          <div class="brand-subtitle">Logistics Dashboard</div>
        </div>

        <div class="mb-4 p-3 rounded-4 bg-white bg-opacity-10">
          <div class="fw-bold">${safeText(user.name)}</div>
          <div class="small text-secondary">${safeText(user.role)}</div>
          <div class="small text-light-emphasis mt-1">${safeText(user.email)}</div>
        </div>

        <nav class="nav flex-column">
          ${sidebarLink("#/dashboard", "Dashboard", route)}
          ${sidebarLink("#/orders", "Orders", route)}
          ${sidebarLink("#/drivers", "Drivers", route)}
          ${sidebarLink("#/vehicles", "Vehicles", route)}
          ${sidebarLink("#/reports", "Reports", route)}
          ${sidebarLink("#/settings", "Settings", route)}
        </nav>
      </aside>

      <main class="content-area flex-grow-1">
        <header class="topbar px-3 px-md-4 py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h1 class="page-title">${pageTitle(route)}</h1>
            <p class="page-subtitle">نسخة جاهزة للرفع على GitHub Pages بدون أي تعديل</p>
          </div>

          <div class="d-flex flex-wrap gap-2">
            <button id="resetDataButton" class="btn btn-outline-secondary">Reset Demo Data</button>
            <button id="logoutButton" class="btn btn-dark">Logout</button>
          </div>
        </header>

        <section class="p-3 p-md-4">
          ${renderPage(route)}
        </section>
      </main>
    </div>
  `
}

function sidebarLink(hash, label, currentRoute) {
  const activeClass = currentRoute === hash ? "active" : ""
  return `<a class="nav-link ${activeClass}" href="${hash}">${label}</a>`
}

function pageTitle(route) {
  const titles = {
    "#/dashboard": "Dashboard",
    "#/orders": "Orders",
    "#/drivers": "Drivers",
    "#/vehicles": "Vehicles",
    "#/reports": "Reports",
    "#/settings": "Settings"
  }
  return titles[route] || "Dashboard"
}

function renderPage(route) {
  if (route === "#/orders") return renderOrdersPage()
  if (route === "#/drivers") return renderDriversPage()
  if (route === "#/vehicles") return renderVehiclesPage()
  if (route === "#/reports") return renderReportsPage()
  if (route === "#/settings") return renderSettingsPage()
  return renderHomePage()
}

function renderHomePage() {
  const orders = readStore("orders")
  const drivers = readStore("drivers")
  const vehicles = readStore("vehicles")
  const notifications = readStore("notifications")

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount), 0)
  const activeOrders = orders.filter(order => order.status === "Active").length
  const activeDrivers = drivers.filter(driver => driver.status === "Active").length
  const activeVehicles = vehicles.filter(vehicle => vehicle.status === "Active").length

  return `
    <div class="hero-card p-4 p-md-5 mb-4">
      <div class="row align-items-center g-4">
        <div class="col-lg-7">
          <h2 class="fw-bold mb-3">Frontend static كامل وجاهز للنشر</h2>
          <p class="hero-note mb-4">تقدر ترفعه الآن على GitHub Pages. كل الصفحات تعمل، والتنقل يعمل، والبيانات التجريبية محفوظة محليًا داخل المتصفح.</p>
          <div class="d-flex flex-wrap gap-2">
            <a class="btn btn-light" href="#/orders">Open Orders</a>
            <a class="btn btn-outline-light" href="#/settings">Open Settings</a>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="row g-3">
            <div class="col-6"><div class="stat-card p-3 h-100"><div class="metric-label">Revenue</div><div class="metric-number">${money(totalRevenue)}</div></div></div>
            <div class="col-6"><div class="stat-card p-3 h-100"><div class="metric-label">Active Orders</div><div class="metric-number">${activeOrders}</div></div></div>
            <div class="col-6"><div class="stat-card p-3 h-100"><div class="metric-label">Drivers</div><div class="metric-number">${activeDrivers}</div></div></div>
            <div class="col-6"><div class="stat-card p-3 h-100"><div class="metric-label">Vehicles</div><div class="metric-number">${activeVehicles}</div></div></div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-xl-8">
        <div class="card panel-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 class="section-title">Latest Orders</h3>
                <p class="section-note">آخر الطلبات داخل النسخة التجريبية</p>
              </div>
              <a href="#/orders">View all</a>
            </div>
            ${orders.length ? renderOrdersTable(orders.slice(0, 5)) : emptyState("لا توجد طلبات")}
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card panel-card mb-4">
          <div class="card-body">
            <h3 class="section-title mb-3">Quick Actions</h3>
            <div class="quick-grid">
              <a class="quick-action" href="#/orders"><div class="fw-bold mb-1">Orders</div><div class="small text-muted">إدارة الطلبات</div></a>
              <a class="quick-action" href="#/drivers"><div class="fw-bold mb-1">Drivers</div><div class="small text-muted">إدارة السائقين</div></a>
              <a class="quick-action" href="#/vehicles"><div class="fw-bold mb-1">Vehicles</div><div class="small text-muted">إدارة المركبات</div></a>
              <a class="quick-action" href="#/reports"><div class="fw-bold mb-1">Reports</div><div class="small text-muted">إحصاءات مختصرة</div></a>
            </div>
          </div>
        </div>

        <div class="card panel-card">
          <div class="card-body">
            <h3 class="section-title mb-3">Notifications</h3>
            <div class="d-grid gap-2">
              ${notifications.map(item => `
                <div class="info-item">
                  <div class="info-value">${safeText(item.title)}</div>
                  <div class="small text-muted mt-1">${safeText(item.time)}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderOrdersPage() {
  const orders = readStore("orders")
  return `
    <div class="card form-card mb-4">
      <div class="card-body">
        <div class="mb-3">
          <h3 class="section-title">Add Order</h3>
          <p class="section-note">أضف طلبًا جديدًا للتجربة المحلية</p>
        </div>

        <form id="orderForm" class="row g-3">
          <div class="col-md-3"><input id="orderCustomer" class="form-control" placeholder="Customer name" required /></div>
          <div class="col-md-2"><input id="orderFrom" class="form-control" placeholder="From" required /></div>
          <div class="col-md-2"><input id="orderTo" class="form-control" placeholder="To" required /></div>
          <div class="col-md-2"><input id="orderAmount" type="number" class="form-control" placeholder="Amount" required /></div>
          <div class="col-md-2">
            <select id="orderStatus" class="form-select">
              <option>Pending</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Draft</option>
            </select>
          </div>
          <div class="col-md-1"><button class="btn btn-primary w-100" type="submit">Add</button></div>
        </form>
      </div>
    </div>

    <div class="card panel-card">
      <div class="card-body">
        <div class="mb-3">
          <h3 class="section-title">Orders List</h3>
          <p class="section-note">قائمة كاملة بالطلبات الحالية</p>
        </div>
        ${orders.length ? renderOrdersTable(orders) : emptyState("لا توجد طلبات حتى الآن")}
      </div>
    </div>
  `
}

function renderOrdersTable(orders) {
  return `
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Route</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(order => `
            <tr>
              <td>${safeText(order.id)}</td>
              <td>${safeText(order.customer)}</td>
              <td>${safeText(order.from)} → ${safeText(order.to)}</td>
              <td><span class="badge-soft ${badgeClass(order.status)}">${safeText(order.status)}</span></td>
              <td>${money(order.amount)}</td>
              <td>${safeText(order.createdAt)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `
}

function renderDriversPage() {
  const drivers = readStore("drivers")
  return `
    <div class="card form-card mb-4">
      <div class="card-body">
        <div class="mb-3">
          <h3 class="section-title">Add Driver</h3>
          <p class="section-note">إضافة سائق جديد إلى البيانات المحلية</p>
        </div>

        <form id="driverForm" class="row g-3">
          <div class="col-md-3"><input id="driverName" class="form-control" placeholder="Driver name" required /></div>
          <div class="col-md-3"><input id="driverPhone" class="form-control" placeholder="Phone" required /></div>
          <div class="col-md-3"><input id="driverVehicle" class="form-control" placeholder="Vehicle ID" required /></div>
          <div class="col-md-2">
            <select id="driverStatus" class="form-select">
              <option>Active</option>
              <option>Pending</option>
            </select>
          </div>
          <div class="col-md-1"><button class="btn btn-success w-100" type="submit">Add</button></div>
        </form>
      </div>
    </div>

    <div class="card panel-card">
      <div class="card-body">
        <div class="mb-3">
          <h3 class="section-title">Drivers List</h3>
          <p class="section-note">بيانات السائقين الحالية</p>
        </div>

        ${drivers.length ? `
          <div class="table-responsive">
            <table class="table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${drivers.map(driver => `
                  <tr>
                    <td>${safeText(driver.id)}</td>
                    <td>${safeText(driver.name)}</td>
                    <td>${safeText(driver.phone)}</td>
                    <td>${safeText(driver.vehicle)}</td>
                    <td><span class="badge-soft ${badgeClass(driver.status)}">${safeText(driver.status)}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : emptyState("لا يوجد سائقون حتى الآن")}
      </div>
    </div>
  `
}

function renderVehiclesPage() {
  const vehicles = readStore("vehicles")
  return `
    <div class="card form-card mb-4">
      <div class="card-body">
        <div class="mb-3">
          <h3 class="section-title">Add Vehicle</h3>
          <p class="section-note">إضافة مركبة جديدة للتجربة</p>
        </div>

        <form id="vehicleForm" class="row g-3">
          <div class="col-md-2"><input id="vehicleId" class="form-control" placeholder="Vehicle ID" required /></div>
          <div class="col-md-2"><input id="vehicleType" class="form-control" placeholder="Type" required /></div>
          <div class="col-md-3"><input id="vehiclePlate" class="form-control" placeholder="Plate" required /></div>
          <div class="col-md-2"><input id="vehicleCapacity" class="form-control" placeholder="Capacity" required /></div>
          <div class="col-md-2">
            <select id="vehicleStatus" class="form-select">
              <option>Active</option>
              <option>Maintenance</option>
            </select>
          </div>
          <div class="col-md-1"><button class="btn btn-dark w-100" type="submit">Add</button></div>
        </form>
      </div>
    </div>

    <div class="row g-4">
      ${vehicles.map(vehicle => `
        <div class="col-md-6 col-xl-4">
          <div class="card metric-card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div class="fw-bold">${safeText(vehicle.id)}</div>
                  <div class="small text-muted">${safeText(vehicle.type)}</div>
                </div>
                <span class="badge-soft ${badgeClass(vehicle.status)}">${safeText(vehicle.status)}</span>
              </div>
              <div class="info-item mb-2"><div class="info-label">Plate</div><div class="info-value">${safeText(vehicle.plate)}</div></div>
              <div class="info-item"><div class="info-label">Capacity</div><div class="info-value">${safeText(vehicle.capacity)}</div></div>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `
}

function renderReportsPage() {
  const orders = readStore("orders")
  const drivers = readStore("drivers")
  const vehicles = readStore("vehicles")
  const pendingOrders = orders.filter(order => order.status === "Pending").length
  const completedOrders = orders.filter(order => order.status === "Completed").length
  const maintenanceVehicles = vehicles.filter(vehicle => vehicle.status === "Maintenance").length
  const pendingDrivers = drivers.filter(driver => driver.status === "Pending").length

  return `
    <div class="row g-4">
      <div class="col-md-6 col-xl-3"><div class="card metric-card p-4"><div class="metric-label">Pending Orders</div><div class="metric-number">${pendingOrders}</div></div></div>
      <div class="col-md-6 col-xl-3"><div class="card metric-card p-4"><div class="metric-label">Completed Orders</div><div class="metric-number">${completedOrders}</div></div></div>
      <div class="col-md-6 col-xl-3"><div class="card metric-card p-4"><div class="metric-label">Pending Drivers</div><div class="metric-number">${pendingDrivers}</div></div></div>
      <div class="col-md-6 col-xl-3"><div class="card metric-card p-4"><div class="metric-label">Vehicles in Maintenance</div><div class="metric-number">${maintenanceVehicles}</div></div></div>

      <div class="col-12">
        <div class="card panel-card">
          <div class="card-body">
            <h3 class="section-title mb-2">Report Note</h3>
            <p class="mb-0 text-muted">هذه الأرقام محسوبة من البيانات المحلية داخل المتصفح. عند ربط النسخة مع Backend لاحقًا ستتحول إلى تقارير حقيقية من API.</p>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderSettingsPage() {
  const settings = readStore("settings")
  return `
    <div class="card panel-card">
      <div class="card-body">
        <div class="mb-3">
          <h3 class="section-title">Project Settings</h3>
          <p class="section-note">يمكنك تعديل الإعدادات وحفظها محليًا</p>
        </div>

        <form id="settingsForm" class="row g-3">
          <div class="col-md-6"><label class="form-label">Company Name</label><input id="companyName" class="form-control" value="${safeText(settings.companyName)}" required /></div>
          <div class="col-md-6"><label class="form-label">Support Email</label><input id="supportEmail" type="email" class="form-control" value="${safeText(settings.supportEmail)}" required /></div>
          <div class="col-md-6"><label class="form-label">API Base URL</label><input id="apiBaseUrl" class="form-control" value="${safeText(settings.apiBaseUrl)}" required /></div>
          <div class="col-md-3"><label class="form-label">Currency</label><input id="currency" class="form-control" value="${safeText(settings.currency)}" required /></div>
          <div class="col-md-3"><label class="form-label">Timezone</label><input id="timezone" class="form-control" value="${safeText(settings.timezone)}" required /></div>
          <div class="col-12"><button class="btn btn-primary" type="submit">Save Settings</button></div>
        </form>
      </div>
    </div>
  `
}

function emptyState(message) {
  return `<div class="empty-box"><h3 class="h6 mb-2">No Data</h3><p class="text-muted mb-0">${safeText(message)}</p></div>`
}

function bindLoginPage() {
  const form = document.getElementById("loginForm")
  form.addEventListener("submit", function (event) {
    event.preventDefault()
    const email = document.getElementById("loginEmail").value.trim()
    const password = document.getElementById("loginPassword").value.trim()

    if (!email || !password) {
      alert("أدخل Email و Password")
      return
    }

    const auth = readStore("auth")
    auth.isLoggedIn = true
    auth.user.email = email
    writeStore("auth", auth)
    navigateTo("#/dashboard")
  })
}

function bindRegisterPage() {
  const form = document.getElementById("registerForm")
  form.addEventListener("submit", function (event) {
    event.preventDefault()
    const name = document.getElementById("registerName").value.trim()
    const email = document.getElementById("registerEmail").value.trim()
    const password = document.getElementById("registerPassword").value.trim()

    if (!name || !email || !password) {
      alert("أكمل البيانات")
      return
    }

    const auth = readStore("auth")
    auth.isLoggedIn = true
    auth.user.name = name
    auth.user.email = email
    writeStore("auth", auth)
    navigateTo("#/dashboard")
  })
}

function bindPageEvents(route) {
  const logoutButton = document.getElementById("logoutButton")
  const resetDataButton = document.getElementById("resetDataButton")

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      const auth = readStore("auth")
      auth.isLoggedIn = false
      writeStore("auth", auth)
      navigateTo("#/login")
    })
  }

  if (resetDataButton) {
    resetDataButton.addEventListener("click", function () {
      resetDemoData()
      renderApp()
    })
  }

  if (route === "#/orders") bindOrderForm()
  if (route === "#/drivers") bindDriverForm()
  if (route === "#/vehicles") bindVehicleForm()
  if (route === "#/settings") bindSettingsForm()
}

function bindOrderForm() {
  const form = document.getElementById("orderForm")
  if (!form) return

  form.addEventListener("submit", function (event) {
    event.preventDefault()

    const customer = document.getElementById("orderCustomer").value.trim()
    const from = document.getElementById("orderFrom").value.trim()
    const to = document.getElementById("orderTo").value.trim()
    const amount = document.getElementById("orderAmount").value.trim()
    const status = document.getElementById("orderStatus").value

    if (!customer || !from || !to || !amount) {
      alert("أكمل بيانات الطلب")
      return
    }

    const orders = readStore("orders")
    const nextId = "ORD-" + String(1001 + orders.length)
    orders.unshift({
      id: nextId,
      customer,
      from,
      to,
      status,
      amount: Number(amount),
      createdAt: new Date().toISOString().slice(0, 10)
    })

    writeStore("orders", orders)
    renderApp()
  })
}

function bindDriverForm() {
  const form = document.getElementById("driverForm")
  if (!form) return

  form.addEventListener("submit", function (event) {
    event.preventDefault()

    const name = document.getElementById("driverName").value.trim()
    const phone = document.getElementById("driverPhone").value.trim()
    const vehicle = document.getElementById("driverVehicle").value.trim()
    const status = document.getElementById("driverStatus").value

    if (!name || !phone || !vehicle) {
      alert("أكمل بيانات السائق")
      return
    }

    const drivers = readStore("drivers")
    const id = "DRV-" + String(drivers.length + 1).padStart(2, "0")
    drivers.unshift({ id, name, phone, vehicle, status })

    writeStore("drivers", drivers)
    renderApp()
  })
}

function bindVehicleForm() {
  const form = document.getElementById("vehicleForm")
  if (!form) return

  form.addEventListener("submit", function (event) {
    event.preventDefault()

    const id = document.getElementById("vehicleId").value.trim()
    const type = document.getElementById("vehicleType").value.trim()
    const plate = document.getElementById("vehiclePlate").value.trim()
    const capacity = document.getElementById("vehicleCapacity").value.trim()
    const status = document.getElementById("vehicleStatus").value

    if (!id || !type || !plate || !capacity) {
      alert("أكمل بيانات المركبة")
      return
    }

    const vehicles = readStore("vehicles")
    vehicles.unshift({ id, type, plate, capacity, status })

    writeStore("vehicles", vehicles)
    renderApp()
  })
}

function bindSettingsForm() {
  const form = document.getElementById("settingsForm")
  if (!form) return

  form.addEventListener("submit", function (event) {
    event.preventDefault()

    const settings = {
      companyName: document.getElementById("companyName").value.trim(),
      supportEmail: document.getElementById("supportEmail").value.trim(),
      apiBaseUrl: document.getElementById("apiBaseUrl").value.trim(),
      currency: document.getElementById("currency").value.trim(),
      language: "ar",
      timezone: document.getElementById("timezone").value.trim()
    }

    writeStore("settings", settings)
    alert("Settings saved locally")
  })
}

window.addEventListener("hashchange", renderApp)
window.addEventListener("DOMContentLoaded", function () {
  bootstrapData()
  renderApp()
})
