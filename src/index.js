const express = require('express');
const rateLimit = require('express-rate-limit')
const { createProxyMiddleware } = require('http-proxy-middleware');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,        // 2 minute window
    max: 10                          // 3 request limit
})

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/flights', createProxyMiddleware({target: `${ServerConfig.FLIGHT_SERVICE}`, changeOrigin: true, pathRewrite: {'^/flights':'/'}}));

app.use('/booking', createProxyMiddleware({target: `${ServerConfig.BOOKING_SERVICE}`, changeOrigin: true, pathRewrite: {'^/booking':'/'}}));


app.use('/api',limiter)
app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
