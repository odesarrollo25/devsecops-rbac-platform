import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas o servicio no disponible.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <ShieldCheck size={44} color="#2563eb" />
          <h2 style={{ margin: '8px 0 4px', fontSize: '1.4rem' }}>Plataforma IGA</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            Acceso Consola de Tecnología
          </p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Usuario</label>
            <div style={styles.inputWrapper}>
              <User size={18} color="#94a3b8" style={styles.icon} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="analista"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#94a3b8" style={styles.icon} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={submitting} style={styles.button}>
            {submitting ? 'Autenticando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', fontFamily: 'system-ui, sans-serif' },
  card: { width: '100%', maxWidth: '380px', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
  header: { textAlign: 'center', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#334155' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: '12px' },
  input: { width: '100%', padding: '0.7rem 0.7rem 0.7rem 2.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' },
  button: { padding: '0.75rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' },
  error: { padding: '0.6rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.8rem', textAlign: 'center' },
};