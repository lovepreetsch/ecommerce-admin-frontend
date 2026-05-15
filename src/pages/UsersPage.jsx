import { useState, useEffect } from 'react';
import { Search, Edit, Shield, Mail, Ban, CheckCircle, Trash2, Eye, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, deleteUser } from '../store/slices/userSlice';
import Modal from '../components/ui/Modal';
import { toast } from 'react-toastify';

export default function UsersPage() {
  const dispatch = useDispatch();
  const { items: users, loading } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view', 'delete'
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers({ page: 0, size: 50 }));
  }, [dispatch]);

  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user || { firstName: '', lastName: '', email: '', role: 'Customer' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      toast.success('User deleted successfully');
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.info('Direct user creation/editing is not supported yet. Please use the registration flow.');
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
            <h3 className="text-lg font-bold text-white">Delete User</h3>
            <p className="text-sm text-textMuted mt-2">Are you sure you want to delete user "{selectedUser?.email}"? This action cannot be undone.</p>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-surfaceHover">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
            <button onClick={confirmDelete} className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90">Delete User</button>
          </div>
        </div>
      );
    }

    if (modalMode === 'view') {
      const fullName = `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`;
      return (
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl text-white font-bold">
              {fullName.charAt(0) || '?'}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-textMuted">User ID</p><p className="font-medium text-white">#{selectedUser.id}</p></div>
            <div><p className="text-sm text-textMuted">Auth ID</p><p className="font-medium text-white">#{selectedUser.authUserId}</p></div>
            <div className="col-span-2"><p className="text-sm text-textMuted">Full Name</p><p className="font-medium text-white">{fullName}</p></div>
            <div className="col-span-2"><p className="text-sm text-textMuted">Email</p><p className="font-medium text-white flex items-center gap-2"><Mail className="w-4 h-4"/>{selectedUser.email}</p></div>
          </div>
          <div className="pt-6 flex justify-end">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-surfaceHover text-white rounded-lg hover:bg-surfaceHover/80">Close</button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">First Name</label>
            <input required type="text" value={selectedUser.firstName} onChange={e => setSelectedUser({...selectedUser, firstName: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Last Name</label>
            <input required type="text" value={selectedUser.lastName} onChange={e => setSelectedUser({...selectedUser, lastName: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Email Address</label>
          <input required type="email" value={selectedUser.email} onChange={e => setSelectedUser({...selectedUser, email: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-surfaceHover mt-6">
          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Save User</button>
        </div>
      </form>
    );
  };

  const filteredUsers = users.filter(u => 
    (u.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (u.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Users</h1>
          <p className="text-sm text-textMuted mt-1">Manage customer and admin accounts.</p>
        </div>
        <button onClick={() => handleOpenModal('add')} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="glass-panel p-4 rounded-xl flex justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search users..." 
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
                <th className="py-4 px-6 font-medium">User</th>
                <th className="py-4 px-6 font-medium">Role Info</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && users.length === 0 ? (
                <tr><td colSpan="4" className="py-12 text-center text-textMuted">Loading users...</td></tr>
              ) : filteredUsers.map((user) => {
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`;
                return (
                  <tr key={user.id} className="border-b border-surfaceHover/50 hover:bg-surfaceHover/30 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shrink-0">
                          {fullName.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{fullName}</p>
                          <p className="text-xs text-textMuted flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border bg-surface border-surfaceHover text-textMuted">
                        {user.vendorProfile ? 'Vendor' : 'User'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                        <CheckCircle className="w-4 h-4" /> Active
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal('view', user)} className="p-1.5 text-textMuted hover:text-white transition-colors rounded-md hover:bg-surfaceHover">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(user)} className="p-1.5 text-textMuted hover:text-danger transition-colors rounded-md hover:bg-surfaceHover">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && filteredUsers.length === 0 && <tr><td colSpan="4" className="py-12 text-center text-textMuted">No users found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add User' : modalMode === 'edit' ? 'Edit User' : modalMode === 'delete' ? 'Confirm Deletion' : 'User Details'}>
        {isModalOpen && renderModalContent()}
      </Modal>
    </div>
  );
}
