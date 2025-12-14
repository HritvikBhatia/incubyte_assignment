import { useEffect, useState } from 'react';
import api from '../api/client';
import type { Sweet } from '../types';
import SweetCard from '../components/SweetCard';
import SweetModal from '../components/SweetModal';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const { isAdmin } = useAuth();

  const fetchSweets = async () => {
    try {
      // Backend supports ?search= query
      const { data } = await api.get(`/sweets?search=${search}`);
      setSweets(data);
    } catch (error) {
      toast.error('Failed to load sweets');
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSweets();
    }, 500); // Debounce search
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Actions
  const handlePurchase = async (id: number) => {
    try {
      await api.post(`/sweets/${id}/purchase`);
      toast.success('Sweet purchased!');
      fetchSweets(); // Refresh data
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Purchase failed');
    }
  };

  const handleCreateOrUpdate = async (data: Partial<Sweet>) => {
    try {
      if (editingSweet) {
        await api.put(`/sweets/${editingSweet.id}`, data);
        toast.success('Sweet updated successfully');
      } else {
        await api.post('/sweets', data);
        toast.success('Sweet created successfully');
      }
      setIsModalOpen(false);
      setEditingSweet(null);
      fetchSweets();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;
    try {
      await api.delete(`/sweets/${id}`);
      toast.success('Sweet deleted');
      fetchSweets();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleRestock = async (id: number) => {
    const qty = prompt("Enter quantity to add:");
    if (!qty) return;
    try {
        await api.post(`/sweets/${id}/restock`, { quantity: parseInt(qty) });
        toast.success("Stock updated");
        fetchSweets();
    } catch (e) {
        toast.error("Restock failed");
    }
  }

  const openEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingSweet(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search sweets by name or category..." 
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button 
              onClick={openCreate}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 shadow-md transition"
            >
              <Plus size={20} />
              <span>Add Sweet</span>
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sweets.map(sweet => (
            <SweetCard 
              key={sweet.id} 
              sweet={sweet} 
              onPurchase={handlePurchase}
              onEdit={openEdit}
              onDelete={handleDelete}
              onRestock={handleRestock}
            />
          ))}
        </div>
        
        {sweets.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No sweets found matching your search.
          </div>
        )}

        <SweetModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleCreateOrUpdate}
          initialData={editingSweet}
        />
      </div>
    </div>
  );
};

export default Dashboard;