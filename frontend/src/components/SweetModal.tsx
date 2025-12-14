import React, { useState, useEffect } from 'react';
import  type{ Sweet } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Sweet>) => void;
  initialData?: Sweet | null;
}

const SweetModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        price: initialData.price.toString(),
        quantity: initialData.quantity.toString(),
      });
    } else {
      setFormData({ name: '', category: '', price: '', quantity: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">{initialData ? 'Edit Sweet' : 'Add New Sweet'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Name"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            placeholder="Category"
            className="w-full p-2 border rounded"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 border rounded"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            required
            min="0"
            step="0.01"
          />
          <input
            type="number"
            placeholder="Quantity"
            className="w-full p-2 border rounded"
            value={formData.quantity}
            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
            required
            min="0"
            disabled={!!initialData}
          />
          {initialData && <p className="text-xs text-gray-500">Use restock action to change quantity.</p>}
          
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SweetModal;