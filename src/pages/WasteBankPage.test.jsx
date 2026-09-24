import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import WasteBankPage from './WasteBankPage';
import { WASTE_BANKS } from '../data/wasteBanks';
import { sortByDistance } from '../utils/geolocationUtils';

const renderPage = () =>
  render(
    <MemoryRouter>
      <WasteBankPage />
    </MemoryRouter>
  );

describe('WasteBankPage', () => {
  let getCurrentPosition;

  beforeEach(() => {
    getCurrentPosition = vi.fn();
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: { getCurrentPosition },
    });
  });

  it('shows a loading state while requesting location', () => {
    renderPage();

    expect(screen.getByText('Mencari bank sampah terdekat...')).toBeInTheDocument();
    expect(getCurrentPosition).toHaveBeenCalledOnce();
    expect(getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      { timeout: 10000, maximumAge: 300000, enableHighAccuracy: false }
    );
  });

  it('sorts the actual waste bank dataset by distance after a successful request', async () => {
    renderPage();
    const [firstBank] = WASTE_BANKS;
    act(() => {
      getCurrentPosition.mock.calls[0][0]({
        coords: { latitude: firstBank.latitude, longitude: firstBank.longitude },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Bank Sampah Melati')).toBeInTheDocument();
    });

    const names = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent)
      .filter((name) => WASTE_BANKS.some((bank) => bank.name === name));
    const expectedNames = sortByDistance(WASTE_BANKS, {
      latitude: firstBank.latitude,
      longitude: firstBank.longitude,
    }).map((bank) => bank.name);
    expect(names).toEqual(expectedNames);
    expect(screen.getByText('Jl. Kebon Jeruk No. 10, Jakarta Barat')).toBeInTheDocument();
    expect(screen.getAllByText('Buka').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Plastik').length).toBeGreaterThan(0);
    expect(screen.getByRole('list', { name: 'Daftar bank sampah' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Lihat rute ke Bank Sampah Melati' })).toHaveAttribute(
      'target',
      '_blank'
    );
  });

  it('shows an Indonesian error and retries the location request', async () => {
    renderPage();
    act(() => {
      getCurrentPosition.mock.calls[0][1]({ code: 1 });
    });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Lokasi tidak dapat diakses. Izinkan akses lokasi untuk mencari bank sampah terdekat.'
    );

    fireEvent.click(screen.getByRole('button', { name: /coba lagi/i }));
    expect(getCurrentPosition).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Mencari bank sampah terdekat...')).toBeInTheDocument();
  });
});
