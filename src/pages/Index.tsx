
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ThemeToggle from '@/components/ThemeToggle';
import CurrencySelector from '@/components/CurrencySelector';
import PriceCard from '@/components/PriceCard';
import PriceChart from '@/components/PriceChart';
import useBitcoinPrice from '@/hooks/useBitcoinPrice';
import { TrendingUp, BarChart3, Info } from 'lucide-react';

const Index = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const { priceData, chartData, isLoading, error, fetchChartData } = useBitcoinPrice(selectedCurrency);

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
                <h1 className="text-lg font-bold text-foreground">Bitcoin</h1>
                <p className="text-xs text-muted-foreground">Live Price Tracker</p>
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

        {/* Price Section */}
        <div className="space-y-3">
          <PriceCard
            price={priceData?.price || 0}
            currency={selectedCurrency}
            change24h={priceData?.change24h || 0}
            symbol={getCurrencySymbol(selectedCurrency)}
            isLoading={!priceData && isLoading}
          />
          
          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <Card className="animate-fade-in rounded-2xl bg-card/50 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Rank</p>
                    <p className="text-sm font-bold">#1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in rounded-2xl bg-card/50 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">24h Vol</p>
                    <p className="text-sm font-bold">High</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
            onPeriodChange={handlePeriodChange}
          />
        </div>

        {/* About Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 px-0.5">
            <Info className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">About Bitcoin</h2>
          </div>
          <Card className="animate-fade-in rounded-2xl bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <p className="text-muted-foreground leading-relaxed text-xs">
                Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network. 
                Bitcoin transactions are verified by network nodes through cryptography and recorded in a public 
                distributed ledger called a blockchain. This tracker provides real-time price data and historical 
                charts to help you monitor Bitcoin's performance.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Mobile Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-6">
        <div className="px-3 py-4 text-center">
          <p className="text-xs text-muted-foreground">Data by CoinGecko API</p>
          <p className="text-[10px] text-muted-foreground mt-1">Updates every 30 seconds</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
