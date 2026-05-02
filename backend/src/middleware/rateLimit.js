const WINDOW_MS = 15 * 60 * 1000;   // 15 minutes
const MAX_REQUESTS = 100;
const hits = new Map();              // IP → { count, windowStart }

module.exports = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    let entry = hits.get(ip);

    // Start a new window if none exists or the old one expired
    if (!entry || now - entry.windowStart > WINDOW_MS) {
        entry = { count: 0, windowStart: now };
    }

    entry.count += 1;
    hits.set(ip, entry);

    if (entry.count > MAX_REQUESTS) {
        const retryAfterSeconds = Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000);
        res.setHeader('Retry-After', retryAfterSeconds);
        return res.status(429).json({
            error: 'Too many requests',
            retryAfter: `${retryAfterSeconds} seconds`
        });
    }

    next();
};

// Periodic cleanup: prevent the Map from growing indefinitely
// as new IPs hit the server. Runs once per window.
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits.entries()) {
        if (now - entry.windowStart > WINDOW_MS) {
            hits.delete(ip);
        }
    }
}, WINDOW_MS).unref();