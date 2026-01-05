import QRCode from 'react-qr-code';
import { Clock } from 'lucide-react';

interface QRCodeDisplayProps {
  code: string;           // 6-digit code
  qrData: string;         // Data to encode in QR
  timeRemaining: number;  // Seconds remaining
  isExpiring: boolean;    // True when < 2 min
}

export default function QRCodeDisplay({
  code,
  qrData,
  timeRemaining,
  isExpiring,
}: QRCodeDisplayProps) {
  // Format time remaining as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine timer text based on state
  const getTimerText = (): string => {
    if (isExpiring) {
      return `Expires in ${formatTime(timeRemaining)}`;
    }
    return `Valid for ${formatTime(timeRemaining)}`;
  };

  // Timer color classes
  const timerColorClass = isExpiring ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="flex flex-col items-center">
      {/* Title */}
      <h2 className="text-xl font-bold text-neutral-900 text-center">
        Scan to redeem visit
      </h2>

      {/* QR Code */}
      <div className="mt-8 bg-white p-4 rounded-lg">
        <QRCode
          value={qrData}
          size={256}
          level="M"
        />
      </div>

      {/* Code Display */}
      <p className="mt-6 text-lg font-medium text-neutral-900 text-center">
        Code: {code}
      </p>

      {/* Timer */}
      <div className={`mt-4 flex items-center gap-2 ${timerColorClass}`}>
        <Clock size={20} />
        <span className="text-sm font-medium">
          {getTimerText()}
        </span>
      </div>
    </div>
  );
}
