import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use('/_api', createProxyMiddleware({
    target: 'https://api.gbif.org/v1',
    changeOrigin: true,
    pathRewrite: {
        '^/_api': '',
        '^/occurrence': '/occurrence'
    }
}));

app.listen(5500);
