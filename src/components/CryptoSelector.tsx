import { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { supportedCryptos, CryptoInfo } from '@/hooks/useCryptoCompare';

interface CryptoSelectorProps {
  selectedCryptos?: string[];
  onCryptoChange: (cryptos: string[]) => void;
}

const CryptoSelector = ({ selectedCryptos = ['BTC'], onCryptoChange }: CryptoSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const cryptos = selectedCryptos || ['BTC'];

  const toggleCrypto = (cryptoId: string) => {
    if (cryptos.includes(cryptoId)) {
      // Don't allow deselecting the last crypto
      if (cryptos.length > 1) {
        onCryptoChange(cryptos.filter(id => id !== cryptoId));
      }
    } else {
      onCryptoChange([...cryptos, cryptoId]);
    }
  };

  const getSelectedCryptoNames = () => {
    if (cryptos.length === 1) {
      const crypto = supportedCryptos.find(c => c.id === cryptos[0]);
      return crypto ? crypto.name : 'Select coins';
    }
    return `${cryptos.length} coins selected`;
  };

  const removeCrypto = (cryptoId: string) => {
    if (cryptos.length > 1) {
      onCryptoChange(cryptos.filter(id => id !== cryptoId));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-10 bg-card/50 border-border/50 rounded-xl backdrop-blur-sm font-medium"
          >
            {getSelectedCryptoNames()}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] max-h-[300px] overflow-auto bg-card/95 border-border/50 rounded-2xl backdrop-blur-sm shadow-2xl">
          {supportedCryptos.map((crypto) => (
            <DropdownMenuItem
              key={crypto.id}
              onClick={() => toggleCrypto(crypto.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: crypto.color }}
                ></div>
                <span>{crypto.name}</span>
              </div>
              {cryptos.includes(crypto.id) && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {cryptos.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {cryptos.map(cryptoId => {
            const crypto = supportedCryptos.find(c => c.id === cryptoId);
            if (!crypto) return null;
            
            return (
              <Badge 
                key={cryptoId}
                variant="outline"
                className="px-2 py-0.5 text-xs rounded-lg flex items-center gap-1.5 group"
                style={{ borderColor: `${crypto.color}40` }}
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: crypto.color }}
                ></div>
                <span>{crypto.symbol}</span>
                {cryptos.length > 1 && (
                  <X 
                    className="w-3 h-3 ml-1 opacity-50 hover:opacity-100 cursor-pointer" 
                    onClick={() => removeCrypto(cryptoId)}
                  />
                )}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CryptoSelector;
