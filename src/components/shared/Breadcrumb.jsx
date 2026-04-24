// Breadcrumb de navegación contextual
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items }) {
  // items: [{ label, to? }, { label (current) }]
  return (
    <nav className="breadcrumb">
      {items.map((item, idx) => (
        <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {idx > 0 && <ChevronRight size={12} className="breadcrumb-sep" />}
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
