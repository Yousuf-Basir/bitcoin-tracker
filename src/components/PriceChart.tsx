
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';
import { supportedCryptos, CryptoInfo } from '@/hooks/useCryptoCompare';

interface ChartData {
  date: string;
  [key: string]: number | string; // Dynamic keys for each cryptocurrency
}

interface PriceChartProps {
  data: ChartData[];
  isLoading?: boolean;
  loadingStatus?: string;
  selectedCryptos?: string[];
  onPeriodChange: (period: string) => void;
}

const periods = [
  { label: '7D', value: '7' },
  { label: '30D', value: '30' },
  { label: '90D', value: '90' }
];

const PriceChart = ({ data, isLoading, loadingStatus, selectedCryptos = ['BTC'], onPeriodChange }: PriceChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7');

  const handlePeriodClick = (period: string) => {
    console.log(`Period changed to: ${period}`);
    setSelectedPeriod(period);
    onPeriodChange(period);
  };

  // Format price values to short form (e.g., 1K, 7M)  
  const formatPrice = (value: number): string => {
    if (!value && value !== 0) return '-';
    
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  // Format date to readable format (e.g., 20th May, 1st Jan)
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    
    // Add ordinal suffix to day
    const ordinalSuffix = (day: number): string => {
      if (day > 3 && day < 21) return `${day}th`;
      switch (day % 10) {
        case 1: return `${day}st`;
        case 2: return `${day}nd`;
        case 3: return `${day}rd`;
        default: return `${day}th`;
      }
    };
    
    return `${ordinalSuffix(day)} ${month}`;
  };

  const formatTooltipLabel = (label: string) => {
    return formatDate(label);
  };

  const formatTooltipValue = (value: number, name: string) => {
    // Find the crypto info for this line
    const cryptoInfo = supportedCryptos.find(crypto => crypto.id === name);
    return [formatPrice(value), cryptoInfo ? cryptoInfo.name : name];
  };

  if (isLoading) {
    return (
      <Card className="animate-fade-in rounded-3xl bg-card/50 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold">Price Chart</span>
              {loadingStatus && (
                <p className="text-[10px] text-muted-foreground font-normal mt-0.5">{loadingStatus}</p>
              )}
            </div>
            <div className="flex gap-1.5">
              {periods.map((period) => (
                <div key={period.value} className="w-10 h-7 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="h-80 bg-muted animate-pulse rounded-2xl"></div>
        </CardContent>
      </Card>
    );
  }

  // Show message if no data available
  if (!data || data.length === 0) {
    return (
      <Card className="animate-fade-in rounded-3xl bg-card/50 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold">Price Chart</span>
            </div>
            <div className="flex gap-1.5">
              {periods.map((period) => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePeriodClick(period.value)}
                  className="h-7 px-3 rounded-lg text-xs font-medium"
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="font-medium text-xs">No chart data available</p>
              <p className="text-[10px] mt-2">Please try again or select a different time period</p>
              {/* reload button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Reload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in rounded-3xl bg-card/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold">Price Chart</span>
            <p className="text-[10px] text-muted-foreground font-normal mt-0.5">
              {data.length} data points • {selectedCryptos?.length || 0} coins
            </p>
          </div>
          <div className="flex gap-1.5">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => handlePeriodClick(period.value)}
                className={`h-7 px-3 rounded-lg text-xs font-medium transition-all ${
                  selectedPeriod === period.value 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'bg-background/50 hover:bg-background/80 border-border/50'
                }`}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <div className="h-80 rounded-2xl overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => formatDate(value)}
                className="text-muted-foreground"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tickFormatter={(value) => formatPrice(value)}
                className="text-muted-foreground"
                tick={{ fontSize: 10 }}
                domain={['dataMin - 1000', 'dataMax + 1000']}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                labelFormatter={formatTooltipLabel}
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  color: 'hsl(var(--foreground))',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  fontSize: '11px'
                }}
              />
              {(selectedCryptos || ['bitcoin']).map(cryptoId => {
                const cryptoInfo = supportedCryptos.find(c => c.id === cryptoId);
                const color = cryptoInfo?.color || '#F7931A';
                
                return (
                  <Line 
                    key={cryptoId}
                    type="monotone" 
                    dataKey={cryptoId} 
                    name={cryptoId}
                    stroke={color} 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#ffffff' }}
                  />
                );
              })}
              <Legend 
                formatter={(value) => {
                  const crypto = supportedCryptos.find(c => c.id === value);
                  return crypto ? crypto.symbol : value;
                }}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
