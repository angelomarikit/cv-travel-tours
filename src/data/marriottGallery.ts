export interface MarriottGalleryImage {
  src: string
  title: string
  category: string
}

const base = '/marriott-bali-nusa-dua'

export const marriottHeroImages = [
  `${base}/hotel-view/dpsmv-exterior-5844_classic-hor.jpg`,
  `${base}/recreation-and-fitness/dpsmv-pool-0009-hor-clsc.webp`,
  `${base}/villas/dpsmv-apartment-0017-hor-clsc.webp`,
  `${base}/nearby-attraction/dpsmv-nusadua-beach-5850-hor-clsc.avif`,
]

export const marriottGallery: MarriottGalleryImage[] = [
  { src: `${base}/hotel-view/dpsmv-entrance-5833-hor-clsc.avif`, title: 'Resort entrance', category: 'Hotel' },
  { src: `${base}/hotel-view/dpsmv-exterior-5844_classic-hor.jpg`, title: 'Resort exterior', category: 'Hotel' },
  { src: `${base}/hotel-view/dpsmv-lobby-5835-hor-clsc.avif`, title: 'Lobby', category: 'Hotel' },
  { src: `${base}/hotel-view/dpsmv-lobby-5836-hor-clsc.avif`, title: 'Lobby seating', category: 'Hotel' },
  { src: `${base}/guest-room/dpsmv-apartment-0019-hor-clsc.avif`, title: 'Apartment bedroom', category: 'Rooms & Villas' },
  { src: `${base}/guest-room/dpsmv-guestroom-0015-hor-clsc.webp`, title: 'King guest room', category: 'Rooms & Villas' },
  { src: `${base}/villas/dpsmv-apartment-0017-hor-clsc.webp`, title: 'Apartment master bedroom', category: 'Rooms & Villas' },
  { src: `${base}/villas/dpsmv-apartment-0018-hor-clsc.webp`, title: 'Twin bedroom', category: 'Rooms & Villas' },
  { src: `${base}/villas/dpsmv-apartment-0019-hor-clsc-2.avif`, title: 'Apartment living area', category: 'Rooms & Villas' },
  { src: `${base}/villas/dpsmv-apartment-0020-hor-clsc.webp`, title: 'Apartment kitchenette', category: 'Rooms & Villas' },
  { src: `${base}/villas/dpsmv-apartment-0037-hor-clsc.avif`, title: 'Spacious living area', category: 'Rooms & Villas' },
  { src: `${base}/villas/dpsmv-bathroom-0022-hor-clsc.avif`, title: 'Apartment bathroom', category: 'Rooms & Villas' },
  { src: `${base}/dining/dpsmv-marketplace-express-5839-hor-clsc.avif`, title: 'MoMo 2 Go', category: 'Dining' },
  { src: `${base}/dining/dpsmv-momo-0025-hor-clsc.avif`, title: 'MoMo Café', category: 'Dining' },
  { src: `${base}/dining/dpsmv-momo-0026-hor-clsc.avif`, title: 'MoMo Café terrace', category: 'Dining' },
  { src: `${base}/dining/dpsmv-pool-0008-hor-clsc.webp`, title: 'Pool terrace', category: 'Dining' },
  { src: `${base}/dining/dpsmv-pool-0028-hor-clsc.webp`, title: 'Swim-up bar', category: 'Dining' },
  { src: `${base}/dining/dpsmv-poolbar-5846-hor-clsc.webp`, title: 'Pool bar', category: 'Dining' },
  { src: `${base}/dining/dpsmv-poolbar-5847-hor-clsc.avif`, title: 'Dapur Santai', category: 'Dining' },
  { src: `${base}/dining/dpsmv-poolbar-grill-5855-hor-clsc.webp`, title: 'Pool Bar & Grill', category: 'Dining' },
  { src: `${base}/recreation-and-fitness/dpsmv-pool-0009-hor-clsc.webp`, title: 'West Pool', category: 'Recreation' },
  { src: `${base}/recreation-and-fitness/dpsmv-westpool-spa-5842-hor-clsc.avif`, title: 'West Pool whirlpool', category: 'Recreation' },
  { src: `${base}/recreation-and-fitness/dpsmv-whirlpool-spa-5845-hor-clsc.webp`, title: 'Whirlpool aerial view', category: 'Recreation' },
  { src: `${base}/recreation-and-fitness/dpsmv-fitness-center-5834-hor-clsc.avif`, title: 'Fitness center', category: 'Recreation' },
  { src: `${base}/activities/dpsmv-bamboo-activitycenter-5830-hor-clsc.webp`, title: 'Bamboo Activity Center', category: 'Activities' },
  { src: `${base}/activities/dpsmv-bamboo-activitycentre-5851-hor-clsc.webp`, title: 'Bamboo greenhouse', category: 'Activities' },
  { src: `${base}/activities/dpsmv-kids-0035-hor-clsc.webp`, title: 'Kids Club', category: 'Activities' },
  { src: `${base}/activities/dpsmv-yoga-pavilion-5831-hor-clsc.avif`, title: 'Yoga pavilion', category: 'Activities' },
  { src: `${base}/spa/dpsmv-spa-reception-5856-hor-clsc.avif`, title: 'Courtyard Spa reception', category: 'Spa & Beach' },
  { src: `${base}/spa/dpsmv-spa-treatmentroom-5849-hor-clsc.avif`, title: 'Spa treatment room', category: 'Spa & Beach' },
  { src: `${base}/nearby-attraction/dpsmv-nusadua-beach-5850-hor-clsc.avif`, title: 'Nusa Dua Beach', category: 'Spa & Beach' },
]

export const marriottCategories = [
  'Hotel',
  ...new Set(marriottGallery.map((image) => image.category).filter((item) => item !== 'Hotel')),
]
