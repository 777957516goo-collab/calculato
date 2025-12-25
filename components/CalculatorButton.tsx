
import React from 'react';

interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'action' | 'special';
  className?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'default',
  className = ''
}) => {
  const baseStyles = "h-16 rounded-2xl text-xl font-bold transition-all active:scale-95 flex items-center justify-center shadow-sm";
  
  const variants = {
    default: "bg-white text-slate-800 hover:bg-slate-100",
    operator: "bg-indigo-500 text-white hover:bg-indigo-600",
    action: "bg-slate-200 text-slate-700 hover:bg-slate-300",
    special: "bg-orange-500 text-white hover:bg-orange-600"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;
