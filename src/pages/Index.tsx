
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ThemeToggle from '@/components/ThemeToggle';
import CurrencySelector from '@/components/CurrencySelector';
import CryptoSelector from '@/components/CryptoSelector';
import ConfigSettings from '@/components/ConfigSettings';
import PriceCard from '@/components/PriceCard';
import PriceChart from '@/components/PriceChart';
import useCryptoCompare, { supportedCryptos } from '@/hooks/useCryptoCompare';
import { useConfig } from '@/context/ConfigContext';
import { TrendingUp, BarChart3, Info, Settings } from 'lucide-react';

const Index = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>(['BTC']);
  const { priceData, chartData, isLoading, error, loadingStatus, fetchChartData } = useCryptoCompare(selectedCurrency, selectedCryptos);

  const handlePeriodChange = (period: string) => {
    fetchChartData(period);
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'BDT': '৳'
    };
    return symbols[currency] || '$';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bitcoin-gradient flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Crypto Compare</h1>
                <p className="text-xs text-muted-foreground">Multi-Coin Price Tracker</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5">
              <CurrencySelector 
                selectedCurrency={selectedCurrency} 
                onCurrencyChange={setSelectedCurrency} 
              />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-3 py-4 space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="animate-fade-in rounded-2xl">
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        {/* Crypto Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 px-0.5">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Select Cryptocurrencies</h2>
          </div>
          <Card className="animate-fade-in rounded-2xl bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3">
              <CryptoSelector
                selectedCryptos={selectedCryptos}
                onCryptoChange={setSelectedCryptos}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Price Section */}
        <div className="space-y-3">
          {selectedCryptos.length > 0 && selectedCryptos[0] === 'bitcoin' && priceData?.bitcoin && (
            <PriceCard
              price={priceData.bitcoin.price || 0}
              currency={selectedCurrency}
              change24h={priceData.bitcoin.change24h || 0}
              symbol={getCurrencySymbol(selectedCurrency)}
              isLoading={!priceData.bitcoin && isLoading}
            />
          )}
          
          {/* Loading Status */}
          {loadingStatus && (
            <Card className="animate-fade-in rounded-2xl bg-card/50 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center animate-pulse">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Status</p>
                    <p className="text-sm font-medium">{loadingStatus}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chart Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 px-0.5">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Price Chart</h2>
          </div>
          <PriceChart
            data={chartData}
            isLoading={isLoading}
            loadingStatus={loadingStatus}
            selectedCryptos={selectedCryptos}
            onPeriodChange={handlePeriodChange}
          />
        </div>

        {/* Settings Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 px-0.5">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Settings</h2>
          </div>
          <ConfigSettings className="animate-fade-in rounded-2xl" />
        </div>

        {/* About Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 px-0.5">
            <Info className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">About This App</h2>
          </div>
          <Card className="animate-fade-in rounded-2xl bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <p className="text-muted-foreground leading-relaxed text-xs">
                This cryptocurrency comparison tool allows you to track and compare price data for multiple cryptocurrencies 
                including Bitcoin, Ethereum, Tether, BNB, Solana. 
                Select the cryptocurrencies you want to compare, choose your preferred currency, and view real-time 
                price data and historical charts to help you monitor their performance.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Mobile Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-6">
        <div className="px-3 py-4 text-center">
          <p className="text-xs text-muted-foreground">Data by CoinGecko API</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {useConfig().config.autoRefreshEnabled 
              ? `Updates every ${useConfig().config.refreshIntervalMs / 1000} seconds` 
              : 'Auto-refresh disabled'} 
            • {selectedCryptos.length} coins selected
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
