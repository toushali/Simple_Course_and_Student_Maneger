module.exports = (req, res, next) => {
    const providedKey = req.headers['x-api-key'];
    const expectedKey = process.env.API_KEY;

    if (!providedKey) {
        return res.status(401).json({ error: 'Missing x-api-key header' });
    }
    if (providedKey !== expectedKey) {
        return res.status(401).json({ error: 'Invalid API key' });
    }

    next();
};