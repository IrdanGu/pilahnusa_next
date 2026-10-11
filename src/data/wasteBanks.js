const deepFreeze = (value) => {
  Object.freeze(value);
  Object.values(value).forEach((nestedValue) => {
    if (nestedValue && typeof nestedValue === 'object' && !Object.isFrozen(nestedValue)) {
      deepFreeze(nestedValue);
    }
  });
  return value;
};

export const WASTE_BANKS = deepFreeze([
  {
    "id": "bank-sampah-cilimus-caracas",
    "name": "Bank Sampah Cilimus",
    "address": "Caracas, Cilimus",
    "latitude": -6.8597001,
    "longitude": 108.4927172,
    "operatingStatus": "Tutup",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.009
  },
  {
    "id": "bank-sampah-kuningan-cigadung",
    "name": "Bank Sampah Kuningan",
    "address": "Cigadung, Kuningan",
    "latitude": -6.9829944,
    "longitude": 108.4631788,
    "operatingStatus": "Status tidak tersedia",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.029
  },
  {
    "id": "bank-sampah-kadugede-kadugede",
    "name": "Bank Sampah Kadugede",
    "address": "Kadugede, Kadugede",
    "latitude": -7.0048522,
    "longitude": 108.4480426,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.029
  },
  {
    "id": "bank-sampah-luragung-luragung",
    "name": "Bank Sampah Luragung",
    "address": "Luragung, Luragung",
    "latitude": -7.0142466,
    "longitude": 108.6179757,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.007
  },
  {
    "id": "bank-sampah-cibingbin-sukamaju",
    "name": "Bank Sampah Cibingbin",
    "address": "Sukamaju, Cibingbin",
    "latitude": -7.0526768,
    "longitude": 108.7426537,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah"
  },
  {
    "id": "bank-sampah-kuningan-sudirman",
    "name": "Bank Sampah Kuningan",
    "address": "Sudirman, Kuningan",
    "latitude": -6.9855324,
    "longitude": 108.4857728,
    "operatingStatus": "Tutup",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah"
  },
  {
    "id": "bank-sampah-nusaherang-haurkuning",
    "name": "Bank Sampah Nusaherang",
    "address": "Haurkuning, Nusaherang",
    "latitude": -7.0276315,
    "longitude": 108.3927864,
    "operatingStatus": "Tutup",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.146857142857143
  },
  {
    "id": "bank-sampah-sindangagung-kertayasa",
    "name": "Bank Sampah Sindangagung",
    "address": "Kertayasa, Sindangagung",
    "latitude": -7.0274108,
    "longitude": 108.3309832,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.036
  },
  {
    "id": "bank-sampah-nusaherang-windusari",
    "name": "Bank Sampah Nusaherang",
    "address": "Windusari, Nusaherang",
    "latitude": -7.0197104,
    "longitude": 108.4400771,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.09
  },
  {
    "id": "bank-sampah-japara-dukuh-dalem",
    "name": "Bank Sampah Japara",
    "address": "Dukuh Dalem, Japara",
    "latitude": -6.9221975,
    "longitude": 108.4774693,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.214
  },
  {
    "id": "bank-sampah-ciniru-cisalak-cipedes",
    "name": "Bank Sampah Ciniru",
    "address": "Cisalak Cipedes, Ciniru",
    "latitude": -7.0645545,
    "longitude": 108.5106452,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.009
  },
  {
    "id": "bank-sampah-cigugur-winduherang",
    "name": "Bank Sampah Cigugur",
    "address": "Winduherang, Cigugur",
    "latitude": -6.9658183,
    "longitude": 108.4569795,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.045
  },
  {
    "id": "bank-sampah-ciawigebang-ciomas",
    "name": "Bank Sampah Ciawigebang",
    "address": "Ciomas, Ciawigebang",
    "latitude": -6.9752118,
    "longitude": 108.5580161,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.003
  },
  {
    "id": "bank-sampah-kuningan-kuningan-1",
    "name": "Bank Sampah Kuningan",
    "address": "Kuningan, Kuningan",
    "latitude": -6.9840517,
    "longitude": 108.4802512,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.025
  },
  {
    "id": "bank-sampah-sindangagung-kertaungaran",
    "name": "Bank Sampah Sindangagung",
    "address": "Kertaungaran, Sindangagung",
    "latitude": -6.9793829,
    "longitude": 108.5265641,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.031
  },
  {
    "id": "bank-sampah-darma-tugumulya",
    "name": "Bank Sampah Darma",
    "address": "Tugumulya, Darma",
    "latitude": -7.0646276,
    "longitude": 108.3952698,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.114
  },
  {
    "id": "bank-sampah-kuningan-kuningan-2",
    "name": "Bank Sampah Kuningan",
    "address": "Kuningan, Kuningan",
    "latitude": -6.9173571,
    "longitude": 108.4919328,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah",
    "capacityTonsPerDay": 0.143
  },
  {
    "id": "bank-sampah-ciniru-gunungmanik",
    "name": "Bank Sampah Ciniru",
    "address": "Gunungmanik, Ciniru",
    "latitude": -7.0877412,
    "longitude": 108.4975964,
    "operatingStatus": "Buka",
    "operatingHours": "Jam operasional tidak tersedia",
    "acceptedMaterials": [
      "Material yang diterima belum dicantumkan"
    ],
    "facilityType": "Bank Sampah"
  }
]);
