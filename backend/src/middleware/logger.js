const fs = require('fs');
const path = require('path');

// Resolve the log file path — logs/requests.log at the project root
const LOG_PATH = path.join(__dirname, '..', '..', 'logs', 'requests.log');

module.exports = (req, res, next) => {
    const start = Date.now();

    // The 'finish' event fires after the response has been sent.
    // We wait for it so we can include the final status code and response time.
    res.on('finish', () => {
        const durationMs = Date.now() - start;
        const line = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms\n`;

        // 1. Console — visible while running `npm run dev`
        process.stdout.write(line);

        // 2. File — persistent record
        fs.appendFile(LOG_PATH, line, (err) => {
            if (err) console.error('Log write failed:', err.message);
        });
    });

    next();
};