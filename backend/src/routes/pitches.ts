import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/pitches?companyId=&category=&status=
// 受け取り側が自社宛のピッチを閲覧
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { companyId, category, status } = req.query;

  try {
    // 自分の所有する企業かチェック
    if (companyId) {
      const company = await prisma.company.findFirst({
        where: { id: String(companyId), ownerId: req.userId },
      });
      if (!company) return res.status(403).json({ error: '権限がありません' });
    }

    const pitches = await prisma.pitch.findMany({
      where: {
        ...(companyId ? { companyId: String(companyId) } : {}),
        ...(category ? { category: category as any } : {}),
        ...(status ? { status: status as any } : {}),
        status: { not: 'blocked' },
      },
      include: {
        sender: { select: { id: true, name: true, companyName: true, email: true, avatarUrl: true } },
        attachments: true,
        department: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(pitches);
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// POST /api/pitches - 資料の送付（営業側）
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const Schema = z.object({
    companyId: z.string(),
    departmentId: z.string().optional(),
    title: z.string().min(1).max(100),
    body: z.string().min(1).max(2000),
    category: z.enum(['marketing', 'system', 'hr', 'finance', 'executive', 'other']),
    attachments: z.array(z.object({
      name: z.string(),
      type: z.enum(['pdf', 'video', 'link', 'image']),
      url: z.string(),
      size: z.number().optional(),
    })).optional().default([]),
  });

  try {
    const body = Schema.parse(req.body);

    // 部署が受け取り許可しているか確認
    if (body.departmentId) {
      const dept = await prisma.department.findUnique({ where: { id: body.departmentId } });
      if (!dept?.allowPitches) return res.status(400).json({ error: 'この部署は現在資料を受け付けていません' });
    }

    // ブロックされていないか確認
    const blocked = await prisma.block.findFirst({
      where: { companyId: body.companyId, blockedSenderId: req.userId },
    });
    if (blocked) return res.status(403).json({ error: 'この企業への送付が制限されています' });

    const pitch = await prisma.pitch.create({
      data: {
        senderId: req.userId!,
        companyId: body.companyId,
        departmentId: body.departmentId,
        title: body.title,
        body: body.body,
        category: body.category,
        attachments: { create: body.attachments },
      },
      include: { attachments: true, sender: { select: { id: true, name: true, companyName: true } } },
    });

    // 通知作成
    const company = await prisma.company.findUnique({ where: { id: body.companyId } });
    if (company) {
      await prisma.notification.create({
        data: { userId: company.ownerId, pitchId: pitch.id, type: 'new_pitch' },
      });
    }

    res.status(201).json(pitch);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// PATCH /api/pitches/:id/save
router.patch('/:id/save', requireAuth, async (req: AuthRequest, res) => {
  await updatePitchStatus(req, res, 'saved');
});

// PATCH /api/pitches/:id/dismiss
router.patch('/:id/dismiss', requireAuth, async (req: AuthRequest, res) => {
  await updatePitchStatus(req, res, 'dismissed');
});

// PATCH /api/pitches/:id/read
router.patch('/:id/read', requireAuth, async (req: AuthRequest, res) => {
  await updatePitchStatus(req, res, 'read');
});

async function updatePitchStatus(req: AuthRequest, res: any, status: string) {
  try {
    const pitch = await prisma.pitch.findUnique({
      where: { id: req.params.id },
      include: { company: true },
    });
    if (!pitch) return res.status(404).json({ error: '資料が見つかりません' });
    if (pitch.company.ownerId !== req.userId) return res.status(403).json({ error: '権限がありません' });

    const updated = await prisma.pitch.update({
      where: { id: req.params.id },
      data: { status: status as any },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
}

// POST /api/pitches/:id/report - 報告
router.post('/:id/report', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ error: '報告理由を入力してください' });

    const report = await prisma.report.create({
      data: { pitchId: req.params.id, reason },
    });
    res.status(201).json(report);
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// POST /api/pitches/:id/block - 送信者をブロック
router.post('/:id/block', requireAuth, async (req: AuthRequest, res) => {
  try {
    const pitch = await prisma.pitch.findUnique({
      where: { id: req.params.id },
      include: { company: true },
    });
    if (!pitch) return res.status(404).json({ error: '資料が見つかりません' });
    if (pitch.company.ownerId !== req.userId) return res.status(403).json({ error: '権限がありません' });

    await prisma.block.create({
      data: { companyId: pitch.companyId, blockedSenderId: pitch.senderId },
    });
    await prisma.pitch.update({
      where: { id: req.params.id },
      data: { status: 'blocked' },
    });

    res.json({ message: 'ブロックしました' });
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

export default router;
