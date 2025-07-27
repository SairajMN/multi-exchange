import { useState, useEffect, useCallback } from 'react';

interface CryptoPrice {
    symbol: string;
    price: number;
    change24h: number;
    volume: number;
    high24h: number;
    low24h: number;
    lastUpdated: number;
}

interface KlineData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

interface UseCryptoDataReturn {
    currentPrice: CryptoPrice | null;
    chartData: KlineData[];
    isLoading: boolean;
    error: string | null;
    refreshData: () => void;
    fetchRealTimeData: (symbol: string, exchange: string) => void;
}

export const useCryptoData = (): UseCryptoDataReturn => {
    const [currentPrice, setCurrentPrice] = useState<CryptoPrice | null>(null);
    const [chartData, setChartData] = useState<KlineData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPriceData = useCallback(async (symbol: string, exchange: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:3001/api/prices/${exchange}/${symbol}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                const data = result.data.result || result.data;

                if (exchange === 'bybit' && data.list && data.list[0]) {
                    const ticker = data.list[0];
                    setCurrentPrice({
                        symbol: ticker.symbol,
                        price: parseFloat(ticker.lastPrice),
                        change24h: parseFloat(ticker.price24hPcnt) * 100,
                        volume: parseFloat(ticker.volume24h),
                        high24h: parseFloat(ticker.highPrice24h),
                        low24h: parseFloat(ticker.lowPrice24h),
                        lastUpdated: Date.now()
                    });
                } else if (exchange === 'binance') {
                    setCurrentPrice({
                        symbol: data.symbol,
                        price: parseFloat(data.lastPrice),
                        change24h: parseFloat(data.priceChangePercent),
                        volume: parseFloat(data.volume),
                        high24h: parseFloat(data.highPrice),
                        low24h: parseFloat(data.lowPrice),
                        lastUpdated: Date.now()
                    });
                }
            } else {
                throw new Error(result.error || 'Failed to fetch price data');
            }
        } catch (err) {
            console.error('Error fetching price data:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch price data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchChartData = useCallback(async (symbol: string, exchange: string, interval: string = '1h', limit: number = 100) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:3001/api/klines/${exchange}/${symbol}/${interval}?limit=${limit}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                const data = result.data.result || result.data;

                let formattedData: KlineData[] = [];

                if (exchange === 'bybit' && data.list) {
                    // Bybit V5 API returns data in reverse chronological order
                    formattedData = data.list.map((kline: any) => ({
                        time: parseInt(kline[0]),
                        open: parseFloat(kline[1]),
                        high: parseFloat(kline[2]),
                        low: parseFloat(kline[3]),
                        close: parseFloat(kline[4]),
                        volume: parseFloat(kline[5])
                    }));
                } else if (exchange === 'binance') {
                    formattedData = data.map((kline: any) => ({
                        time: kline[0],
                        open: parseFloat(kline[1]),
                        high: parseFloat(kline[2]),
                        low: parseFloat(kline[3]),
                        close: parseFloat(kline[4]),
                        volume: parseFloat(kline[5])
                    }));
                }

                setChartData(formattedData);
            } else {
                throw new Error(result.error || 'Failed to fetch chart data');
            }
        } catch (err) {
            console.error('Error fetching chart data:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch chart data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchRealTimeData = useCallback((symbol: string, exchange: string) => {
        fetchPriceData(symbol, exchange);
        fetchChartData(symbol, exchange);
    }, [fetchPriceData, fetchChartData]);

    const refreshData = useCallback(() => {
        if (currentPrice) {
            fetchRealTimeData(currentPrice.symbol, 'bybit'); // Default to bybit for now
        }
    }, [currentPrice, fetchRealTimeData]);

    return {
        currentPrice,
        chartData,
        isLoading,
        error,
        refreshData,
        fetchRealTimeData
    };
}; 