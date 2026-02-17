'use client';

import { Flexbox } from '@lobehub/ui';
import { Checkbox, Empty, Spin, Tag, Typography } from 'antd';
import { memo, useEffect, useState } from 'react';

const { Text } = Typography;

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  imageUrl?: string;
  inStock: boolean;
  stockQuantity?: number;
}

interface EcommerceProductSelectorProps {
  onChange?: (value: string[]) => void;
  value?: string[];
}

const EcommerceProductSelector = memo<EcommerceProductSelectorProps>(({ value = [], onChange }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Flexbox align="center" justify="center" style={{ padding: 16 }}>
        <Spin size="small" />
      </Flexbox>
    );
  }

  if (products.length === 0) {
    return (
      <Empty
        description={
          <Text type="secondary" style={{ fontSize: 12 }}>
            Aucun produit dans votre catalogue. Ajoutez des produits dans la page E-Commerce.
          </Text>
        }
        imageStyle={{ height: 40 }}
        style={{ margin: '8px 0' }}
      />
    );
  }

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString('fr-FR')} ${currency}`;
  };

  const handleToggle = (productId: string) => {
    const current = value || [];
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    onChange?.(next);
  };

  const selectedCount = (value || []).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          {selectedCount === 0
            ? 'Tous les produits (aucune sélection)'
            : `${selectedCount} produit${selectedCount > 1 ? 's' : ''} sélectionné${selectedCount > 1 ? 's' : ''}`}
        </Text>
        {selectedCount > 0 && (
          <span
            role="button"
            tabIndex={0}
            style={{ fontSize: 11, cursor: 'pointer', color: '#6366f1' }}
            onClick={() => onChange?.([])}
          >
            Tout désélectionner
          </span>
        )}
      </div>
      {products.map((product) => {
        const isSelected = (value || []).includes(product.id);
        return (
          <div
            key={product.id}
            onClick={() => handleToggle(product.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: `1px solid ${isSelected ? '#6366f1' : '#f0f0f0'}`,
              borderRadius: 8,
              cursor: 'pointer',
              padding: '8px 12px',
              background: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <Checkbox checked={isSelected} style={{ pointerEvents: 'none' }} />
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
            )}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Text strong style={{ fontSize: 12, lineHeight: 1.4 }} ellipsis>
                {product.name}
              </Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {formatPrice(product.price, product.currency)}
                </Text>
                <Tag
                  color={product.inStock ? 'green' : 'red'}
                  style={{ fontSize: 10, margin: 0, lineHeight: '16px', padding: '0 4px' }}
                >
                  {product.inStock ? 'En stock' : 'Épuisé'}
                </Tag>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

EcommerceProductSelector.displayName = 'EcommerceProductSelector';

export default EcommerceProductSelector;
