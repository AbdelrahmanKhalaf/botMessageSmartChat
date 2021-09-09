"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
const keys = require("./kyes");
exports.default = {
    oauth: {
        subdomain: "api",
        consumer_key: 'QYOQw0yqPdZ9vaohdfeHOUKlw',
        consumer_secret: "ksUublOSHVpfsWtE2GzE9pKi5IV870rmCfyDfIlgmzYdxf5lU9",
        access_token_key: "1419705782732525573-1419705782732525573-OG07XXkvwUwQr9B31f9hK3LH6J6yyw",
        access_token_secret: "b9IWKcLbhZ2OZuLTczGnmviQjytMPAB6WP4g19tVes4Yo"
    },
    JTWSecretPivate: "mySecrtt",
    baseUrl: baseUrl,
    secretSession: "mySuberSecret",
    secretPassword: "DGYUHNJLORFF^$**^LVG:LFG++GKCFGW##WDGLKGL",
    secretToken: "DGYUHNJLORFF^$**^LVG:LFG++GKCFGW##W%$#$#FFF",
    apiKey: "ec6cd001556695eff89219bf6db28ae1-f7d0b107-b163b7c0",
    DOMAIN: "sandboxc1bd8898b47e42da8ba2d87e6b66805b.mailgun.org",
    PublishableKeyPyment: "pk_test_51IagleAfXdjHojpnGfHyiZ9YDQXPlZFp5bykpZ9aIFSEXbHLITTXtTQTPmLXsVdYuUzDEzl8stvz0T5tUlKTTtJU00hx5sLZl5",
    secreteKeyStripe: "sk_test_51IagleAfXdjHojpn4uKEvYySsIrDbh41FVSzAGI6UHzsyzPuZFiAmgkNHhBPholRClYswd6mRQBzPpCBN6KYG5wW00ZC1BN7bW",
    port: port,
    GEOCODER_PROVIDER: 'mapquest',
    GEOCODER_API_KEY: 'eNVkyidlqPESQLhGSa9B2Z8JfDGcWKmG',
    oauth2Credentials: {
        clinteId: keys.web.client_id,
        projectId: keys.web.project_id,
        authUri: keys.web.auth_uri,
        tockenUri: keys.web.token_uri,
        auth_provider_x509_cert_url: keys.web.auth_provider_x509_cert_url,
        client_secret: keys.web.client_secret,
        redirect_uris: [keys.web.redirect_uris[0]],
        scopes: [
            "https://www.googleapis.com/auth/youtube.readonly",
            "https://www.googleapis.com/auth/youtube.force-ssl ",
        ],
    },
};
//# sourceMappingURL=config.js.map