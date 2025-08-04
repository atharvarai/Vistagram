import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'lg',
  shadow = 'lg',
  border = true,
  glass = false
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const baseStyles = `
    rounded-2xl transition-all duration-200
    ${glass 
      ? 'bg-white/80 backdrop-blur-lg border border-white/20' 
      : 'bg-white'
    }
    ${border && !glass ? 'border border-gray-200' : ''}
    ${shadowClasses[shadow]}
    ${paddingClasses[padding]}
  `;

  return (
    <div className={`${baseStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card; 