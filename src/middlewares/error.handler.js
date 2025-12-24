/**
 * Middleware de manejo de errores centralizado
 */

export default (err, _req, res, _next) => {
  console.error("[ERROR]", err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Error interno' });
};