# API Connection Setup Guide

## Overview

The trading application now supports real API connections to multiple exchanges with CORS-safe implementation.

## Features

### ✅ **Working Features:**
- **API Key Persistence**: Keys are automatically saved to localStorage
- **Demo Mode**: Test the interface with demo credentials
- **Real API Testing**: Test actual API connections when proxy server is running
- **CORS-Safe Implementation**: Uses proxy server to avoid CORS issues
- **Deploy Live Button**: Functional deployment simulation
- **Charts Refresh**: Working refresh functionality with loading states

## Setup Instructions

### 1. **Quick Start (Demo Mode)**
```bash
npm run dev
```
- Open http://localhost:8081
- Click "Enable Demo Mode" in the API Config tab
- Test connections with demo credentials

### 2. **Full Setup with Real API Testing**
```bash
# Install dependencies
npm install

# Start both frontend and proxy server
npm run dev:full
```
- Frontend: http://localhost:8081
- Proxy Server: http://localhost:3001

### 3. **Individual Server Setup**
```bash
# Terminal 1: Start proxy server
npm run server

# Terminal 2: Start frontend
npm run dev
```

## API Connection Testing

### **Demo Mode**
- ✅ **Always Works**: Simulates successful connections
- ✅ **No Real API Keys Required**: Safe for testing
- ✅ **Full Interface Testing**: Test all features

### **Real API Mode**
- ✅ **Proxy Server Required**: Handles CORS issues
- ✅ **Real API Keys**: Test actual exchange connections
- ✅ **Fallback Support**: Works even without proxy server

## Exchange Support

### **Binance**
- **API Endpoint**: `/api/v3/account`
- **Authentication**: HMAC-SHA256 signature
- **Testnet Support**: ✅ Yes
- **CORS Status**: ✅ Resolved via proxy

### **Bybit**
- **API Endpoint**: `/v2/private/wallet/balance`
- **Authentication**: HMAC-SHA256 signature
- **Testnet Support**: ✅ Yes
- **CORS Status**: ✅ Resolved via proxy

### **Dhan**
- **API Endpoint**: `/orders`
- **Authentication**: Access Token
- **Testnet Support**: ❌ No (uses live API)
- **CORS Status**: ✅ Resolved via proxy

## Troubleshooting

### **CORS Errors**
If you see CORS errors in the console:
1. Make sure the proxy server is running (`npm run server`)
2. Check that the proxy server is accessible at http://localhost:3001/health
3. The application will automatically fall back to simulation mode

### **API Connection Failures**
1. **Check API Keys**: Ensure keys are correct and have proper permissions
2. **Testnet vs Live**: Verify you're using the correct environment
3. **Network Issues**: Check your internet connection
4. **Rate Limits**: Some exchanges have rate limits on API calls

### **Proxy Server Issues**
1. **Port Conflicts**: Ensure port 3001 is available
2. **Dependencies**: Run `npm install` to install server dependencies
3. **Node.js Version**: Ensure you have Node.js 14+ installed

## Security Notes

### **API Key Storage**
- ✅ **Local Storage**: Keys are stored in browser localStorage
- ✅ **Encrypted Display**: Keys are hidden in password fields
- ✅ **No Server Storage**: Keys are never sent to external servers (except exchange APIs)

### **Best Practices**
- 🔒 **Use Testnet**: Test with testnet APIs first
- 🔒 **Limited Permissions**: Only enable necessary API permissions
- 🔒 **Regular Rotation**: Rotate API keys regularly
- 🔒 **Secure Environment**: Don't use real keys in development

## Development

### **Adding New Exchanges**
1. Add exchange configuration in `ApiConfigTab.tsx`
2. Create proxy endpoint in `server.js`
3. Update connection testing function
4. Add exchange-specific UI elements

### **Customizing API Calls**
- Modify proxy endpoints in `server.js`
- Update connection functions in `ApiConfigTab.tsx`
- Add new authentication methods as needed

## API Response Examples

### **Successful Connection**
```json
{
  "success": true,
  "data": {
    "makerCommission": 15,
    "takerCommission": 15,
    "buyerCommission": 0,
    "sellerCommission": 0,
    "canTrade": true,
    "canWithdraw": true,
    "canDeposit": true
  }
}
```

### **Failed Connection**
```json
{
  "success": false,
  "error": "Invalid API key"
}
```

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify proxy server is running
3. Test with demo mode first
4. Check exchange API documentation for specific requirements 