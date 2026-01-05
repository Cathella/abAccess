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
      rightText: 'Add new',
      disabled: false,
      errorText: undefined,
    },
  ];

  return (
    <div>
      {/* Label */}
      <div className="mb-3">
        <span className="text-base font-bold text-neutral-900">
          Payment method
        </span>
      </div>

      {/* Payment Method Options */}
      <div>
        {paymentOptions.map((option, index) => (
          <div key={option.value}>
            <button
              onClick={option.disabled ? undefined : () => onSelect(option.value)}
              disabled={option.disabled}
              className="flex w-full items-center gap-3 py-4 text-left transition-opacity hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Radio Button */}
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                {selectedMethod === option.value ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary-900">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary-900" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-neutral-400" />
                )}
              </div>

              {/* Method Name */}
              <span className="flex-1 text-base text-neutral-900">
                {option.label}
              </span>

              {/* Right Text */}
              <div className="text-right">
                {option.value === 'mobile_money' ? (
                  <span className="text-base font-semibold text-secondary-900 underline">
                    {option.rightText}
                  </span>
                ) : (
                  <span className="text-base text-neutral-900">
                    {option.rightText}
                  </span>
                )}
                {option.errorText && (
                  <div className="text-sm text-red-600 mt-1">{option.errorText}</div>
                )}
              </div>
            </button>

            {/* Divider (except last item) */}
            {index < paymentOptions.length - 1 && (
              <div className="h-px bg-neutral-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
