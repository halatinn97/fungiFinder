import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use('/_api', createProxyMiddleware({
    target: 'https://api.inaturalist.org/v1/taxa?taxon_id=47170&rank=species&page=50&per_page=200',
    changeOrigin: true,
    pathRewrite: {
        '^/_api': '',
    }
}));

app.listen(5500);
