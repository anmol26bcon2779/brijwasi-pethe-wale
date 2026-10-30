import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { Product } from '../../src/types/index.js';

const router = Router();

// GET /api/products
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, search, bestseller, sort } = req.query;
    let list = db.getProducts();

    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.hindiName?.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }

    if (bestseller === 'true') {
      list = list.filter(p => p.isBestseller);
    }

    if (sort === 'price-asc') {
      list = [...list].sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
    } else if (sort === 'price-desc') {
      list = [...list].sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
    } else if (sort === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:slugOrId
router.get('/:slugOrId', (req: Request, res: Response) => {
  try {
    const product = db.getProductBySlugOrId(req.params.slugOrId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Delicacy not found' });
    }
    res.json({ success: true, data: product });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products (Admin)
router.post('/', (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.name || !body.category || !body.variants || !body.variants.length) {
      return res.status(400).json({ success: false, message: 'Name, category, and at least one weight variant are required' });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug,
      name: body.name,
      hindiName: body.hindiName,
      category: body.category,
      shortDescription: body.shortDescription || '',
      description: body.description || '',
      ingredients: Array.isArray(body.ingredients) ? body.ingredients : (body.ingredients ? body.ingredients.split(',') : []),
      shelfLife: body.shelfLife || '15 Days',
      storageInstructions: body.storageInstructions || 'Store in refrigeration',
      allergenInfo: body.allergenInfo,
      isVegetarian: body.isVegetarian !== undefined ? body.isVegetarian : true,
      isBestseller: Boolean(body.isBestseller),
      rating: 5.0,
      reviewCount: 0,
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : ['/brijwasi-logo.jpg'],
      variants: body.variants
    };

    const created = db.addProduct(newProduct);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/products/:id (Admin)
router.put('/:id', (req: Request, res: Response) => {
  try {
    const existing = db.getProductBySlugOrId(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updated = db.updateProduct({
      ...existing,
      ...req.body,
      id: existing.id // protect ID
    });

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const existing = db.getProductBySlugOrId(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    db.deleteProduct(existing.id);
    res.json({ success: true, message: `Product ${existing.name} removed successfully` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
