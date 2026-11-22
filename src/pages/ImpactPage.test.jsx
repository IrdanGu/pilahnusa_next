import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const ecoState = vi.hoisted(() => ({
  ledger: {
    totalScans: 0,
    totalPoints: 0,
    co2SavedKg: 0,
    categoryCounts: { Organik: 0, Anorganik: 0, B3: 0 },
  },
  level: { id: 'kecambah', name: 'Kecambah', description: 'Baru mulai.', icon: 'Sprout', minPoints: 0 },
  nextLevel: { id: 'tunas-hijau', name: 'Tunas Hijau', description: 'Tumbuh.', icon: 'Leaf', minPoints: 100 },
  progressPercent: 0,
  streak: 0,
  badges: [],
  unlockedCount: 0,
  weeklyActivity: [],
  resetImpact: vi.fn(),
}));

vi.mock('../hooks/useEcoImpact', () => ({
  default: () => ecoState,
}));

vi.mock('../components/ui/Toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

vi.mock('../utils/shareCard', () => ({
  generateImpactShareCard: vi.fn(),
  shareOrDownloadCard: vi.fn(),
  buildWhatsAppShareUrl: (text) => `https://wa.me/?text=${encodeURIComponent(text)}`,
  copyToClipboard: vi.fn(async () => true),
}));

import ImpactPage from './ImpactPage';

const renderPage = () => render(<MemoryRouter><ImpactPage /></MemoryRouter>);

describe('ImpactPage', () => {
  beforeEach(() => {
    ecoState.ledger = {
      totalScans: 0, totalPoints: 0, co2SavedKg: 0,
      categoryCounts: { Organik: 0, Anorganik: 0, B3: 0 },
    };
    ecoState.level = { id: 'kecambah', name: 'Kecambah', description: 'Baru mulai.', icon: 'Sprout', minPoints: 0 };
    ecoState.nextLevel = { id: 'tunas-hijau', name: 'Tunas Hijau', description: 'Tumbuh.', icon: 'Leaf', minPoints: 100 };
    ecoState.progressPercent = 0;
    ecoState.streak = 0;
    ecoState.badges = [];
    ecoState.unlockedCount = 0;
    ecoState.resetImpact.mockClear();
  });

  it('renders the empty state and its two CTA links', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'DampakKu', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Mulai jejak hijau pertamamu' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mulai Scan Pertama' })).toHaveAttribute('href', '/scan');
    expect(screen.getByRole('link', { name: 'Main Eco Challenge' })).toHaveAttribute('href', '/tantangan');
  });

  it('shows seeded ledger metrics, level, and unlocked badge collection', () => {
    ecoState.ledger = {
      totalScans: 12, totalPoints: 320, co2SavedKg: 7.125,
      categoryCounts: { Organik: 5, Anorganik: 6, B3: 1 },
    };
    ecoState.level = { id: 'penggerak-pilah', name: 'Penggerak Pilah', description: 'Rutin memilah.', icon: 'Recycle', minPoints: 250 };
    ecoState.nextLevel = { id: 'duta-daur-ulang', name: 'Duta Daur Ulang', description: 'Konsisten.', icon: 'Award', minPoints: 500 };
    ecoState.progressPercent = 28;
    ecoState.streak = 4;
    ecoState.badges = [{ id: 'first-scan' }, { id: 'five-scans' }];
    ecoState.unlockedCount = 2;
    ecoState.weeklyActivity = [
      { date: '2026-11-15', label: 'Min', count: 1 },
      { date: '2026-11-16', label: 'Sen', count: 3 },
    ];

    renderPage();
    expect(screen.getByText('320')).toBeInTheDocument();
    expect(screen.getByText('7.13 kg')).toBeInTheDocument();
    expect(screen.getAllByText('Penggerak Pilah').length).toBeGreaterThan(0);
    expect(screen.getByText('4 hari')).toBeInTheDocument();
    expect(screen.getByText('2 / 8')).toBeInTheDocument();
  });

  it('opens reset confirmation and resets only after confirmation', () => {
    ecoState.ledger = {
      totalScans: 3, totalPoints: 45, co2SavedKg: 1.5,
      categoryCounts: { Organik: 2, Anorganik: 1, B3: 0 },
    };
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Reset Statistik Dampak' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(ecoState.resetImpact).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Reset Statistik' }));
    expect(ecoState.resetImpact).toHaveBeenCalledOnce();
  });
});
