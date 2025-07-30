import express from 'express';
import cors from 'cors';
import axios from 'axios';
import crypto from 'crypto';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // Ensure this is at the top!

app.post('/api/bybit/test', (req, res) => {
  console.log('Received body:', req.body); // For debugging
  const { apiKey, secretKey, testnet } = req.body;
  if (!apiKey || !secretKey) {
    return res.status(400).json({ success: false, error: "Missing apiKey or secretKey" });
  }
  // Optionally, test the credentials with Bybit API here
  // For now, just return success for demonstration
  res.status(200).json({ success: true });
});

// Binance API proxy
app.post('/api/binance/test', async (req, res) => {
    try {
        const { apiKey, secretKey, testnet } = req.body;
        const baseUrl = testnet ? 'https://testnet.binance.vision' : 'https://api.binance.com';
        const timestamp = Date.now();
        const queryString = `timestamp=${timestamp}`;
        const signature = generateSignature(queryString, secretKey);

        const response = await axios.get(`${baseUrl}/api/v3/account?${queryString}&signature=${signature}`, {
            headers: {
                'X-MBX-APIKEY': apiKey,
                'Content-Type': 'application/json'
            }
        });

        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Binance API error:', error.response?.data || error.message);
        res.status(400).json({
            success: false,
            error: error.response?.data?.msg || error.message
        });
    }
});

// Dhan API proxy
app.post('/api/dhan/test', async (req, res) => {
    try {
        const { apiKey } = req.body;

        const response = await axios.get('https://api.dhan.co/orders', {
            headers: {
                'access-token': apiKey,
                'Content-Type': 'application/json'
            }
        });

        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Dhan API error:', error.response?.data || error.message);
        res.status(400).json({
            success: false,
            error: error.response?.data?.message || error.message
        });
    }
});

// Real-time crypto price endpoints
app.get('/api/prices/:exchange/:symbol', async (req, res) => {
    try {
        const { exchange, symbol } = req.params;

        if (exchange === 'bybit') {
            // Use the correct Bybit API endpoint for ticker data
            const response = await axios.get(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`);
            res.json({ success: true, data: response.data });
        } else if (exchange === 'binance') {
            const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
            res.json({ success: true, data: response.data });
        } else {
            res.status(400).json({ success: false, error: 'Unsupported exchange' });
        }
    } catch (error) {
        console.error('Price fetch error:', error.response?.data || error.message);
        res.status(400).json({
            success: false,
            error: error.response?.data?.ret_msg || error.message
        });
    }
});

// Historical kline/candlestick data
app.get('/api/klines/:exchange/:symbol/:interval', async (req, res) => {
    try {
        const { exchange, symbol, interval } = req.params;
        const limit = req.query.limit || 100;

        // Map intervals to exchange-specific formats
        const intervalMap = {
            '1m': { bybit: '1', binance: '1m' },
            '3m': { bybit: '3', binance: '3m' },
            '5m': { bybit: '5', binance: '5m' },
            '15m': { bybit: '15', binance: '15m' },
            '30m': { bybit: '30', binance: '30m' },
            '1h': { bybit: '60', binance: '1h' },
            '2h': { bybit: '120', binance: '2h' },
            '4h': { bybit: '240', binance: '4h' },
            '6h': { bybit: '360', binance: '6h' },
            '12h': { bybit: '720', binance: '12h' },
            '1d': { bybit: 'D', binance: '1d' },
            '1w': { bybit: 'W', binance: '1w' },
            '1M': { bybit: 'M', binance: '1M' }
        };

        const mappedInterval = intervalMap[interval]?.[exchange] || interval;

        if (exchange === 'bybit') {
            // Use the correct Bybit API endpoint for kline data
            const response = await axios.get(`https://api.bybit.com/v5/market/kline?category=spot&symbol=${symbol}&interval=${mappedInterval}&limit=${limit}`);
            res.json({ success: true, data: response.data });
        } else if (exchange === 'binance') {
            const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${mappedInterval}&limit=${limit}`);
            res.json({ success: true, data: response.data });
        } else {
            res.status(400).json({ success: false, error: 'Unsupported exchange' });
        }
    } catch (error) {
        console.error('Klines fetch error:', error.response?.data || error.message);
        res.status(400).json({
            success: false,
            error: error.response?.data?.ret_msg || error.message
        });
    }
});

// Get available symbols for an exchange
app.get('/api/symbols/:exchange', async (req, res) => {
    try {
        const { exchange } = req.params;

        if (exchange === 'bybit') {
            // Use the correct Bybit API endpoint for symbols
            const response = await axios.get('https://api.bybit.com/v5/market/instruments-info?category=spot');
            res.json({ success: true, data: response.data });
        } else if (exchange === 'binance') {
            const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
            res.json({ success: true, data: response.data });
        } else {
            res.status(400).json({ success: false, error: 'Unsupported exchange' });
        }
    } catch (error) {
        console.error('Symbols fetch error:', error.response?.data || error.message);
        res.status(400).json({
            success: false,
            error: error.response?.data?.ret_msg || error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Trading API Proxy Server is running' });
});

app.get('/api/bybit/price', async (req, res) => {
    const symbol = req.query.symbol || 'BTCUSDT';
    try {
        // Example: fetch from Bybit public API
        const response = await fetch(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`);
        const data = await response.json();
        // Adjust parsing as needed for Bybit's API response
        const price = data.result?.list?.[0]?.lastPrice;
        if (price) {
            res.json({ price });
        } else {
            res.status(500).json({ error: 'Price not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch price' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Trading API Proxy Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});