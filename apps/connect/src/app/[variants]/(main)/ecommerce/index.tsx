'use client';

import { Flexbox } from '@lobehub/ui';
import { App, Badge, Button, Card, Empty, Input, InputNumber, Modal, Select, Space, Spin, Switch, Table, Tabs, Tag, Typography } from 'antd';
import { createStyles } from 'antd-style';
import {
  BarChart3,
  Box,
  CheckCircle,
  ClipboardList,
  CreditCard,
  Download,
  Edit3,
  FileSpreadsheet,
  ImagePlus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Store,
  Trash2,
  TrendingUp,
  Upload,
  Wallet,
  X,
} from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  imageUrl?: string;
  productUrl?: string;
  paymentUrl?: string;
  inStock: boolean;
  stockQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  currency: string;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  source: 'whatsapp' | 'manual';
}

const ORDER_STATUS_MAP: Record<string, { color: string; label: string }> = {
  cancelled: { color: 'default', label: 'Annulée' },
  confirmed: { color: 'blue', label: 'Confirmée' },
  delivered: { color: 'green', label: 'Livrée' },
  paid: { color: 'cyan', label: 'Payée' },
  pending: { color: 'orange', label: 'En attente' },
  shipped: { color: 'purple', label: 'Expédiée' },
};

const CURRENCIES = [
  { label: 'XOF (FCFA)', value: 'XOF' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'USD ($)', value: 'USD' },
  { label: 'XAF (FCFA)', value: 'XAF' },
  { label: 'GHS (₵)', value: 'GHS' },
  { label: 'NGN (₦)', value: 'NGN' },
];

const CATEGORIES = [
  'Général',
  'Électronique',
  'Mode & Vêtements',
  'Alimentation',
  'Beauté & Santé',
  'Maison & Décoration',
  'Sport & Loisirs',
  'Services',
  'Autre',
];

