const configureHost = () => {
    const externalUrl = process.env.RENDER_EXTERNAL_URL;
    const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : parseInt(process.env.PWAD_PORT || "3000");
    const host = process.env.PWAD_HOST;
    const baseUrl = externalUrl || `${host}:${port}`;
    return {
        externalUrl: externalUrl,
        port: port,
        host: host,
        baseUrl: baseUrl
    }
}


module.exports = { configureHost }