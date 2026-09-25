import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogOut, AppWindow, Building2, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Consulta directa al Gateway -> MS2: RBAC
        const response = await api.get('/rbac/applications');
        setApplications(response.data);
      } catch (err) {
        console.error('Error al consultar aplicaciones:', err);
        setError('No se pudo conectar con el servicio RBAC. Verifica que los contenedores estén activos.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div style={styles.container}>
      {/* Barra superior de navegación */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Plataforma IGA — Consola de Gobierno</h1>
          <p style={styles.subtitle}>
            Sesión activa: <strong>{user?.full_name || user?.username}</strong> | Rol: <code>{user?.role}</code>
          </p>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </header>

      {/* Contenido principal */}
      <main style={styles.main}>
        <div style={styles.sectionHeader}>
          <Building2 size={22} color="#2563eb" />
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>
            Catálogo de Aplicativos Corporativos
          </h2>
        </div>

        {error && (
          <div style={styles.alert}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div style={styles.infoText}>Cargando catálogo desde el backend...</div>
        ) : applications.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={{ margin: 0 }}>No hay aplicativos registrados en la base de datos RBAC aún.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {applications.map((app) => (
              <div key={app.id} style={styles.card}>
                <div style={styles.cardIcon}>
                  <AppWindow size={24} color="#2563eb" />
                </div>
                <div>
                  <h3 style={styles.cardTitle}>{app.name}</h3>
                  <span style={styles.badge}>{app.code}</span>
                  <p style={styles.cardMeta}>
                    ID Sistema: {app.id} | Creado: {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2.5rem', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' },
  title: { margin: 0, fontSize: '1.2rem', color: '#0f172a' },
  subtitle: { margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#ffffff', color: '#475569', cursor: 'pointer', fontWeight: 500 },
  main: { maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' },
  card: { display: 'flex', gap: '1rem', backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  cardIcon: { padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '8px', height: 'fit-content' },
  cardTitle: { margin: '0 0 6px', fontSize: '1.05rem', color: '#1e293b' },
  badge: { display: 'inline-block', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 },
  cardMeta: { margin: '8px 0 0', fontSize: '0.75rem', color: '#94a3b8' },
  emptyCard: { padding: '2rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px dashed #cbd5e1', color: '#64748b' },
  infoText: { padding: '1rem 0', color: '#64748b' },
  alert: { display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem' },
};