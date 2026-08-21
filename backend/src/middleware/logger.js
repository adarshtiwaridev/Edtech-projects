/**
 * Structured HTTP Request Logger Middleware
 * Logs method, route, status code, response time, and IP cleanly without exposing credentials.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const ip = req.ip || req.connection.remoteAddress || "127.0.0.1";
    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl || req.url;

    // Standardized log output
    console.log(`[HTTP] ${new Date().toISOString()} | ${method} ${url} | ${status} | ${duration}ms | IP: ${ip}`);
  });

  next();
};

module.exports = requestLogger;
