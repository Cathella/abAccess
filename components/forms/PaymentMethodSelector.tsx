import React, { useEffect } from 'react';

interface PaymentMethodSelectorProps {
  selectedMethod: 'wallet' | 'mobile_money';
  onSelect: (method: 'wallet' | 'mobile_money') => void;
  walletBalance: number;
  packagePrice: number;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
  walletBalance,
  packagePrice,
}) => {
  const isWalletSufficient = walletBalance >= packagePrice;

  // Auto-select Mobile Money if wallet has insufficient balance
  useEffect(() => {
    if (!isWalletSufficient && selectedMethod === 'wallet') {
      onSelect('mobile_money');
    }
  }, [isWalletSufficient, selectedMethod, onSelect]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const paymentOptions = [
    {
      value: 'wallet' as const,
      label: 'Wallet',
      rightText: formatCurrency(walletBalance),
      disabled: !isWalletSufficient,
      errorText: !isWalletSufficient ? 'Insufficient balance.' : undefined,
    },
    {
      value: 'mobile_money' as const,
      label: 'Mobile Money',
      rightText: 'MTN MoMo / Airtel',
      disabled: false,
      errorText: undefined,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="font-semibold text-gray-700">Payment method</label>

      {/* Options */}
      <div className="space-y-3">
        {paymentOptions.map((option) => (
          <div key={option.value}>
            <div
              onClick={option.disabled ? undefined : () => onSelect(option.value)}
              className={`
                flex items-center justify-between p-4 rounded-xl border
                ${option.disabled
                  ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                  : 'cursor-pointer hover:bg-gray-50 border-neutral-400 bg-white'
                }
                transition-colors
              `}
            >
              {/* Left side: Radio + Label */}
              <div className="flex items-center gap-3">
                {/* Radio Button */}
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    transition-all
                    ${selectedMethod === option.value
                      ? 'border-[#3A8DFF] bg-[#3A8DFF]'
                      : 'border-gray-300 bg-white'
                    }
                  `}
                >
                  {selectedMethod === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                {/* Label */}
                <span className="font-semibold text-gray-900">{option.label}</span>
              </div>

              {/* Right side: Balance/Info */}
              <div className="text-right">
                <div className="font-semibold text-gray-900">{option.rightText}</div>
                {option.errorText && (
                  <div className="text-sm text-red-600 mt-1">{option.errorText}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
