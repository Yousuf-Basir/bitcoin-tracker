
import { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';

interface PriceData {
  price: number;
  change24h: number;
}

interface ChartData {
  date: string;
  price: number;
}

const useBitcoinPrice = (currency: string) => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Fetching (attempt ${i + 1}/${retries}):`, url);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetch successful:', data);
        return data;
      } catch (err) {
        console.log(`Fetch attempt ${i + 1} failed:`, err);
        
        if (i === retries - 1) {
          throw err;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  };

  const fetchCurrentPrice = async () => {
    try {
      const data = await fetchWithRetry(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency.toLowerCase()}&include_24hr_change=true`
      );
      
      const price = data.bitcoin[currency.toLowerCase()];
      const change24h = data.bitcoin[`${currency.toLowerCase()}_24h_change`];

      if (price !== undefined && change24h !== undefined) {
        setPriceData({ price, change24h });
        setError(null); // Clear error on successful fetch
        console.log('Price data updated:', { price, change24h });
      } else {
        throw new Error('Invalid price data received');
      }
    } catch (err) {
      // setError('Failed to fetch Bitcoin price');
      console.error('Error fetching price:', err);
    }
  };

  const fetchChartData = async (days: string) => {
    try {
      setIsLoading(true);
      setError(null); // Clear error when starting new fetch
      console.log(`Fetching chart data for ${days} days in ${currency}`);
      
      const data = await fetchWithRetry(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${currency.toLowerCase()}&days=${days}`
      );
      
      if (data && data.prices && Array.isArray(data.prices)) {
        const formattedData = data.prices.map(([timestamp, price]: [number, number]) => ({
          date: new Date(timestamp).toISOString(),
          price: Math.round(price * 100) / 100
        }));

        console.log(`Chart data processed: ${formattedData.length} points`);
        setChartData(formattedData);
        setError(null); // Clear error on successful fetch
      } else {
        throw new Error('Invalid chart data format received');
      }
    } catch (err) {
      // setError('Failed to fetch chart data');
      console.error('Error fetching chart data:', err);
      
      // Keep existing chart data if available, don't clear it on error
      if (chartData.length === 0) {
        // Only set empty data if we have no data at all
        setChartData([]);
      }
    } finally {
      setIsLoading(false);
    }
  }; 

  // Get config from context
  const { config } = useConfig();

  useEffect(() => {
    console.log(`Currency changed to: ${currency}`);
    
    // Clear error when currency changes
    setError(null);
    
    // Fetch initial data
    fetchCurrentPrice();
    fetchChartData('7');

    // Set up polling for real-time price updates based on config
    let priceInterval: NodeJS.Timeout | null = null;
    
    if (config.autoRefreshEnabled) {
      console.log(`Auto-refresh enabled with interval: ${config.refreshIntervalMs}ms`);
      priceInterval = setInterval(fetchCurrentPrice, config.refreshIntervalMs);
    } else {
      console.log('Auto-refresh disabled');
    }

    return () => {
      if (priceInterval) {
        clearInterval(priceInterval);
      }
    };
  }, [currency, config.autoRefreshEnabled, config.refreshIntervalMs]);

  return {
    priceData,
    chartData,
    isLoading,
    error,
    fetchChartData
  };
};

export default useBitcoinPrice;
