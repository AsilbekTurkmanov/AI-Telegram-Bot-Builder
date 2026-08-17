import React, { useState } from 'react';
import { ShoppingBag, Users, Send, CheckCircle2, Clock, Truck, PackageCheck, Ban, Plus, Edit2 } from 'lucide-react';
import { OrderItem, ProductItem } from '../../types/telegram';
import { Project } from '../../types/project';

interface AdminPanelPreviewProps {
  project: Project;
}

export const AdminPanelPreview: React.FC<AdminPanelPreviewProps> = ({ project }) => {
  const [tab, setTab] = useState<'orders' | 'products' | 'users' | 'broadcast'>('orders');

  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 'ORD-8492', user: 'Dilshodbek (@dilshod)', phone: '+998 90 123 45 67', items: '🍔 Toshkent Oshi x1, 🥤 Koka-Kola x1', total: 47000, address: 'Yunusobod 4-mavze, 12-uy', status: 'Preparing', createdAt: '13:10' },
    { id: 'ORD-7193', user: 'Malika (@malika_99)', phone: '+998 93 987 65 43', items: '🍕 Peperoni Pitsa x1', total: 65000, address: 'Chilanzar 2-kvartal', status: 'Delivering', createdAt: '12:45' },
    { id: 'ORD-6011', user: 'Sardor (@sardor_a)', phone: '+998 97 555 11 22', items: '🍔 Toshkent Oshi x2', total: 70000, address: 'Mirzo Ulugbek 45', status: 'Completed', createdAt: '11:20' }
  ]);

  const [products, setProducts] = useState<ProductItem[]>([
    { id: 'p1', name: 'Toshkent Oshi', category: 'Taomlar', description: 'Zarafshon guruchi va mol go\'shti', price: 35000, image: '🍔', active: true },
    { id: 'p2', name: 'Peperoni Pitsa', category: 'Pitsa', description: 'Pishloq va achchiq kolbasa', price: 65000, image: '🍕', active: true },
    { id: 'p3', name: 'Koka-Kola 1.5L', category: 'Ichimliklar', description: 'Salqin ichimlik', price: 12000, image: '🥤', active: true }
  ]);

  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleStatusChange = (orderId: string, newStatus: OrderItem['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastText('');
    }, 2500);
  };

  return (
    <div className="admin-panel-preview">
      {/* Top Admin Header */}
      <div className="admin-nav">
        <div className="admin-brand">
          <ShoppingBag size={20} color="#38bdf8" />
          <span>{project.botName} Admin Panel</span>
        </div>

        <div className="admin-tabs">
          <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
            Buyurtmalar ({orders.length})
          </button>
          <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>
            Mahsulotlar ({products.length})
          </button>
          <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>
            Foydalanuvchilar (1,248)
          </button>
          <button className={tab === 'broadcast' ? 'active' : ''} onClick={() => setTab('broadcast')}>
            <Send size={14} /> Broadcast
          </button>
        </div>
      </div>

      {/* Admin Content */}
      <div className="admin-content-body">
        {/* Orders View */}
        {tab === 'orders' && (
          <div className="admin-section">
            <h3>📦 Kelib Tushgan Buyurtmalar</h3>
            <div className="orders-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mijoz</th>
                    <th>Telefon & Manzil</th>
                    <th>Tarkib</th>
                    <th>Jami</th>
                    <th>Status</th>
                    <th>Harakat</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td><strong>{o.id}</strong></td>
                      <td>{o.user}</td>
                      <td>
                        <div>{o.phone}</div>
                        <small className="text-muted">{o.address}</small>
                      </td>
                      <td>{o.items}</td>
                      <td><strong>{o.total.toLocaleString()} UZS</strong></td>
                      <td>
                        <span className={`status-pill ${o.status.toLowerCase()}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as any)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready</option>
                          <option value="Delivering">Delivering</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products View */}
        {tab === 'products' && (
          <div className="admin-section">
            <div className="section-title-bar">
              <h3>🍔 Mahsulotlar Katalogi</h3>
              <button className="btn-primary btn-sm flex-align">
                <Plus size={14} /> Yangi Mahsulot
              </button>
            </div>

            <div className="products-grid-view">
              {products.map(p => (
                <div key={p.id} className="admin-product-card">
                  <div className="product-icon">{p.image}</div>
                  <h4>{p.name}</h4>
                  <span className="cat-tag">{p.category}</span>
                  <p>{p.description}</p>
                  <div className="price-row">
                    <strong>{p.price.toLocaleString()} UZS</strong>
                    <span className="badge badge-success">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users View */}
        {tab === 'users' && (
          <div className="admin-section">
            <h3>👤 Telegram Bot Foydalanuvchilari</h3>
            <div className="users-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Telegram ID</th>
                    <th>Ism</th>
                    <th>Username</th>
                    <th>Telefon</th>
                    <th>Buyurtmalar</th>
                    <th>Sana</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>9812471</td>
                    <td>Dilshodbek K.</td>
                    <td>@dilshod</td>
                    <td>+998 90 123 45 67</td>
                    <td>5 ta</td>
                    <td>2026-08-15</td>
                  </tr>
                  <tr>
                    <td>7412984</td>
                    <td>Malika S.</td>
                    <td>@malika_99</td>
                    <td>+998 93 987 65 43</td>
                    <td>2 ta</td>
                    <td>2026-08-16</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Broadcast View */}
        {tab === 'broadcast' && (
          <div className="admin-section">
            <h3>📢 Barcha Foydalanuvchilarga Xabar Yuborish (Broadcast)</h3>
            <p className="text-muted">Backround Worker orqali barcha 1,248 ta foydalanuvchiga Telegram reklama xabari yuboriladi.</p>

            <form onSubmit={handleSendBroadcast} className="broadcast-form">
              <textarea
                rows={4}
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder="Xabar matnini yozing..."
              />
              <button type="submit" className="btn-primary flex-align">
                <Send size={16} /> Yuborishni boshlash
              </button>

              {broadcastSent && (
                <div className="alert-success-box flex-align">
                  <CheckCircle2 size={18} color="#4ade80" />
                  <span>Xabar 1,248 ta foydalanuvchiga yuborildi!</span>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
