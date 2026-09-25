<<<<<<< HEAD
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas privadas protegidas por JWT */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
=======
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      return;
    }

    loadCurrentUser(token);
  }, []);

  async function loadCurrentUser(token) {
    try {
      const response = await fetch(
        `${API_URL}/api/identity/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        sessionStorage.removeItem("access_token");
        return;
      }

      const data = await response.json();
      setUser(data);
    } catch {
      setError("No fue posible consultar la información del usuario");
    }
  }

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const body = new URLSearchParams();
      body.append("username", username);
      body.append("password", password);

      const response = await fetch(
        `${API_URL}/api/identity/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "No fue posible iniciar sesión",
        );
      }

      sessionStorage.setItem(
        "access_token",
        data.access_token,
      );

      await loadCurrentUser(data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("access_token");
    setUser(null);
    setUsername("");
    setPassword("");
    setError("");
  }

  if (user) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-card">
          <div className="dashboard-header">
            <span className="badge">DevSecOps</span>
            <h1>RBAC Platform</h1>
            <p>Panel de control</p>
          </div>

          <div className="user-info">
            <h2>Bienvenido, {user.full_name}</h2>

            <div className="info-row">
              <strong>Usuario</strong>
              <span>{user.username}</span>
            </div>

            <div className="info-row">
              <strong>Correo</strong>
              <span>{user.email}</span>
            </div>

            <div className="info-row">
              <strong>Rol</strong>
              <span>{user.role}</span>
            </div>

            <div className="info-row">
              <strong>Empresa</strong>
              <span>
                {user.company_name ?? "Acceso global"}
              </span>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Módulos</h2>

            <div className="module-grid">
              {user.role === "superadmin" && (
                <>
                  <button className="module-card">
                    Empresas
                  </button>

                  <button className="module-card">
                    Usuarios
                  </button>

                  <button className="module-card">
                    RBAC
                  </button>

                  <button className="module-card">
                    Auditoría
                  </button>
                </>
              )}

              {user.role === "admin" && (
                <>
                  <button className="module-card">
                    Usuarios
                  </button>

                  <button className="module-card">
                    RBAC
                  </button>

                  <button className="module-card">
                    Auditoría
                  </button>
                </>
              )}

              {user.role === "user" && (
                <button className="module-card">
                  Mis permisos
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Cerrar sesión
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <span className="badge">DevSecOps</span>

          <h1>RBAC Platform</h1>

          <p>
            Gestión segura de usuarios, roles y permisos
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label htmlFor="username">
            Usuario
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            placeholder="Ingresa tu usuario"
            autoComplete="username"
            required
          />

          <label htmlFor="password">
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Iniciando sesión..."
              : "Iniciar sesión"}
          </button>
        </form>

        <footer>
          <small>
            Acceso protegido por Identity Service
          </small>
        </footer>
      </section>
    </main>
  );
}

export default App;
>>>>>>> upstream/main
