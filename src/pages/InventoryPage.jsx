import { useState } from 'react';
import { Search, Edit, Trash2, Box, Eye, AlertTriangle } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { toast } from 'react-toastify';

const INITIAL_INVENTORY = [
  { id: 101, product: 'Wireless Headphones', sku: 'WH-001', stock: 45, threshold: 10, location: 'Warehouse A', status: 'In Stock' },
  { id: 102, product: 'Ergonomic Chair', sku: 'EC-002', stock: 5, threshold: 10, location: 'Warehouse B', status: 'Low Stock' },
  { id: 103, product: 'Gaming Keyboard', sku: 'GK-003', stock: 0, threshold: 15, location: 'Warehouse A', status: 'Out of Stock' },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenModal = (mode, item = null) => {
    setModalMode(mode);
    setSelectedItem(item || { product: '', sku: '', stock: 0, threshold: 10, location: '' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setInventory(inventory.filter(i => i.id !== selectedItem.id));
    toast.success('Inventory record deleted successfully');
    setIsModalOpen(false);
  };

  const getStatus = (stock, threshold) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= threshold) return 'Low Stock';
    return 'In Stock';
  };

  const handleSave = (e) => {
    e.preventDefault();
    const status = getStatus(selectedItem.stock, selectedItem.threshold);
    const itemToSave = { ...selectedItem, status };
    
    if (modalMode === 'add') {
      const newId = inventory.length ? Math.max(...inventory.map(i => i.id)) + 1 : 1;
      setInventory([...inventory, { ...itemToSave, id: newId }]);
      toast.success('Inventory record added successfully');
    } else if (modalMode === 'edit') {
      setInventory(inventory.map(i => i.id === itemToSave.id ? itemToSave : i));
      toast.success('Inventory record updated successfully');
    }
    setIsModalOpen(false);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'In Stock': return 'text-success bg-success/10 border border-success/20';
      case 'Low Stock': return 'text-warning bg-warning/10 border border-warning/20';
      case 'Out of Stock': return 'text-danger bg-danger/10 border border-danger/20';
      default: return 'text-textMuted bg-surfaceHover border border-surfaceHover';
    }
  };

  const filteredInventory = inventory.filter(i => i.product.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderModalContent = () => {
    if (modalMode === 'delete') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Inventory Record</h3>
            <p className="text-sm text-textMuted mt-2">Are you sure you want to delete "{selectedItem?.product}"? This action cannot be undone.</p>
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
            <div><p className="text-sm text-textMuted">SKU</p><p className="font-medium text-white">{selectedItem.sku}</p></div>
            <div><p className="text-sm text-textMuted">Status</p><span className={`inline-block mt-1 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(selectedItem.status)}`}>{selectedItem.status}</span></div>
            <div className="col-span-2"><p className="text-sm text-textMuted">Product</p><p className="font-medium text-white">{selectedItem.product}</p></div>
            <div><p className="text-sm text-textMuted">Current Stock</p><p className="font-medium text-white">{selectedItem.stock} units</p></div>
            <div><p className="text-sm text-textMuted">Low Stock Threshold</p><p className="font-medium text-white">{selectedItem.threshold} units</p></div>
            <div className="col-span-2"><p className="text-sm text-textMuted">Location</p><p className="font-medium text-white">{selectedItem.location}</p></div>
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
          <label className="block text-sm font-medium text-textMuted mb-1">Product Name</label>
          <input required type="text" value={selectedItem.product} onChange={e => setSelectedItem({...selectedItem, product: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">SKU</label>
            <input required type="text" value={selectedItem.sku} onChange={e => setSelectedItem({...selectedItem, sku: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Location</label>
            <input required type="text" value={selectedItem.location} onChange={e => setSelectedItem({...selectedItem, location: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Current Stock</label>
            <input required type="number" value={selectedItem.stock} onChange={e => setSelectedItem({...selectedItem, stock: parseInt(e.target.value, 10)})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Low Stock Threshold</label>
            <input required type="number" value={selectedItem.threshold} onChange={e => setSelectedItem({...selectedItem, threshold: parseInt(e.target.value, 10)})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-surfaceHover mt-6">
          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Save Inventory</button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Inventory</h1>
          <p className="text-sm text-textMuted mt-1">Manage stock levels across warehouses.</p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search by product or SKU..." 
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
                <th className="py-4 px-6 font-medium">Product</th>
                <th className="py-4 px-6 font-medium">SKU</th>
                <th className="py-4 px-6 font-medium">Stock Level</th>
                <th className="py-4 px-6 font-medium">Location</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id} className="border-b border-surfaceHover/50 hover:bg-surfaceHover/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0 border border-surfaceHover text-textMuted">
                        <Box className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-white">{item.product}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-textMuted">{item.sku}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{item.stock}</span>
                      {item.stock <= item.threshold && <AlertTriangle className="w-4 h-4 text-warning" />}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-textMuted">{item.location}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(item.status)}`}>
                      {item.status}
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
              {filteredInventory.length === 0 && <tr><td colSpan="6" className="py-12 text-center text-textMuted">No inventory found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Inventory' : modalMode === 'edit' ? 'Edit Inventory' : modalMode === 'delete' ? 'Confirm Deletion' : 'Inventory Details'}>
        {isModalOpen && renderModalContent()}
      </Modal>
    </div>
  );
}
