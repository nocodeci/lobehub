'use client';

import { Flexbox } from '@lobehub/ui';
import { App, Button, Card, Empty, Input, InputNumber, Modal, Select, Space, Spin, Switch, Table, Tag, Typography, Upload } from 'antd';
import { createStyles } from 'antd-style';
import {
  Box,
  Edit3,
  ImagePlus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Store,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  imageUrl?: string;
  inStock: boolean;
  stockQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

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
    background: linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryBg} 100%);
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
  const [formInStock, setFormInStock] = useState(true);
  const [formStockQuantity, setFormStockQuantity] = useState<number | undefined>(undefined);

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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormPrice(0);
    setFormCurrency('XOF');
    setFormCategory('Général');
    setFormImageUrl('');
    setFormInStock(true);
    setFormStockQuantity(undefined);
    setEditingProduct(null);
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
      const body = {
        ...(editingProduct ? { id: editingProduct.id } : {}),
        name: formName.trim(),
        description: formDescription.trim(),
        price: formPrice,
        currency: formCurrency,
        category: formCategory,
        imageUrl: formImageUrl.trim(),
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

      {/* Info banner */}
      <Card
        style={{
          marginBottom: 24,
          background: `linear-gradient(90deg, ${theme.colorPrimaryBg}, ${theme.colorBgContainer})`,
          border: `1px solid ${theme.colorPrimaryBorder}`,
        }}
      >
        <Flexbox gap={12} horizontal align="center">
          <ShoppingCart size={20} color={theme.colorPrimary} />
          <div>
            <Text strong>Vendez automatiquement via WhatsApp</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Vos produits seront automatiquement intégrés dans les réponses de votre agent IA WhatsApp.
              Quand un client demande un produit, l&apos;agent consulte votre catalogue et peut fournir prix, descriptions et disponibilités.
            </Text>
          </div>
        </Flexbox>
      </Card>

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
        <Button type="primary" icon={<Plus size={16} />} onClick={openAddModal}>
          Ajouter un produit
        </Button>
      </Flexbox>

      {/* Product List */}
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
              <Button type="primary" icon={<Plus size={16} />} onClick={openAddModal}>
                Ajouter mon premier produit
              </Button>
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
                render: (_, record: Product) => (
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
                render: (_, record: Product) => (
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
                render: (_, record: Product) => <Tag>{record.category}</Tag>,
              },
              {
                title: 'Stock',
                key: 'stock',
                width: 100,
                render: (_, record: Product) => (
                  <Tag color={record.inStock ? 'green' : 'red'}>
                    {record.inStock ? 'En stock' : 'Épuisé'}
                  </Tag>
                ),
              },
              {
                title: 'Actions',
                key: 'actions',
                width: 120,
                render: (_, record: Product) => (
                  <Space>
                    <Button
                      type="text"
                      size="small"
                      icon={<Edit3 size={14} />}
                      onClick={() => openEditModal(record)}
                    />
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<Trash2 size={14} />}
                      onClick={() => handleDelete(record)}
                    />
                  </Space>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* Add/Edit Modal */}
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
            <Text strong style={{ display: 'block', marginBottom: 4 }}>URL de l&apos;image</Text>
            <Input
              placeholder="https://example.com/image.jpg"
              value={formImageUrl}
              onChange={(e) => setFormImageUrl(e.target.value)}
            />
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
    </div>
  );
});

export default EcommercePage;
