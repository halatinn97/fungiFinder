import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use('/_api', createProxyMiddleware({
    target: 'https://api.inaturalist.org/v1/observations?place_id=any&iconic_taxa=Fungi',
    changeOrigin: true,
    pathRewrite: {
        '^/_api': '',
    }
}));

app.listen(5500);
