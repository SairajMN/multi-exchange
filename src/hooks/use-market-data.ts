import { useState, useEffect } from 'react';
import { fetchBybitMarketData } from '@/api/bybit';

const useMarketData = (exchange: string, symbols: string[]) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchBybitMarketData(exchange, symbols);
        setMarketData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, [exchange, symbols]);

  return { marketData, isLoading, error };
};

export default useMarketData;