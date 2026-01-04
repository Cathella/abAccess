import React from 'react';
import { Check } from 'lucide-react';

interface InclusionsListProps {
  items: string[];
}

const InclusionsList: React.FC<InclusionsListProps> = ({ items }) => {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <Check
            className="shrink-0 mt-0.5"
            size={20}
            style={{ color: 'text-primary-900' }}
          />
          <span className="text-neutral-700">{item}</span>
        </div>
      ))}
    </div>
  );
};

export default InclusionsList;