const formatPrice = (price: number, currency: string) => {
  const symbols: Record<string, string> = {
    EUR: '€',
    GHS: '₵',
    NGN: '₦',
    USD: '$',
    XAF: 'FCFA',
    XOF: 'FCFA',
  };
  const sym = symbols[currency] || currency;
  if (['XOF', 'XAF'].includes(currency)) {
    return `${price.toLocaleString('fr-FR')} ${sym}`;
  }
  return `${sym}${price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`;
};

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 32px;
    width: 100%;
    overflow-y: auto;
    height: 100%;
  `,
  header: css`
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 24px;
    color: white;
  `,
  statsCard: css`
    border-radius: 12px;
    text-align: center;
  `,
  productCard: css`
    border-radius: 12px;
    transition: all 0.2s;
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `,
  productImage: css`
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    background: ${token.colorBgLayout};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${token.colorTextQuaternary};
    font-size: 24px;
  `,
  emptyState: css`
    padding: 60px 20px;
    text-align: center;
  `,
  searchBar: css`
    margin-bottom: 16px;
  `,
}));

const EcommercePage = memo(() => {
  const { styles, theme } = useStyles();
  const { message, modal } = App.useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formCurrency, setFormCurrency] = useState('XOF');
  const [formCategory, setFormCategory] = useState('Général');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string>('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [formProductUrl, setFormProductUrl] = useState('');
  const [formPaymentUrl, setFormPaymentUrl] = useState('');
  const [formInStock, setFormInStock] = useState(true);
  const [formStockQuantity, setFormStockQuantity] = useState<number | undefined>(undefined);

  // Tab state
  const [activeTab, setActiveTab] = useState('products');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);

  // Import state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importCsv, setImportCsv] = useState('');
  const [importReplace, setImportReplace] = useState(false);
  const [importing, setImporting] = useState(false);

  // Payment config state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [waveMerchantCode, setWaveMerchantCode] = useState('');
  const [orangeMoneyCode, setOrangeMoneyCode] = useState('');
  const [paymentSaving, setPaymentSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ecommerce/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/ecommerce/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {
      // silently fail
    }
  }, []);

  const fetchPaymentConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/ecommerce/payment');
      if (res.ok) {
        const data = await res.json();
        if (data.paymentConfig) {
          setWaveMerchantCode(data.paymentConfig.waveMerchantCode || '');
          setOrangeMoneyCode(data.paymentConfig.orangeMoneyCode || '');
        }
      }
    } catch { /* silently fail */ }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchPaymentConfig();
  }, [fetchProducts, fetchOrders, fetchPaymentConfig]);

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormPrice(0);
    setFormCurrency('XOF');
    setFormCategory('Général');
    setFormImageUrl('');
    setFormImageFile(null);
    setFormImagePreview('');
    setFormProductUrl('');
    setFormPaymentUrl('');
    setFormInStock(true);
    setFormStockQuantity(undefined);
    setEditingProduct(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormDescription(product.description);
    setFormPrice(product.price);
    setFormCurrency(product.currency);
    setFormCategory(product.category);
    setFormImageUrl(product.imageUrl || '');
    setFormImagePreview(product.imageUrl || '');
    setFormImageFile(null);
    setFormProductUrl(product.productUrl || '');
    setFormPaymentUrl(product.paymentUrl || '');
    setFormInStock(product.inStock);
    setFormStockQuantity(product.stockQuantity);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      message.warning('Le nom du produit est requis.');
      return;
    }
    if (!formPrice || formPrice <= 0) {
      message.warning('Le prix doit être supérieur à 0.');
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = formImageUrl.trim();

      // Convert file to base64 data URL if a file was selected
      if (formImageFile) {
        finalImageUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(formImageFile);
        });
      }

      const body = {
        ...(editingProduct ? { id: editingProduct.id } : {}),
        name: formName.trim(),
        description: formDescription.trim(),
        price: formPrice,
        currency: formCurrency,
        category: formCategory,
        imageUrl: finalImageUrl,
        productUrl: formProductUrl.trim(),
        paymentUrl: formPaymentUrl.trim(),
        inStock: formInStock,
        stockQuantity: formStockQuantity,
      };

      const res = await fetch('/api/ecommerce/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        message.success(editingProduct ? 'Produit mis à jour !' : 'Produit ajouté !');
        setModalOpen(false);
        resetForm();
        fetchProducts();
      } else {
        const data = await res.json();
        message.error(data.error || 'Erreur');
      }
    } catch {
      message.error('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (product: Product) => {
    modal.confirm({
      title: 'Supprimer ce produit ?',
      content: `Êtes-vous sûr de vouloir supprimer "${product.name}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: async () => {
        try {
          const res = await fetch('/api/ecommerce/products', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: product.id }),
          });
          if (res.ok) {
            message.success('Produit supprimé');
            fetchProducts();
          }
        } catch {
          message.error('Erreur');
        }
      },
    });
  };

  const toggleStock = async (product: Product) => {
    try {
      await fetch('/api/ecommerce/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, inStock: !product.inStock }),
      });
      fetchProducts();
    } catch {
      message.error('Erreur');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/ecommerce/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });
      if (res.ok) {
        message.success('Statut mis à jour');
        fetchOrders();
      }
    } catch {
      message.error('Erreur');
    }
  };

  const handleImportCsv = async () => {
    if (!importCsv.trim()) {
      message.warning('Collez vos données CSV.');
      return;
    }
    setImporting(true);
    try {
      const res = await fetch('/api/ecommerce/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: importCsv, replace: importReplace }),
      });
      const data = await res.json();
      if (res.ok) {
        message.success(`${data.imported} produits importés ! (Total: ${data.total})`);
        setImportModalOpen(false);
        setImportCsv('');
        fetchProducts();
      } else {
        message.error(data.error || 'Erreur d\'import');
      }
    } catch {
      message.error('Erreur réseau');
    } finally {
      setImporting(false);
    }
  };

  const handleSavePaymentConfig = async () => {
    setPaymentSaving(true);
    try {
      const res = await fetch('/api/ecommerce/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waveMerchantCode, orangeMoneyCode }),
      });
      if (res.ok) {
        message.success('Configuration de paiement sauvegardée');
        setPaymentModalOpen(false);
      }
    } catch {
      message.error('Erreur');
    } finally {
      setPaymentSaving(false);
    }
  };

  // Order stats
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const totalRevenue = orders
    .filter((o) => ['paid', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrderCount = orders.length;

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  // Stats
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const categories = [...new Set(products.map((p) => p.category))];

  if (loading) {
    return (
      <Flexbox align="center" justify="center" style={{ height: '100%' }}>
        <Spin size="large" />
      </Flexbox>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Flexbox align="center" gap={16} horizontal>
          <Store size={40} color="white" />
          <div>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              E-Commerce
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
              Gérez votre catalogue de produits et automatisez vos ventes via WhatsApp
            </Text>
          </div>
        </Flexbox>
      </div>

      {/* Stats */}
      <Flexbox gap={16} horizontal style={{ marginBottom: 24 }} wrap="wrap">
        <Card className={styles.statsCard} style={{ flex: 1, minWidth: 140 }}>
          <Package size={24} color={theme.colorPrimary} style={{ marginBottom: 8 }} />
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Produits</Text>
            <Title level={3} style={{ margin: 0 }}>{totalProducts}</Title>
          </div>
        </Card>
        <Card className={styles.statsCard} style={{ flex: 1, minWidth: 140 }}>
          <ShoppingBag size={24} color="#52c41a" style={{ marginBottom: 8 }} />
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>En stock</Text>
            <Title level={3} style={{ margin: 0 }}>{inStockCount}</Title>
          </div>
        </Card>
        <Card className={styles.statsCard} style={{ flex: 1, minWidth: 140 }}>
          <TrendingUp size={24} color="#faad14" style={{ marginBottom: 8 }} />
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Catégories</Text>
            <Title level={3} style={{ margin: 0 }}>{categories.length}</Title>
          </div>
        </Card>
        <Card className={styles.statsCard} style={{ flex: 1, minWidth: 140 }}>
          <ShoppingCart size={24} color="#eb2f96" style={{ marginBottom: 8 }} />
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Valeur totale</Text>
            <Title level={4} style={{ margin: 0 }}>{formatPrice(totalValue, 'XOF')}</Title>
          </div>
        </Card>
      </Flexbox>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ marginBottom: 16 }}
        items={[
          {
            key: 'products',
            label: (
              <Flexbox align="center" gap={6} horizontal>
                <Package size={16} /> Produits ({totalProducts})
              </Flexbox>
            ),
          },
          {
            key: 'orders',
            label: (
              <Flexbox align="center" gap={6} horizontal>
                <ClipboardList size={16} /> Commandes
                {pendingOrders > 0 && <Badge count={pendingOrders} size="small" />}
              </Flexbox>
            ),
          },
          {
            key: 'stats',
            label: (
              <Flexbox align="center" gap={6} horizontal>
                <BarChart3 size={16} /> Statistiques
              </Flexbox>
            ),
          },
        ]}
      />

      {/* ====== PRODUCTS TAB ====== */}
      {activeTab === 'products' && (
        <>
          {/* Toolbar */}
          <Flexbox gap={12} horizontal style={{ marginBottom: 16 }} wrap="wrap" align="center">
            <Input
              allowClear
              placeholder="Rechercher un produit..."
              prefix={<Search size={16} />}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
            />
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ minWidth: 160 }}
              options={[
                { label: 'Toutes les catégories', value: 'all' },
                ...CATEGORIES.map((c) => ({ label: c, value: c })),
              ]}
            />
            <Button icon={<FileSpreadsheet size={16} />} onClick={() => setImportModalOpen(true)}>
              Importer CSV
            </Button>
            <Button icon={<Wallet size={16} />} onClick={() => setPaymentModalOpen(true)}>
              Paiement
            </Button>
            <Button type="primary" icon={<Plus size={16} />} onClick={openAddModal}>
              Ajouter
            </Button>
          </Flexbox>

          {filteredProducts.length === 0 ? (
            <Card className={styles.emptyState}>
              <Empty
                image={<Box size={64} color={theme.colorTextQuaternary} />}
                description={
                  totalProducts === 0
                    ? 'Aucun produit encore. Ajoutez vos premiers produits pour commencer à vendre !'
                    : 'Aucun produit ne correspond à votre recherche.'
                }
              >
                {totalProducts === 0 && (
                  <Space>
                    <Button type="primary" icon={<Plus size={16} />} onClick={openAddModal}>
                      Ajouter mon premier produit
                    </Button>
                    <Button icon={<FileSpreadsheet size={16} />} onClick={() => setImportModalOpen(true)}>
                      Importer un CSV
                    </Button>
                  </Space>
                )}
              </Empty>
            </Card>
          ) : (
            <Card bodyStyle={{ padding: 0 }}>
              <Table
                dataSource={filteredProducts}
                rowKey="id"
                pagination={filteredProducts.length > 10 ? { pageSize: 10 } : false}
                columns={[
                  {
                    title: 'Produit',
                    key: 'product',
                    render: (_: any, record: Product) => (
                      <Flexbox gap={12} horizontal align="center">
                        <div className={styles.productImage}>
                          {record.imageUrl ? (
                            <img
                              src={record.imageUrl}
                              alt={record.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                            />
                          ) : (
                            <Package size={24} />
                          )}
                        </div>
                        <div>
                          <Text strong>{record.name}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.description ? record.description.substring(0, 60) + (record.description.length > 60 ? '...' : '') : 'Pas de description'}
                          </Text>
                        </div>
                      </Flexbox>
                    ),
                  },
                  {
                    title: 'Prix',
                    key: 'price',
                    width: 150,
                    render: (_: any, record: Product) => (
                      <Text strong style={{ color: theme.colorPrimary }}>
                        {formatPrice(record.price, record.currency)}
                      </Text>
                    ),
                    sorter: (a: Product, b: Product) => a.price - b.price,
                  },
                  {
                    title: 'Catégorie',
                    key: 'category',
                    width: 150,
                    render: (_: any, record: Product) => <Tag>{record.category}</Tag>,
                  },
                  {
                    title: 'Stock',
                    key: 'stock',
                    width: 100,
                    render: (_: any, record: Product) => (
                      <Tag color={record.inStock ? 'green' : 'red'}>
                        {record.inStock ? 'En stock' : 'Épuisé'}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Actions',
                    key: 'actions',
                    width: 120,
                    render: (_: any, record: Product) => (
                      <Space>
                        <Button type="text" size="small" icon={<Edit3 size={14} />} onClick={() => openEditModal(record)} />
                        <Button type="text" size="small" danger icon={<Trash2 size={14} />} onClick={() => handleDelete(record)} />
                      </Space>
                    ),
                  },
                ]}
              />
            </Card>
          )}
        </>
      )}

      {/* ====== ORDERS TAB ====== */}
      {activeTab === 'orders' && (
        <>
          {orders.length === 0 ? (
            <Card className={styles.emptyState}>
              <Empty
                image={<ClipboardList size={64} color={theme.colorTextQuaternary} />}
                description="Aucune commande encore. Les commandes passées via WhatsApp apparaîtront ici."
              />
            </Card>
          ) : (
            <Card bodyStyle={{ padding: 0 }}>
              <Table
                dataSource={orders}
                rowKey="id"
                pagination={orders.length > 10 ? { pageSize: 10 } : false}
                columns={[
                  {
                    title: 'Client',
                    key: 'customer',
                    render: (_: any, record: Order) => (
                      <div>
                        <Text strong>{record.customerName}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.customerPhone}</Text>
                      </div>
                    ),
                  },
                  {
                    title: 'Articles',
                    key: 'items',
                    render: (_: any, record: Order) => (
                      <div>
                        {record.items.map((item, i) => (
                          <div key={i}>
                            <Text style={{ fontSize: 12 }}>{item.quantity}x {item.productName}</Text>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    title: 'Total',
                    key: 'total',
                    width: 150,
                    render: (_: any, record: Order) => (
                      <Text strong style={{ color: theme.colorPrimary }}>
                        {formatPrice(record.totalAmount, record.currency)}
                      </Text>
                    ),
                    sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
                  },
                  {
                    title: 'Source',
                    key: 'source',
                    width: 100,
                    render: (_: any, record: Order) => (
                      <Tag color={record.source === 'whatsapp' ? 'green' : 'blue'}>
                        {record.source === 'whatsapp' ? 'WhatsApp' : 'Manuel'}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Statut',
                    key: 'status',
                    width: 150,
                    render: (_: any, record: Order) => (
                      <Select
                        value={record.status}
                        size="small"
                        style={{ width: 130 }}
                        onChange={(val) => handleUpdateOrderStatus(record.id, val)}
                        options={Object.entries(ORDER_STATUS_MAP).map(([k, v]) => ({
                          label: v.label,
                          value: k,
                        }))}
                      />
                    ),
                  },
                  {
                    title: 'Date',
                    key: 'date',
                    width: 140,
                    render: (_: any, record: Order) => (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(record.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </Text>
                    ),
                  },
                ]}
              />
            </Card>
          )}
        </>
      )}

      {/* ====== STATS TAB ====== */}
      {activeTab === 'stats' && (
        <>
          <Flexbox gap={16} horizontal style={{ marginBottom: 24 }} wrap="wrap">
            <Card className={styles.statsCard} style={{ flex: 1, minWidth: 180 }}>
              <ShoppingCart size={28} color={theme.colorPrimary} style={{ marginBottom: 8 }} />
              <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Total commandes</Text>
              <Title level={2} style={{ margin: 0 }}>{totalOrderCount}</Title>
            </Card>
            <Card className={styles.statsCard} style={{ flex: 1, minWidth: 180 }}>
              <CheckCircle size={28} color="#52c41a" style={{ marginBottom: 8 }} />
              <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>En attente</Text>
              <Title level={2} style={{ margin: 0 }}>{pendingOrders}</Title>
            </Card>
            <Card className={styles.statsCard} style={{ flex: 1, minWidth: 180 }}>
              <TrendingUp size={28} color="#faad14" style={{ marginBottom: 8 }} />
              <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Chiffre d&apos;affaires</Text>
              <Title level={3} style={{ margin: 0 }}>{formatPrice(totalRevenue, 'XOF')}</Title>
            </Card>
            <Card className={styles.statsCard} style={{ flex: 1, minWidth: 180 }}>
              <Package size={28} color="#eb2f96" style={{ marginBottom: 8 }} />
              <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Produits au catalogue</Text>
              <Title level={2} style={{ margin: 0 }}>{totalProducts}</Title>
            </Card>
          </Flexbox>

          <Card title="Répartition par catégorie" style={{ marginBottom: 16 }}>
            {categories.length === 0 ? (
              <Text type="secondary">Aucun produit dans le catalogue</Text>
            ) : (
              <Flexbox gap={8} wrap="wrap" horizontal>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category === cat).length;
                  const catValue = products.filter((p) => p.category === cat).reduce((s, p) => s + p.price, 0);
                  return (
                    <Card key={cat} size="small" style={{ minWidth: 160 }}>
                      <Text strong>{cat}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>{count} produit(s)</Text>
                      <br />
                      <Text style={{ fontSize: 12, color: theme.colorPrimary }}>{formatPrice(catValue, 'XOF')}</Text>
                    </Card>
                  );
                })}
              </Flexbox>
            )}
          </Card>

          <Card title="Commandes récentes">
            {orders.length === 0 ? (
              <Text type="secondary">Aucune commande pour le moment</Text>
            ) : (
              <Flexbox gap={8}>
                {orders.slice(0, 5).map((order) => {
                  const statusInfo = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.pending;
                  return (
                    <Flexbox key={order.id} horizontal align="center" gap={12} style={{ padding: '8px 0', borderBottom: `1px solid ${theme.colorBorderSecondary}` }}>
                      <div style={{ flex: 1 }}>
                        <Text strong>{order.customerName}</Text>
                        <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                          {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                        </Text>
                      </div>
                      <Text strong style={{ color: theme.colorPrimary }}>{formatPrice(order.totalAmount, order.currency)}</Text>
                      <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
                    </Flexbox>
                  );
                })}
              </Flexbox>
            )}
          </Card>
        </>
      )}

      {/* ====== MODALS ====== */}

      {/* Add/Edit Product Modal */}
      <Modal
        title={editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          resetForm();
        }}
        onOk={handleSave}
        okText={editingProduct ? 'Enregistrer' : 'Ajouter'}
        cancelText="Annuler"
        confirmLoading={saving}
        width={560}
      >
        <Flexbox gap={16} style={{ marginTop: 16 }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Nom du produit *</Text>
            <Input
              placeholder="Ex: T-shirt Premium Noir"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Description</Text>
            <TextArea
              placeholder="Décrivez votre produit..."
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>
          <Flexbox gap={12} horizontal>
            <div style={{ flex: 1 }}>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>Prix *</Text>
              <InputNumber
                min={0}
                value={formPrice}
                onChange={(v) => setFormPrice(v || 0)}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>Devise</Text>
              <Select
                value={formCurrency}
                onChange={setFormCurrency}
                options={CURRENCIES}
                style={{ width: '100%' }}
              />
            </div>
          </Flexbox>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Catégorie</Text>
            <Select
              value={formCategory}
              onChange={setFormCategory}
              options={CATEGORIES.map((c) => ({ label: c, value: c }))}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Image du produit</Text>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) {
                    message.warning('L\'image ne doit pas dépasser 2 Mo');
                    return;
                  }
                  setFormImageFile(file);
                  setFormImageUrl('');
                  const reader = new FileReader();
                  reader.onloadend = () => setFormImagePreview(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
            {formImagePreview ? (
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
                <img
                  src={formImagePreview}
                  alt="Aperçu"
                  style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, border: `2px solid ${theme.colorBorder}` }}
                />
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<X size={14} />}
                  style={{ position: 'absolute', top: -8, right: -8, background: 'white', borderRadius: '50%', boxShadow: '0 2px 6px rgba(0,0,0,0.15)', width: 24, height: 24, padding: 0, minWidth: 24 }}
                  onClick={() => { setFormImageFile(null); setFormImagePreview(''); setFormImageUrl(''); if (imageInputRef.current) imageInputRef.current.value = ''; }}
                />
              </div>
            ) : null}
            <Flexbox gap={8} horizontal align="center">
              <Button
                icon={<ImagePlus size={16} />}
                onClick={() => imageInputRef.current?.click()}
                style={{ flex: 1 }}
              >
                {formImagePreview ? 'Changer l\'image' : 'Choisir une image'}
              </Button>
            </Flexbox>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>ou coller une URL :</Text>
              <Input
                size="small"
                placeholder="https://example.com/image.jpg"
                value={formImageUrl}
                onChange={(e) => {
                  setFormImageUrl(e.target.value);
                  if (e.target.value) {
                    setFormImagePreview(e.target.value);
                    setFormImageFile(null);
                    if (imageInputRef.current) imageInputRef.current.value = '';
                  } else {
                    setFormImagePreview('');
                  }
                }}
                style={{ marginTop: 4 }}
              />
            </div>
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Lien du produit (optionnel)</Text>
            <Input
              placeholder="https://example.com/mon-produit"
              value={formProductUrl}
              onChange={(e) => setFormProductUrl(e.target.value)}
              prefix={<Text type="secondary" style={{ fontSize: 11 }}>🔗</Text>}
            />
            <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
              Lien vers le produit sur une autre plateforme (Shopify, WooCommerce, etc.)
            </Text>
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Lien de paiement (optionnel)</Text>
            <Input
              placeholder="https://pay.example.com/checkout"
              value={formPaymentUrl}
              onChange={(e) => setFormPaymentUrl(e.target.value)}
              prefix={<Text type="secondary" style={{ fontSize: 11 }}>💳</Text>}
            />
            <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
              Lien de paiement direct (Stripe, PayPal, Wave, etc.)
            </Text>
          </div>
          <Flexbox gap={12} horizontal align="center">
            <div style={{ flex: 1 }}>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>Quantité en stock</Text>
              <InputNumber
                min={0}
                value={formStockQuantity}
                onChange={(v) => setFormStockQuantity(v ?? undefined)}
                placeholder="Illimité si vide"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>En stock</Text>
              <Switch checked={formInStock} onChange={setFormInStock} />
            </div>
          </Flexbox>
        </Flexbox>
      </Modal>

      {/* CSV Import Modal */}
      <Modal
        title="Importer des produits (CSV)"
        open={importModalOpen}
        onCancel={() => { setImportModalOpen(false); setImportCsv(''); }}
        onOk={handleImportCsv}
        okText="Importer"
        cancelText="Annuler"
        confirmLoading={importing}
        width={620}
      >
        <Flexbox gap={16} style={{ marginTop: 16 }}>
          <Card size="small" style={{ background: theme.colorPrimaryBg }}>
            <Text strong>Format CSV attendu :</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Colonnes: <b>Nom, Description, Prix, Devise, Catégorie, Image, Stock</b>
              <br />
              Séparateur: virgule, point-virgule ou tabulation.
              La première ligne doit contenir les en-têtes.
            </Text>
          </Card>
          <Card size="small">
            <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>
              Nom;Description;Prix;Devise;Catégorie;Stock{'\n'}
              T-shirt Noir;T-shirt coton premium;5000;XOF;Mode & Vêtements;50{'\n'}
              Casque Bluetooth;Son HD sans fil;15000;XOF;Électronique;20
            </Text>
          </Card>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Collez vos données CSV ici :</Text>
            <TextArea
              rows={8}
              placeholder="Nom;Description;Prix;Devise;Catégorie;Stock&#10;Mon Produit;Description...;5000;XOF;Général;100"
              value={importCsv}
              onChange={(e) => setImportCsv(e.target.value)}
            />
          </div>
          <Flexbox horizontal align="center" gap={8}>
            <Switch checked={importReplace} onChange={setImportReplace} />
            <Text type={importReplace ? 'danger' : 'secondary'} style={{ fontSize: 12 }}>
              {importReplace ? 'Remplacer tous les produits existants' : 'Ajouter aux produits existants'}
            </Text>
          </Flexbox>
        </Flexbox>
      </Modal>

      {/* Payment Config Modal */}
      <Modal
        title="Configuration des paiements mobiles"
        open={paymentModalOpen}
        onCancel={() => setPaymentModalOpen(false)}
        footer={null}
        width={520}
      >
        <Flexbox gap={16} style={{ marginTop: 16 }}>
          <Card size="small" style={{ background: theme.colorPrimaryBg }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Configurez vos informations de paiement mobile. Quand un client passe commande via WhatsApp,
              l&apos;agent IA lui fournira automatiquement vos coordonnées de paiement.
            </Text>
          </Card>
          <div>
            <Flexbox horizontal align="center" gap={8} style={{ marginBottom: 8 }}>
              <img src="/wave.jpg" alt="Wave" style={{ width: 24, height: 24, borderRadius: 12, objectFit: 'cover' }} />
              <Text strong>Wave</Text>
            </Flexbox>
            <Input
              placeholder="Numéro Wave (ex: +225 07 00 00 00 00)"
              value={waveMerchantCode}
              onChange={(e) => setWaveMerchantCode(e.target.value)}
            />
          </div>
          <div>
            <Flexbox horizontal align="center" gap={8} style={{ marginBottom: 8 }}>
              <img src="/orange.png" alt="Orange Money" style={{ width: 24, height: 24, borderRadius: 12, objectFit: 'cover' }} />
              <Text strong>Orange Money</Text>
            </Flexbox>
            <Input
              placeholder="Numéro Orange Money (ex: +225 07 00 00 00 00)"
              value={orangeMoneyCode}
              onChange={(e) => setOrangeMoneyCode(e.target.value)}
            />
          </div>
          <Card size="small">
            <Text type="secondary" style={{ fontSize: 12 }}>
              L&apos;agent WhatsApp enverra ces informations au client après une commande :
            </Text>
            <br />
            <Text style={{ fontSize: 12 }}>
              {waveMerchantCode && `Wave: ${waveMerchantCode}`}
              {waveMerchantCode && orangeMoneyCode && ' | '}
              {orangeMoneyCode && `Orange Money: ${orangeMoneyCode}`}
              {!waveMerchantCode && !orangeMoneyCode && <Text type="secondary">Aucun moyen de paiement configuré</Text>}
            </Text>
          </Card>
          <Button type="primary" block onClick={handleSavePaymentConfig} loading={paymentSaving}>
            Sauvegarder la configuration
          </Button>
        </Flexbox>
      </Modal>
    </div>
  );
});

export default EcommercePage;
