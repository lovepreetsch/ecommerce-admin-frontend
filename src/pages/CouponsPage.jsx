import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Ticket, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '../store/slices/couponSlice';
import Modal from '../components/ui/Modal';
import { toast } from 'react-toastify';

export default function CouponsPage() {
  const dispatch = useDispatch();
  const { items: coupons, loading } = useSelector((state) => state.coupons);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view', 'delete'
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleOpenModal = (mode, coupon = null) => {
    setModalMode(mode);
    setSelectedCoupon(coupon || { code: '', discount: 0, type: 'PERCENTAGE', maxUses: 0, expiryDate: '', active: true });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (coupon) => {
    setSelectedCoupon(coupon);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteCoupon(selectedCoupon.id)).unwrap();
      toast.success('Coupon deleted successfully');
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await dispatch(createCoupon(selectedCoupon)).unwrap();
        toast.success('Coupon added successfully');
      } else if (modalMode === 'edit') {
        await dispatch(updateCoupon({ id: selectedCoupon.id, couponData: selectedCoupon })).unwrap();
        toast.success('Coupon updated successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save coupon');
    }
  };

  const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderModalContent = () => {
    if (modalMode === 'delete') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Coupon</h3>
            <p className="text-sm text-textMuted mt-2">Are you sure you want to delete coupon "{selectedCoupon?.code}"? This action cannot be undone.</p>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-surfaceHover">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
            <button onClick={confirmDelete} className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90">Delete Coupon</button>
          </div>
        </div>
      );
    }

    if (modalMode === 'view') {
      return (
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-4xl border border-primary/20">
              <Ticket className="w-10 h-10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-textMuted">Coupon Code</p><p className="font-medium text-white">{selectedCoupon.code}</p></div>
            <div><p className="text-sm text-textMuted">Status</p><span className={`inline-block mt-1 px-2.5 py-1 text-xs font-medium rounded-full ${selectedCoupon.active ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>{selectedCoupon.active ? 'Active' : 'Inactive'}</span></div>
            <div><p className="text-sm text-textMuted">Discount Value</p><p className="font-medium text-white">{selectedCoupon.type === 'PERCENTAGE' ? `${selectedCoupon.discount}%` : `$${selectedCoupon.discount}`}</p></div>
            <div><p className="text-sm text-textMuted">Discount Type</p><p className="font-medium text-white">{selectedCoupon.type}</p></div>
            <div><p className="text-sm text-textMuted">Usage Count</p><p className="font-medium text-white">{selectedCoupon.usedCount || 0} / {selectedCoupon.maxUses}</p></div>
            <div><p className="text-sm text-textMuted">Expiry Date</p><p className="font-medium text-white">{selectedCoupon.expiryDate}</p></div>
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
          <label className="block text-sm font-medium text-textMuted mb-1">Coupon Code</label>
          <input required type="text" value={selectedCoupon.code} onChange={e => setSelectedCoupon({...selectedCoupon, code: e.target.value.toUpperCase()})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none uppercase" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Discount Type</label>
            <select value={selectedCoupon.type} onChange={e => setSelectedCoupon({...selectedCoupon, type: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none">
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED_AMOUNT">Fixed Amount</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Discount Value</label>
            <input required type="number" value={selectedCoupon.discount} onChange={e => setSelectedCoupon({...selectedCoupon, discount: parseFloat(e.target.value)})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Max Uses</label>
            <input required type="number" value={selectedCoupon.maxUses} onChange={e => setSelectedCoupon({...selectedCoupon, maxUses: parseInt(e.target.value, 10)})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Expiry Date</label>
            <input required type="date" value={selectedCoupon.expiryDate} onChange={e => setSelectedCoupon({...selectedCoupon, expiryDate: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="coupon-active" checked={selectedCoupon.active} onChange={e => setSelectedCoupon({...selectedCoupon, active: e.target.checked})} className="w-4 h-4 rounded border-surfaceHover bg-background text-primary" />
          <label htmlFor="coupon-active" className="text-sm font-medium text-white">Active</label>
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-surfaceHover mt-6">
          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Coupon'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Coupons</h1>
          <p className="text-sm text-textMuted mt-1">Manage promotional codes and discounts.</p>
        </div>
        <button onClick={() => handleOpenModal('add')} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      <div className="glass-panel p-4 rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search coupons..." 
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
                <th className="py-4 px-6 font-medium">Code</th>
                <th className="py-4 px-6 font-medium">Discount</th>
                <th className="py-4 px-6 font-medium">Usage</th>
                <th className="py-4 px-6 font-medium">Expiry Date</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && coupons.length === 0 ? (
                <tr><td colSpan="6" className="py-12 text-center text-textMuted">Loading coupons...</td></tr>
              ) : filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-surfaceHover/50 hover:bg-surfaceHover/30 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm font-bold tracking-wider text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-white">
                    {coupon.type === 'PERCENTAGE' ? `${coupon.discount}% OFF` : `$${coupon.discount} OFF`}
                  </td>
                  <td className="py-4 px-6 text-sm text-textMuted">
                    {coupon.usedCount || 0} / {coupon.maxUses}
                  </td>
                  <td className="py-4 px-6 text-sm text-textMuted">{coupon.expiryDate}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${coupon.active ? 'text-success bg-success/10 border-success/20' : 'text-danger bg-danger/10 border-danger/20'} border`}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal('view', coupon)} className="p-1.5 text-textMuted hover:text-white transition-colors rounded-md hover:bg-surfaceHover">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenModal('edit', coupon)} className="p-1.5 text-textMuted hover:text-accent transition-colors rounded-md hover:bg-surfaceHover">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(coupon)} className="p-1.5 text-textMuted hover:text-danger transition-colors rounded-md hover:bg-surfaceHover">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredCoupons.length === 0 && <tr><td colSpan="6" className="py-12 text-center text-textMuted">No coupons found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Coupon' : modalMode === 'edit' ? 'Edit Coupon' : modalMode === 'delete' ? 'Confirm Deletion' : 'Coupon Details'}>
        {isModalOpen && renderModalContent()}
      </Modal>
    </div>
  );
}
