document.addEventListener("DOMContentLoaded", () => {
  // Verifica si estamos en la página de login o en el dashboard
  if (window.location.pathname === "/") {
    document.body.classList.add("login-page");
    handleLoginPage();
  } else if (window.location.pathname.includes("dashboard.html")) {
    document.body.classList.add("dashboard-page");
    handleDashboardPage();
  }
});

// Función para manejar la página de login
function handleLoginPage() {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  // Manejo del formulario de login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard.html"; // Redirigir al dashboard
      } else {
        errorMessage.textContent = data.message || "Error desconocido";
      }
    } catch (error) {
      console.error(error);
      errorMessage.textContent = "Error al conectar con el servidor";
    }
  });
}

// Función para manejar la página del dashboard
async function handleDashboardPage() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/"; // Redirigir al login si no hay token
    return;
  }

  const logoutButton = document.getElementById("logout-button");
  const moduleList = document.getElementById("module-list");

  // Obtener el role_id desde el servidor
  const userData = await getUserData(token);
  const roleId = userData.role_id; // El role_id viene desde el backend

  // Definir los módulos según el role_id
  const modules = {
    1: ["Contabilidad", "Recursos Humanos", "Inventarios"],  // Admin
    2: ["Contabilidad"], // Usuario de contabilidad
    3: ["Recursos Humanos"], // Usuario de recursos humanos
    4: ["Inventarios"], // Usuario de inventarios
  };

  // Mostrar los módulos como elementos de lista <li>
  modules[roleId]?.forEach((module) => {
    const li = document.createElement("li"); // Crear un elemento <li> en lugar de un botón
    li.textContent = module;
    li.classList.add("module-item"); // Asegúrate de que usas la clase para estilizar los elementos de lista
    li.addEventListener("click", () => {
      handleModuleClick(module);
    });
    moduleList.appendChild(li);
  });

  // Configuración del gráfico
  setupChart();

  // Cerrar sesión
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirigir al login
  });
}

// Función para obtener los datos del usuario desde el servidor
async function getUserData(token) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });
    
    const data = await response.json();
    if (response.ok) {
      return data; // Debería contener el role_id
    } else {
      throw new Error("No se pudo obtener los datos del usuario");
    }
  } catch (error) {
    console.error(error);
    window.location.href = "/"; // Redirigir al login si hay error
  }
}

// Función para manejar lo que sucede cuando un módulo es clickeado
function handleModuleClick(module) {
  alert(`Has clickeado en el módulo: ${module}`);
  // Puedes redirigir a diferentes páginas o ejecutar acciones aquí
}

// Función para configurar el gráfico
function setupChart() {
  const ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
      datasets: [{
        label: "Usuarios activos",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "#00ffff",
        borderColor: "#00ffff",
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}
