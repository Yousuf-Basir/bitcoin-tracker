import { useState, useEffect } from 'react';

export interface CryptoInfo {
  id: string;
  name: string;
  symbol: string;
  color: string;
}

export interface PriceData {
  price: number;
  change24h: number;
}

export interface ChartData {
  date: string;
  [key: string]: number | string; // Dynamic keys for each cryptocurrency
}

export interface CryptoPriceData {
  [cryptoId: string]: PriceData | null;
}

// List of supported cryptocurrencies
export const supportedCryptos: CryptoInfo[] = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
  { id: 'USDT', name: 'Tether', symbol: 'USDT', color: '#26A17B' },
  { id: 'BNB', name: 'BNB', symbol: 'BNB', color: '#F0B90B' },
  { id: 'SOL', name: 'Solana', symbol: 'SOL', color: '#00FFA3' },
//   { id: 'XRP', name: 'XRP', symbol: 'XRP', color: '#23292F' },
//   { id: 'USDC', name: 'USDC', symbol: 'USDC', color: '#2775CA' },
//   { id: 'ADA', name: 'Cardano', symbol: 'ADA', color: '#0033AD' },
//   { id: 'DOGE', name: 'Dogecoin', symbol: 'DOGE', color: '#C2A633' },
//   { id: 'AVAX', name: 'Avalanche', symbol: 'AVAX', color: '#E84142' },
];

// Map CoinGecko IDs to CryptoCompare symbols
const cryptoIdMap: Record<string, string> = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'tether': 'USDT',
  'binancecoin': 'BNB',
  'solana': 'SOL',
  'ripple': 'XRP',
  'usd-coin': 'USDC',
  'cardano': 'ADA',
  'dogecoin': 'DOGE',
  'avalanche-2': 'AVAX'
};

// Map CryptoCompare symbols to CoinGecko IDs
const reverseCryptoIdMap: Record<string, string> = Object.entries(cryptoIdMap)
  .reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});

const useCryptoCompare = (currency: string, selectedCryptos: string[] = ['bitcoin']) => {
  const [priceData, setPriceData] = useState<CryptoPriceData>({});
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string>('');

  // Helper function to get crypto name from ID
  const getCryptoName = (cryptoId: string): string => {
    const symbol = cryptoIdMap[cryptoId] || cryptoId;
    const crypto = supportedCryptos.find(c => c.id === symbol);
    return crypto ? crypto.name : cryptoId;
  };

  const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        // Add exponential backoff for retries
        if (i > 0) {
          const backoffDelay = delay * Math.pow(2, i - 1);
          console.log(`Waiting ${backoffDelay}ms before retry ${i + 1}`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
        
        console.log(`Fetching (attempt ${i + 1}/${retries}):`, url);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetch successful');
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
    return null;
  };

  const fetchPriceData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newPriceData: CryptoPriceData = {};
      
      // Convert CoinGecko IDs to CryptoCompare symbols
      const symbols = selectedCryptos.map(id => cryptoIdMap[id] || id);
      
      // Fetch all prices in a single request
      setLoadingStatus('Fetching current prices...');
      
      try {
        // Build URL with all symbols
        const symbolsParam = symbols.join(',');
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbolsParam}&tsyms=${currency}`;
        
        const data = await fetchWithRetry(url);
        
        if (data && data.RAW) {
          // Process each cryptocurrency
          selectedCryptos.forEach((cryptoId, index) => {
            const symbol = symbols[index];
            
            if (data.RAW[symbol] && data.RAW[symbol][currency]) {
              const cryptoData = data.RAW[symbol][currency];
              newPriceData[cryptoId] = {
                price: cryptoData.PRICE,
                change24h: cryptoData.CHANGEPCT24HOUR
              };
            } else {
              newPriceData[cryptoId] = null;
            }
          });
        }
      } catch (err) {
        console.error('Error fetching price data:', err);
        // Set all to null on error
        selectedCryptos.forEach(cryptoId => {
          newPriceData[cryptoId] = null;
        });
      }
      
      setPriceData(newPriceData);
    } catch (err) {
      console.error('Error in price data function:', err);
      setError('Failed to fetch price data');
    } finally {
      setLoadingStatus('');
    }
  };

  const fetchChartData = async (days: string) => {
    if (selectedCryptos.length === 0) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create a map to store all price data by timestamp
      const pricesByTimestamp: { [timestamp: number]: { [cryptoId: string]: number } } = {};
      
      // Convert days to limit (CryptoCompare uses number of data points)
      const limit = days === '1' ? 24 : 
                   days === '7' ? 168 : 
                   days === '30' ? 30 : 
                   days === '90' ? 90 : 
                   days === '365' ? 365 : 30;
                   
      // Determine interval based on days
      const interval = days === '1' ? 'hour' : 'day';
      
      // Fetch data for each selected cryptocurrency
      for (let i = 0; i < selectedCryptos.length; i++) {
        const cryptoId = selectedCryptos[i];
        const symbol = cryptoIdMap[cryptoId] || cryptoId;
        
        setLoadingStatus(`Fetching ${getCryptoName(cryptoId)} price history...`);
        
        try {
          // Add a delay between requests to avoid rate limiting
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          // Use histoday for daily data or histohour for hourly data
          const endpoint = interval === 'hour' ? 'histohour' : 'histoday';
          const url = `https://min-api.cryptocompare.com/data/v2/${endpoint}?fsym=${symbol}&tsym=${currency}&limit=${limit}`;
          
          const data = await fetchWithRetry(url);
          
          if (data && data.Response === 'Success' && data.Data && data.Data.Data) {
            data.Data.Data.forEach((item: any) => {
              const timestamp = item.time * 1000; // Convert to milliseconds
              
              if (!pricesByTimestamp[timestamp]) {
                pricesByTimestamp[timestamp] = {};
              }
              
              pricesByTimestamp[timestamp][cryptoId] = Math.round(item.close * 100) / 100;
            });
          }
        } catch (err) {
          console.error(`Error fetching ${cryptoId} chart data:`, err);
        }
      }
      
      // Convert the map to the chart data format
      const formattedData: ChartData[] = Object.entries(pricesByTimestamp)
        .map(([timestamp, prices]) => {
          const entry: ChartData = {
            date: new Date(parseInt(timestamp)).toISOString(),
            ...prices
          };
          return entry;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      console.log(`Chart data processed: ${formattedData.length} points`);
      setChartData(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      
      // Keep existing chart data if available
      if (chartData.length === 0) {
        setChartData([]);
      }
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  useEffect(() => {
    console.log(`Currency changed to: ${currency} or selected cryptos changed`);
    
    // Clear error when currency or selected cryptos change
    setError(null);
    
    // Fetch initial data
    fetchPriceData();
    fetchChartData('7');

    // Set up polling for real-time price updates every 30 seconds
    const priceInterval = setInterval(fetchPriceData, 30000);

    return () => {
      clearInterval(priceInterval);
    };
  }, [currency, selectedCryptos.join(',')]);

  return {
    priceData,
    chartData,
    isLoading,
    error,
    loadingStatus,
    fetchChartData
  };
};

export default useCryptoCompare;
