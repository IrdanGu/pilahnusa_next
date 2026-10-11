import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../data/wasteBanks', async () => {
  const actual = await vi.importActual('../data/wasteBanks');
  return {
    ...actual,
    WASTE_BANKS: [
      ...actual.WASTE_BANKS,
      {
        ...actual.WASTE_BANKS[0],
        id: 'fixture-phone',
        name: 'Bank Sampah Fixture Telepon',
        address: 'Fixture Telepon, Kuningan',
        phone: '+62 812-3456-7890',
      },
      {
        ...actual.WASTE_BANKS[0],
        id: 'fixture-invalid-coordinates',
        name: 'Bank Sampah Fixture Koordinat Tidak Valid',
        address: 'Fixture Koordinat, Kuningan',
        latitude: Number.NaN,
        longitude: Number.POSITIVE_INFINITY,
      },
    ],
  };
});

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

  it('provides a header action to request the current location again', () => {
    renderPage();

    const useLocationButton = screen.getByRole('button', { name: 'Gunakan lokasi saya' });
    expect(useLocationButton).toBeInTheDocument();

    fireEvent.click(useLocationButton);
    expect(getCurrentPosition).toHaveBeenCalledTimes(2);
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
      expect(screen.getByText('Bank Sampah Cilimus')).toBeInTheDocument();
    });

    const names = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent)
      .filter((name) => WASTE_BANKS.some((bank) => bank.name === name));
    const expectedNames = sortByDistance(
      WASTE_BANKS.filter(
        (bank) => Number.isFinite(bank.latitude) && Number.isFinite(bank.longitude)
      ),
      {
      latitude: firstBank.latitude,
      longitude: firstBank.longitude,
      }
    ).map((bank) => bank.name);
    expect(names).toEqual(expectedNames);
    expect(screen.getByText('Caracas, Cilimus')).toBeInTheDocument();
    expect(screen.getAllByText('Buka').length).toBeGreaterThan(0);
    const inactiveBank = WASTE_BANKS.find((bank) => bank.operatingStatus === 'Tutup');
    expect(inactiveBank).toBeDefined();
    expect(screen.getAllByText(inactiveBank.operatingStatus).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Material yang diterima belum dicantumkan').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Jam operasional tidak tersedia').length).toBeGreaterThan(0);
    const capacityBank = WASTE_BANKS.find((bank) => Number.isFinite(bank.capacityTonsPerDay));
    expect(capacityBank).toBeDefined();
    expect(
      screen.getAllByText(`Kapasitas: ${capacityBank.capacityTonsPerDay} ton/hari`).length
    ).toBeGreaterThan(0);
    expect(screen.getByRole('list', { name: 'Daftar bank sampah' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Lihat rute ke Bank Sampah Cilimus' })).toHaveAttribute(
      'target',
      '_blank'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Gunakan lokasi saya' }));
    expect(getCurrentPosition).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Mencari bank sampah terdekat...')).toBeInTheDocument();
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

  it('renders a phone fixture as a tel link', async () => {
    renderPage();
    act(() => {
      getCurrentPosition.mock.calls[0][0]({
        coords: { latitude: WASTE_BANKS[0].latitude, longitude: WASTE_BANKS[0].longitude },
      });
    });

    const phoneLink = await screen.findByRole('link', { name: '+62 812-3456-7890' });
    expect(phoneLink).toHaveAttribute('href', 'tel:+62 812-3456-7890');
  });

  it('does not render directions for an invalid-coordinate fixture', async () => {
    renderPage();
    act(() => {
      getCurrentPosition.mock.calls[0][0]({
        coords: { latitude: WASTE_BANKS[0].latitude, longitude: WASTE_BANKS[0].longitude },
      });
    });

    await waitFor(() => {
      expect(screen.getByRole('list', { name: 'Daftar bank sampah' })).toBeInTheDocument();
    });
    expect(screen.queryByText('Bank Sampah Fixture Koordinat Tidak Valid')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', {
        name: 'Lihat rute ke Bank Sampah Fixture Koordinat Tidak Valid',
      })
    ).not.toBeInTheDocument();
  });
});
