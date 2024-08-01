// api/proxy.js

export default async (req, res) => {
    const response = await fetch(`http://13.124.235.221:8080${req.url}`, {
        method: req.method,
        headers: {
            ...req.headers,
            'Content-Type': 'application/json'
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    const data = await response.text();
    res.status(response.status).send(data);
};
