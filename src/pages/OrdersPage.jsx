import { useState } from 'react';
import { Search, Eye, Printer, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { toast } from 'react-toastify';

const INITIAL_ORDERS = [
  { id: 'ORD-9021', customer: 'Alice Johnson', date: '2023-10-25 14:30', total: 450.00, items: 3, status: 'Processing', payment: 'Paid', address: '123 Tech St, NY' },
  { id: 'ORD-9022', customer: 'Bob Smith', date: '2023-10-25 15:15', total: 129.99, items: 1, status: 'Completed', payment: 'Paid', address: '456 Web Ave, CA' },
  { id: 'ORD-9023', customer: 'Charlie Brown', date: '2023-10-26 09:00', total: 89.50, items: 2, status: 'Shipped', payment: 'Paid', address: '789 Node Ln, TX' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusBadge = (status) => {
    const styles = { 'Completed': 'bg-success/10 text-success border-success/20', 'Shipped': 'bg-accent/10 text-accent border-accent/20', 'Processing': 'bg-primary/10 text-primary border-primary/20', 'Pending': 'bg-warning/10 text-warning border-warning/20', 'Cancelled': 'bg-danger/10 text-danger border-danger/20' };
    return `px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status] || 'bg-surface border-surfaceHover text-textMuted'}`;
  };

  const getPaymentBadge = (status) => {
    const styles = { 'Paid': 'text-success bg-success/10', 'Unpaid': 'text-warning bg-warning/10', 'Refunded': 'text-textMuted bg-surfaceHover' };
    return `px-2 py-0.5 text-xs font-medium rounded ${styles[status]}`;
  };

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setOrders(orders.filter(o => o.id !== selectedOrder.id));
    toast.success('Order deleted successfully');
    setIsModalOpen(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setOrders(orders.map(o => o.id === selectedOrder.id ? selectedOrder : o));
    toast.success('Order updated successfully');
    setIsModalOpen(false);
  };

  const renderModalContent = () => {
    if (modalMode === 'delete') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Order</h3>
            <p className="text-sm text-textMuted mt-2">Are you sure you want to delete order "{selectedOrder?.id}"? This action cannot be undone.</p>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-surfaceHover">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
            <button onClick={confirmDelete} className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90">Delete Order</button>
          </div>
        </div>
      );
    }

    if (modalMode === 'view') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-surfaceHover/50 p-4 rounded-xl border border-surfaceHover">
            <div>
              <p className="text-sm text-textMuted">Order ID</p>
              <p className="text-lg font-bold text-white">{selectedOrder.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-textMuted">Order Date</p>
              <p className="text-sm font-medium text-white">{selectedOrder.date}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-textMuted mb-2">Customer Details</p>
              <div className="bg-background p-4 rounded-lg border border-surfaceHover">
                <p className="font-medium text-white">{selectedOrder.customer}</p>
                <p className="text-sm text-textMuted mt-1">{selectedOrder.address}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-textMuted mb-2">Order Status</p>
              <div className="bg-background p-4 rounded-lg border border-surfaceHover flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-sm text-textMuted">Status</span>
                  <span className={getStatusBadge(selectedOrder.status)}>{selectedOrder.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-textMuted">Payment</span>
                  <span className={getPaymentBadge(selectedOrder.payment)}>{selectedOrder.payment}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-surfaceHover flex justify-between items-center">
             <p className="text-lg font-bold text-white">Total Amount: ${selectedOrder.total.toFixed(2)}</p>
             <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-surfaceHover text-white rounded-lg hover:bg-surfaceHover/80">Close</button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Status</label>
            <select value={selectedOrder.status} onChange={e => setSelectedOrder({...selectedOrder, status: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none">
              <option>Pending</option><option>Processing</option><option>Shipped</option><option>Completed</option><option>Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Payment</label>
            <select value={selectedOrder.payment} onChange={e => setSelectedOrder({...selectedOrder, payment: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none">
              <option>Paid</option><option>Unpaid</option><option>Refunded</option>
            </select>
          </div>
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-surfaceHover">
          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Save Changes</button>
        </div>
      </form>
    );
  };

  const filteredOrders = orders.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Orders</h1>
          <p className="text-sm text-textMuted mt-1">Track and manage customer orders.</p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search by order ID or customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-surfaceHover rounded-lg text-sm text-white placeholder-textMuted outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-surfaceHover text-sm text-textMuted">
                <th className="py-4 px-6 font-medium">Order ID</th>
                <th className="py-4 px-6 font-medium">Customer</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Payment</th>
                <th className="py-4 px-6 font-medium">Total</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-surfaceHover/50 hover:bg-surfaceHover/30 transition-colors group">
                  <td className="py-4 px-6"><span className="text-sm font-medium text-white">{order.id}</span></td>
                  <td className="py-4 px-6 text-sm text-textMuted">{order.customer}</td>
                  <td className="py-4 px-6"><span className={getStatusBadge(order.status)}>{order.status}</span></td>
                  <td className="py-4 px-6"><span className={getPaymentBadge(order.payment)}>{order.payment}</span></td>
                  <td className="py-4 px-6 text-sm font-medium text-white">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setModalMode('view'); setSelectedOrder(order); setIsModalOpen(true); }} className="p-1.5 text-textMuted hover:text-primary transition-colors rounded-md hover:bg-primary/10">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setModalMode('edit'); setSelectedOrder(order); setIsModalOpen(true); }} className="p-1.5 text-textMuted hover:text-accent transition-colors rounded-md hover:bg-accent/10">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(order)} className="p-1.5 text-textMuted hover:text-danger transition-colors rounded-md hover:bg-danger/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && <tr><td colSpan="6" className="py-12 text-center text-textMuted">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'edit' ? 'Edit Order' : modalMode === 'delete' ? 'Confirm Deletion' : 'Order Details'} maxWidth="max-w-xl">
        {isModalOpen && renderModalContent()}
      </Modal>
    </div>
  );
}
