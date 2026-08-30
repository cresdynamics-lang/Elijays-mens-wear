export const DELIVERY_ZONES = [
  {
    id: 'zone_e',
    zone: 'Nairobi Zone E',
    areas: 'Riara rd, Ngong rd, Kilimani, Valley Arcade',
    fee: 200,
  },
  {
    id: 'zone_d',
    zone: 'Nairobi Zone D',
    areas: 'Lavington, Westlands, Upperhill, Naivasha Rd, Kileleshwa, Madaraka, Nairobi West, CBD',
    fee: 300,
  },
  {
    id: 'zone_c',
    zone: 'Nairobi Zone C',
    areas: 'Karen, Parklands, Spring Valley, Lower Kabete, Uthiru, Kangemi, Langata, South B & C',
    fee: 450,
  },
  {
    id: 'parcel',
    zone: 'Parcel (Outside Nairobi)',
    areas: 'Parcel / courier delivery anywhere in Kenya',
    fee: 500,
  },
  {
    id: 'zone_b',
    zone: 'Nairobi Zone B',
    areas: 'Dagoretti, Ruaka, Kitusuru, Runda, Ngong, Roysambu, Kasarani, Kiambu rd, Kahawa, Kinoo',
    fee: 600,
  },
  {
    id: 'zone_a',
    zone: 'Nairobi Zone A',
    areas: 'Ruiru, Syokimau, Juja, Kitengela, Embakasi, Utawala and environs',
    fee: 1000,
  },
];

export const getDeliveryZone = (id) => DELIVERY_ZONES.find((z) => z.id === id) || null;

export const deliveryFeeFor = (id) => (getDeliveryZone(id)?.fee ?? 0);