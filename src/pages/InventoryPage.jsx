import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Box, Eye, AlertTriangle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllInventory, updateInventoryStock } from '../store/slices/inventorySlice';
import Modal from '../components/ui/Modal';
import { toast } from 'react-toastify';

export default function InventoryPage() {
  const dispatch = useDispatch();
  const { items: inventory, loading } = useSelector((state) => state.inventory);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'delete'
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchAllInventory());
  }, [dispatch]);

  const handleOpenModal = (mode, item = null) => {
    setModalMode(mode);
    setSelectedItem(item || { productId: '', availableQuantity: 0, reservedQuantity: 0 });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    toast.info('Inventory deletion is not supported. Inventory is managed per product.');
    setIsModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateInventoryStock({ 
        productId: selectedItem.productId, 
        quantity: selectedItem.availableQuantity 
      })).unwrap();
      toast.success('Stock level updated successfully');
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update stock');
    }
  };

  const getStatusStyle = (stock) => {
    if (stock === 0) return 'text-danger bg-danger/10 border border-danger/20';
    if (stock <= 10) return 'text-warning bg-warning/10 border border-warning/20';
    return 'text-success bg-success/10 border border-success/20';
  };

  const filteredInventory = inventory.filter(i => 
    i.productId.toString().includes(searchTerm.toLowerCase())
  );

  const renderModalContent = () => {
    if (modalMode === 'delete') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Inventory Record</h3>
            <p className="text-sm text-textMuted mt-2">Are you sure you want to delete inventory for product ID "{selectedItem?.productId}"? This action cannot be undone.</p>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-surfaceHover">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
            <button onClick={confirmDelete} className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90">Delete Record</button>
          </div>
        </div>
      );
    }

    if (modalMode === 'view') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-textMuted">Product ID</p><p className="font-medium text-white">#{selectedItem.productId}</p></div>
            <div><p className="text-sm text-textMuted">Stock Status</p><span className={`inline-block mt-1 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(selectedItem.availableQuantity)}`}>{selectedItem.availableQuantity === 0 ? 'Out of Stock' : selectedItem.availableQuantity <= 10 ? 'Low Stock' : 'In Stock'}</span></div>
            <div><p className="text-sm text-textMuted">Available Quantity</p><p className="font-medium text-white">{selectedItem.availableQuantity} units</p></div>
            <div><p className="text-sm text-textMuted">Reserved Quantity</p><p className="font-medium text-white">{selectedItem.reservedQuantity} units</p></div>
          </div>
          <div className="pt-6 flex justify-end">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-surfaceHover text-white rounded-lg hover:bg-surfaceHover/80">Close</button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Product ID</label>
          <input required type="number" readOnly={modalMode === 'edit'} value={selectedItem.productId} onChange={e => setSelectedItem({...selectedItem, productId: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none read-only:opacity-50" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Available Quantity</label>
            <input required type="number" value={selectedItem.availableQuantity} onChange={e => setSelectedItem({...selectedItem, availableQuantity: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Reserved Quantity</label>
            <input required type="number" readOnly value={selectedItem.reservedQuantity} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white opacity-50 outline-none" />
          </div>
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-surfaceHover mt-6">
          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
            {loading ? 'Saving...' : 'Update Stock'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Inventory</h1>
          <p className="text-sm text-textMuted mt-1">Manage stock levels for all products.</p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search by product ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-surfaceHover rounded-lg text-sm text-white placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-surfaceHover text-sm text-textMuted">
                <th className="py-4 px-6 font-medium">Product ID</th>
                <th className="py-4 px-6 font-medium">Available</th>
                <th className="py-4 px-6 font-medium">Reserved</th>
                <th className="py-4 px-6 font-medium">Total</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && inventory.length === 0 ? (
                <tr><td colSpan="6" className="py-12 text-center text-textMuted">Loading inventory...</td></tr>
              ) : filteredInventory.map((item) => (
                <tr key={item.id} className="border-b border-surfaceHover/50 hover:bg-surfaceHover/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0 border border-surfaceHover text-textMuted">
                        <Box className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-white">Product #{item.productId}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-white font-medium">{item.availableQuantity}</td>
                  <td className="py-4 px-6 text-sm text-textMuted">{item.reservedQuantity}</td>
                  <td className="py-4 px-6 text-sm text-white font-bold">{item.availableQuantity + item.reservedQuantity}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(item.availableQuantity)}`}>
                      {item.availableQuantity === 0 ? 'Out of Stock' : item.availableQuantity <= 10 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal('view', item)} className="p-1.5 text-textMuted hover:text-white transition-colors rounded-md hover:bg-surfaceHover">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenModal('edit', item)} className="p-1.5 text-textMuted hover:text-accent transition-colors rounded-md hover:bg-surfaceHover">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(item)} className="p-1.5 text-textMuted hover:text-danger transition-colors rounded-md hover:bg-surfaceHover">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredInventory.length === 0 && <tr><td colSpan="6" className="py-12 text-center text-textMuted">No inventory found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'edit' ? 'Edit Inventory' : modalMode === 'delete' ? 'Confirm Deletion' : 'Inventory Details'}>
        {isModalOpen && renderModalContent()}
      </Modal>
    </div>
  );
}
