import { useState, useEffect } from 'react';
import { fetchBybitChartData } from '@/api/bybit';

const useCryptoData = (exchange: string, symbol: string) => {
  const [currentPrice, setCurrentPrice] = useState<CryptoPrice | null>(null);
  const [chartData, setChartData] = useState<KlineData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchBybitChartData(exchange, symbol);
        setChartData(data);
        setCurrentPrice(data[data.length - 1]);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [exchange, symbol]);

  return { currentPrice, chartData, isLoading, error };
};