
export const getUsuarioActual = () => {
  const usuarioStr = localStorage.getItem('usuario');
  if (!usuarioStr) return null;
  
  try {
    return JSON.parse(usuarioStr);
  } catch (error) {
    return null;
  }
};

export const esPrestador = () => {
  const usuario = getUsuarioActual();
  if (!usuario) return false;

  
  return usuario.rol === 'PRESTADOR' || usuario.cod_rol === 2;
};

export const esSolicitante = () => {
  const usuario = getUsuarioActual();
  if (!usuario) return false;

  return usuario.rol === 'SOLICITANTE' || usuario.cod_rol === 1;
};