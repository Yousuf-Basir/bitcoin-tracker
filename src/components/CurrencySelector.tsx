
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' }
];

const CurrencySelector = ({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) => {
  return (
    <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
      <SelectTrigger className="w-32 h-10 bg-card/50 border-border/50 rounded-xl backdrop-blur-sm font-medium">
        <SelectValue /> 
      </SelectTrigger>
      <SelectContent className="bg-card/95 border-border/50 rounded-2xl backdrop-blur-sm shadow-2xl">
        {currencies.map((currency) => (
          <SelectItem 
            key={currency.code} 
            value={currency.code}
            className="rounded-xl my-1 focus:bg-accent/50"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">{currency.code}</span>
              <span className="text-muted-foreground">{currency.symbol}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
