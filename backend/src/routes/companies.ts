import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/companies/:slug - 公開企業ページ取得（認証不要）
router.get('/:slug', async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { slug: req.params.slug },
      include: { departments: true },
    });
    if (!company) return res.status(404).json({ error: '企業が見つかりません' });
    res.json(company);
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// POST /api/companies - 企業登録
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const Schema = z.object({
    name: z.string().min(1),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
    description: z.string().optional(),
    industry: z.string().optional(),
    website: z.string().url().optional(),
  });

  try {
    const body = Schema.parse(req.body);
    const existing = await prisma.company.findUnique({ where: { slug: body.slug } });
    if (existing) return res.status(400).json({ error: 'このURLは既に使用されています' });

    const company = await prisma.company.create({
      data: { ...body, ownerId: req.userId! },
    });
    res.status(201).json(company);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// PATCH /api/companies/:id - 企業情報更新
router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const company = await prisma.company.findFirst({
      where: { id: req.params.id, ownerId: req.userId },
    });
    if (!company) return res.status(403).json({ error: '権限がありません' });

    const updated = await prisma.company.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// POST /api/companies/:id/departments - 部署追加
router.post('/:id/departments', requireAuth, async (req: AuthRequest, res) => {
  const Schema = z.object({
    name: z.string().min(1),
    category: z.enum(['marketing', 'system', 'hr', 'finance', 'executive', 'other']),
    contactEmail: z.string().email().optional(),
    slackWebhook: z.string().url().optional(),
    allowPitches: z.boolean().default(true),
  });

  try {
    const company = await prisma.company.findFirst({
      where: { id: req.params.id, ownerId: req.userId },
    });
    if (!company) return res.status(403).json({ error: '権限がありません' });

    const body = Schema.parse(req.body);
    const dept = await prisma.department.create({
      data: { ...body, companyId: req.params.id },
    });
    res.status(201).json(dept);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// GET /api/companies/:id/departments
router.get('/:id/departments', async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: { companyId: req.params.id },
    });
    res.json(departments);
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

export default router;
