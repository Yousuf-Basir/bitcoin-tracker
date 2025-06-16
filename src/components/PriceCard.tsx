
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceCardProps {
  price: number;
  currency: string;
  change24h: number;
  symbol: string;
  isLoading?: boolean;
}

const PriceCard = ({ price, currency, change24h, symbol, isLoading }: PriceCardProps) => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const isPositive = change24h >= 0;

  if (isLoading) {
    return (
      <Card className="animate-fade-in rounded-3xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bitcoin-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">₿</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Bitcoin</h2>
                  <p className="text-xs text-muted-foreground font-medium">BTC</p>
                </div>
              </div>
              <div className="h-8 w-16 bg-muted animate-pulse rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-muted animate-pulse rounded-lg"></div>
              <div className="h-6 bg-muted animate-pulse rounded-lg w-24"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in rounded-3xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bitcoin-gradient flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Bitcoin</h2>
                <p className="text-xs text-muted-foreground font-medium">BTC</p>
              </div>
            </div>
            
            <Badge 
              variant={isPositive ? "default" : "destructive"}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                isPositive 
                  ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20' 
                  : 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? '+' : ''}{change24h.toFixed(2)}%
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground animate-price-pulse tracking-tight">
              {formatPrice(price, currency)}
            </p>
            <p className="text-xs text-muted-foreground font-medium">24h change</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCard;
