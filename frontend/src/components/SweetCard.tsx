import React from 'react';
import type { Sweet } from '../types';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash2, ShoppingCart } from 'lucide-react';

interface Props {
  sweet: Sweet;
  onPurchase: (id: number) => void;
  onEdit: (sweet: Sweet) => void;
  onDelete: (id: number) => void;
  onRestock: (id: number) => void;
}

const SweetCard: React.FC<Props> = ({ sweet, onPurchase, onEdit, onDelete, onRestock }) => {
  const { isAdmin } = useAuth();
  const isOutOfStock = sweet.quantity <= 0;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 transition hover:shadow-xl">
      <div className="h-48 bg-linear-to-br from-pink-100 to-indigo-100 flex items-center justify-center text-4xl">
        🍬
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
            ${sweet.price.toFixed(2)}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-4">{sweet.category}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : 'text-gray-600'}`}>
            {isOutOfStock ? 'Out of Stock' : `In Stock: ${sweet.quantity}`}
          </span>
        </div>

        <div className="space-y-2">
          {/* User Action */}
          <button
            onClick={() => onPurchase(sweet.id)}
            disabled={isOutOfStock}
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <ShoppingCart size={18} />
            <span>{isOutOfStock ? 'Sold Out' : 'Purchase'}</span>
          </button>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex space-x-2 mt-2 pt-3 border-t border-gray-100">
               <button 
                onClick={() => onEdit(sweet)}
                className="flex-1 py-1 px-2 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 text-sm flex items-center justify-center gap-1"
              >
                <Edit size={14} /> Edit
              </button>
              <button 
                onClick={() => onDelete(sweet.id)}
                className="flex-1 py-1 px-2 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm flex items-center justify-center gap-1"
              >
                <Trash2 size={14} /> Delete
              </button>
              <button 
                 onClick={() => onRestock(sweet.id)}
                 className="flex-1 py-1 px-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
              >
                +Stock
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;