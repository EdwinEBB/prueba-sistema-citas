export const getUsuarioActual = () => {
  const usuarioStr = localStorage.getItem('usuario');
  if (!usuarioStr) return null;
  try {
    return JSON.parse(usuarioStr);
  } catch {
    return null;
  }
};

export const esPrestador = () => {
  const usuario = getUsuarioActual();
  if (!usuario) return false;
  const rol = String(usuario.rol || usuario.cod_rol || '').toLowerCase();
  return rol === 'prestador' || rol === '2';
};