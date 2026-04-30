import type { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const Card = ({ title, children, className = '' }: CardProps) => {
  return (
    <div className={`card ${className}`}>
      {title && <h2 className="card__title">{title}</h2>}
      <div className="card__body">{children}</div>
    </div>
  );
};

export default Card;
