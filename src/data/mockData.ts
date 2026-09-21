import { Seller, Product, Review, Order } from '../types';

export const initialSellers: Seller[] = [
  {
    id: 'seller-atelier-lumiere',
    name: 'Atelier Lumière',
    slug: 'atelier-lumiere',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA97DrAx9WNGsQlUuyomZC3xccfk4m3Y_hjFUtD0I7ryOmmvezBLyNaX2lbNb4qSI9Q8-tYxYYpR-m0jiDngs75i2FSc1OiFNP5Ppi5NP2xpB9-x2y-rv0WtIhh_9w1gnbQeuZ7bBDEei99b2dgFEA_gilbODKSOBdEUTAuUB8aMrNq3AB5Q0Elr7W1jMmmS7GSvNJ7h_2uqJ4424ChiihiaLisTd06J00XwW-OQQKEYGuT9bCfwtRukw',
    banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpD9fQB_dLv5Et3XnbDhbiDAjtVhtQBB6aEZKy7rw5olKS7vyoQsNlxZwbbylZR7Z5jWbeYz0ywfhwhobKDQDvBxOj6PhBctis_Nk3PCH_BPzbCliOUeOLCAv7yMI0828XrFromiWgU9pDOvYD2GqnuYfgMdv-_DWBdUyZG5zvM3NnEt8iUio2WIDuAuqgDxLoG3ejExbuvRqx46EEi4hqasoQfe6Cnj2HfL-nvfxrap-OPc3hBZIjPg',
    description: 'Céramiques & Luminaires d\'art façonnés à la main dans notre atelier lyonnais.',
    story: 'Directement depuis Lyon · 1 420 commandes satisfaites sans intermédiaire. Chaque création est façonnée au tour et cuite au grand feu.',
    rating: 4.9,
    reviewCount: 318,
    location: 'Lyon, France',
    verified: true,
    salesCount: 1420,
    joinedDate: 'Janvier 2022',
    returnPolicy: 'Retours gratuits sous 30 jours, garantie casse transport incluse.',
    shippingInfo: 'Expédié sous 24h par NovaExpress avec suivi temps réel.',
    contactEmail: 'contact@atelier-lumiere.fr',
    contactPhone: '+33 4 78 22 10 90',
    categories: ['Mobilier Minimaliste', 'Maison & Bureau', 'Artisans Certifiés'],
    badges: ['Focus Artisan du Jour', 'Expédié 24h (99.4%)', 'Artisan Certifié']
  },
  {
    id: 'seller-techzone-pro',
    name: 'TechZone Pro',
    slug: 'techzone-pro',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP4CiLC6C75oJbnCILIVh4lsTu1Z3y9_-10S1UeouKfuqlQ_cMpCkH0m7zlM-qstt-MCzkjUwSaL0jftNGpIQHNm24AJN16UJWcGYRO3vjyi6Q-5Q25OfH7p2DSn_ImJOoiJqrcscjG3f7aqf1CemaLw4BXQxLh4kMSjt07nHUcvR0EgPLUCsrjUVeucMXVL0UGnvS82o6bLwRG8bkHwA1dL1yWS3ff1M__Isv1xkfki_vFcNLBWAK6w',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=400&q=80',
    description: 'Équipements Audio & Ergonomie conçus pour les créateurs exigeants.',
    story: 'Basée à Nantes, l\'équipe TechZone Pro conçoit et assemble des stations de travail modernes et des périphériques audio haute précision.',
    rating: 4.8,
    reviewCount: 540,
    location: 'Nantes, France',
    verified: true,
    salesCount: 3890,
    joinedDate: 'Mars 2021',
    returnPolicy: '30 jours satisfait ou remboursé, garantie 2 ans.',
    shippingInfo: 'Expédition sous 24h ouvrées.',
    contactEmail: 'support@techzonepro.fr',
    contactPhone: '+33 2 40 89 12 40',
    categories: ['Électronique & Audio', 'High-Tech'],
    badges: ['Top Vendeur Tech', 'Expédié 24h (98.9%)']
  },
  {
    id: 'seller-maison-epure',
    name: 'Maison Épure',
    slug: 'maison-epure',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkf9DXET4XKEY5zIjdbfOGm0-fLhu6AI8EY7CX4HRfTyr8a9rDw7ENSwAYG-xjPelE9aBejuQUekdfAelTdDLk_Y-4iDrQrKotQL64jEB3Y4Rz1ZHVVILbwLG4DvOhdhW2uUfPu6ddPcXxe-lE40jxrIFTB2bsgQzzuXYBdRuKovUzpjkHMeV2FDeX0yizYc_NGQKD487I1Q1bAREnojH_0oCZxJ17Liz_Aa3TSA3_LBk8bykjxGjuYQ',
    banner: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&h=400&q=80',
    description: 'Maroquinerie végétale & Soins botaniques issus de procédés éco-responsables.',
    story: 'Atelier de maroquinerie végétale et laboratoire de soins naturels à Bordeaux. Chaque cuir est tanné sans chrome et chaque formule est bio-certifiée.',
    rating: 5.0,
    reviewCount: 290,
    location: 'Bordeaux, France',
    verified: true,
    salesCount: 810,
    joinedDate: 'Avril 2022',
    returnPolicy: 'Retours faciles 30 jours sous emballage d\'origine.',
    shippingInfo: 'Expédition sous 24h (100% à l\'heure).',
    contactEmail: 'bonjour@maison-epure.fr',
    contactPhone: '+33 5 56 70 80 90',
    categories: ['Maroquinerie & Accessoires', 'Beauté Biologique', 'Mode Éthique'],
    badges: ['Fait Main', '100% Expédié 24h', 'Bio Certifié']
  },
  {
    id: 'seller-nordic-sound',
    name: 'Nordic Sound Lab',
    slug: 'nordic-sound-lab',
    logo: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&h=200&q=80',
    banner: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&h=400&q=80',
    description: 'Acoustique scandinave d\'exception et casques haute précision acoustique.',
    story: 'Conception acoustique de référence alliant bois scandinave, aluminium usiné et ingénierie sonore de studio.',
    rating: 4.8,
    reviewCount: 165,
    location: 'Paris, France',
    verified: true,
    salesCount: 1120,
    joinedDate: 'Novembre 2022',
    returnPolicy: 'Essai 30 jours à domicile avec retour offert.',
    shippingInfo: 'Expédié sous 24h.',
    contactEmail: 'contact@nordicsoundlab.com',
    contactPhone: '+33 1 42 68 00 11',
    categories: ['Électronique & Audio'],
    badges: ['Acoustique Pro', 'Certifié NovaTrust']
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-lampe-gres-alba',
    title: 'Lampe Sculpturale Grès Alba',
    description: 'Pièce maîtresse en céramique de grès façonnée à la main. Diffusion lumineuse chaude et tamisée avec variateur tactile en laiton massif. Finition mate minérale texturée.',
    price: 76.50,
    originalPrice: 90.00,
    currency: 'EUR',
    category: 'Mobilier Minimaliste',
    tags: ['Céramique', 'Luminaire', 'Fait Main', 'Grès'],
    sellerId: 'seller-atelier-lumiere',
    sellerName: 'Atelier Lumière',
    rating: 4.9,
    reviewCount: 42,
    stock: 18,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDATDehapHLqZ-s9eVayqbwjiDznqOYPXUCa8x__V6OqfNWrC10xA1cGpjH8r-Y2G7xQUQSRKHrj8XskpLzR29Pk5buDfd4iJTFaLzTGvk58r1vr2zg9KLEubd6pUws3J3K4sD4vjRaXwpAKCGhFLwmyRGM6j2DnRhNKok1uaSSrCiyRUkd58Vt9lXcxxh_HSJ0bOaaLlZOSfe2TjPeCNOKdqf5dKsLerr--APCtyyIItzfDRgPexaGdA'
    ],
    specs: {
      'Matière': 'Grès chamotté naturel cuit à 1280°C',
      'Ampoule': 'LED E27 blanc chaud 2700K incluse',
      'Dimensions': 'H 32cm x D 18cm',
      'Fabrication': 'Façonnée à la main à Lyon'
    },
    featured: true,
    badge: '-15% Soldes',
    shippingFee: 0,
    estimatedDelivery: 'Expédié sous 24h'
  },
  {
    id: 'prod-casque-nova-acoustics',
    title: 'Casque Sans Fil NovaAcoustics',
    description: 'Casque circum-aural haute-fidélité en aluminium brossé et noyer massif. Transducteurs béryllium 45mm avec isolation passive et réduction active du bruit.',
    price: 149.00,
    currency: 'EUR',
    category: 'Électronique & Audio',
    tags: ['Casque', 'Audio', 'Bluetooth', 'Hi-Fi'],
    sellerId: 'seller-nordic-sound',
    sellerName: 'Nordic Sound Lab',
    rating: 4.8,
    reviewCount: 38,
    stock: 3,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDqV3Po3gTFvmNJaCF17gk57GxeEKAVfNxKKuIi9iX66mmQuAzLEdDYxtInjx9t2paJOLRNlc-q_D3pfhaQ7B3-MlYDRPt0n4H_0GXMooubPq5nhP_ZM_rEotGVPzzqwnut4SsZwUv1ndI7Lk9Jqtnv8LQmReo0Ao9k7k8BxOqmFF4hhE0G0ghowlLOYE2one_iEuZiQm0U5HndxKLP8M4Deig5nqB4qGNGrUQP3n5gzedRikhKmbwUqw'
    ],
    specs: {
      'Autonomie': '40 heures en continu',
      'Connectivité': 'Bluetooth 5.3 aptX HD & Jack 3.5mm plaqué or',
      'Poids': '255g'
    },
    featured: true,
    shippingFee: 0,
    estimatedDelivery: 'Expédié sous 24h'
  },
  {
    id: 'prod-housse-mac-cuir',
    title: 'Housse Mac Cuir Végétal 14"',
    description: 'Housse de protection confectionnée en cuir cognac tanné au végétal sans sels de chrome. Doublure intérieure en feutre de laine mérinos naturelle anti-rayures.',
    price: 64.00,
    currency: 'EUR',
    category: 'Maroquinerie & Accessoires',
    tags: ['Cuir', 'MacBook', 'Fait Main', 'Accessoire'],
    sellerId: 'seller-maison-epure',
    sellerName: 'Maison Épure',
    rating: 5.0,
    reviewCount: 56,
    stock: 12,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvB4UuMDDmbx1ojpiczmmg37GQDazzM2PkCbi86IBXw7dDM_AjfHkkdfWozHBsta4ljfcrNfkgmrOckt5c8sOmRh9o_3eNiZKXbdKUoTs7k17JfOVIv0eZsxRo_UBYnEFGCWopVnNht-r59LYSmDHlBFw6aG5aOoOerXJD41VJERDWsNZyyMtoz6AV9B2limZLQqtwo5dN6K20ViQefGQ-eIm4_8PnRYl4DXg43owttMUacOF49QwKtg'
    ],
    specs: {
      'Compatibilité': 'MacBook Pro 14", MacBook Air 13" / 13.6"',
      'Matière': 'Cuir pleine fleur tannage végétal',
      'Fabrication': 'Artisanale à Bordeaux'
    },
    badge: 'Fait Main',
    shippingFee: 0,
    estimatedDelivery: 'Expédié sous 24h'
  },
  {
    id: 'prod-clavier-meca-75',
    title: 'Clavier Mécanique Sans Fil 75%',
    description: 'Clavier mécanique compact en châssis aluminium anodisé noir mat. Switches pré-lubrifiés, rétroéclairage subtil et connectivité triple mode (2.4Ghz, BT 5.1, USB-C).',
    price: 119.90,
    currency: 'EUR',
    category: 'Électronique & Audio',
    tags: ['Clavier', 'Hardware', 'Sans fil', 'Tech'],
    sellerId: 'seller-techzone-pro',
    sellerName: 'TechZone Pro',
    rating: 4.7,
    reviewCount: 89,
    stock: 14,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC2F1M8IRPaWAVGZQciAIKuYEm3RBGnme4BCGxmmSNfCj-WVMDuOGb0MEQPsC3d6eIkkdnDdgB6t9uJoptbz5vSx-cMEGL0w6BV5hJsebGd9jaXXdCdXk0k84jk9Er6HGPQdF6dNaGCBm6DLVJ8D-n6PLvFNUYHofUzkoq5pBXuUJ4_Lod9JBvh6oDmG9WInooRc5OCCqpdx6vz9TW_JIhIFpEW4eLFUvNryOq6S0UanHmG9bvvaEylNQ'
    ],
    specs: {
      'Format': '75% (82 touches)',
      'Switches': 'Gateron Pro Yellow lubrifiés',
      'Batterie': '4000 mAh (jusqu\'à 200h)'
    },
    shippingFee: 0,
    estimatedDelivery: 'Expédié sous 24h'
  },
  {
    id: 'prod-serum-botanique',
    title: 'Sérum Botanique Éclat 50ml',
    description: 'Concentré végétal aux huiles précieuses de rose musquée, squalane et vitamine C d\'origine naturelle. Flacon verre ambré avec pipette doseuse de précision.',
    price: 38.00,
    currency: 'EUR',
    category: 'Beauté Biologique',
    tags: ['Bio', 'Sérum', 'Cosmétique', 'Naturel'],
    sellerId: 'seller-maison-epure',
    sellerName: 'Maison Épure',
    rating: 4.9,
    reviewCount: 64,
    stock: 22,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyG1OkwE8Uvddw-si-nARyreFc2rMypfebq9-7aGMJ8p0y1YY4Zg65Sl5FE1mkOd9E0JUAdIQB8iXqJenv39uh8tngigtHY1jiFNem_vovJn9xT1iI9IWdBCY_5BNRklJecVsREBhhkYo-RwXxnas01i1qWhq-X89yGKOxttSK3kDwxgR6plYj5i3NYhxa0nnKOgjsCA-hljbnsLUHYUoWmaLZbaOOtyAiZkTOtxchAuLFZYXBkGB1_w'
    ],
    specs: {
      'Volume': '50ml',
      'Certification': 'Cosmos Organic & Cruelty Free',
      'Ingrédients': '100% d\'origine naturelle, 98% bio'
    },
    badge: 'Bio Certifié',
    shippingFee: 0,
    estimatedDelivery: 'Expédié sous 24h'
  },
  {
    id: 'prod-plaid-lin-pur',
    title: 'Plaid en Lin Pur Tissé Main',
    description: 'Plaid lourd en lin normand lavé, tissé sur métier traditionnel. Teinture végétale aux nuances minérales ardoise, douceur exceptionnelle et thermorégulation naturelle.',
    price: 89.00,
    currency: 'EUR',
    category: 'Mode Éthique',
    tags: ['Lin', 'Maison', 'Fait Main', 'Textile'],
    sellerId: 'seller-atelier-lumiere',
    sellerName: 'Atelier Lumière',
    rating: 4.9,
    reviewCount: 27,
    stock: 2,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCJE7vU09iW_7NxasWyS2etVsWeCH2Ogym4XuCqEWpLQ-XovEtVSyW9-6is6C9Um-RgGZ_mQOKxsCUrIE1AiyyJPIQPiDcAf7Imy2y8ggTCW0AjGe9nJVvV2pxmn0OuyTZDhTXIBbCWcf5IyAaDcxyWfIWHV0cSilAskG-UffYTN1h49TQeMON_343Cz4gHTJUVI3fMNynMiyS13AOOVw3oNt900ct6eTBCwkVskdpE4JJKa-zfjq8ylw'
    ],
    specs: {
      'Dimensions': '140 x 200 cm',
      'Composition': '100% pur lin lavé 380g/m²',
      'Entretien': 'Lavable en machine à 40°C'
    },
    shippingFee: 0,
    estimatedDelivery: 'Expédié sous 24h'
  },
  {
    id: 'prod-station-induction',
    title: 'Station Induction Trio Magnétique',
    description: 'Chargeur 3-en-1 en aluminium usiné CNC pour smartphone, écouteurs et montre connectée. Câble tissé renforcé et régulation thermique avancée.',
    price: 52.00,
    originalPrice: 65.00,
    currency: 'EUR',
    category: 'Électronique & Audio',
    tags: ['Chargeur', 'Induction', 'Tech', 'Desk'],
    sellerId: 'seller-techzone-pro',
    sellerName: 'TechZone Pro',
    rating: 4.6,
    reviewCount: 72,
    stock: 19,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2hUkx_mci0Pcf3rcJ_9P0XaMJWya89TDlIK3oPOW9smEQMAql7G5fPtsB3D1eur3utmPmNQSZECXRaz4V7pzAQne5HX_y1_Qt9OFX9PwkvPe8aYatTaGQ3-m1mDZn90VHNwa_Ls5v9PmGarxuVDHaUqu2P_bTzrfREZKBgNaCelLUdVf7wMx1HFqUJmvlVmcZxIpF7Y07hIQutceIeLMaAqWZzy72m4cFsYmh_LLUYe9PMltrniMa8w'
    ],
    specs: {
      'Puissance': '15W rapide MagSafe compatible + 5W Watch + 5W Buds',
      'Matériau': 'Aluminium anodisé aérospatial'
    },
    badge: '-20% Offre',
    shippingFee: 0,
    estimatedDelivery: 'Expédié sous 24h'
  },
  {
    id: 'prod-duo-tasses-gres',
    title: 'Duo Tasses Artisanales Mouchetées',
    description: 'Paire de tasses à café et cappuccino en terre cuite claire mouchetée de pyrites naturelles. Émaillage intérieur satiné lavable au lave-vaisselle.',
    price: 34.00,
    currency: 'EUR',
    category: 'Mobilier Minimaliste',
    tags: ['Tasses', 'Céramique', 'Artisanat', 'Café'],
    sellerId: 'seller-atelier-lumiere',
    sellerName: 'Atelier Lumière',
    rating: 4.9,
    reviewCount: 31,
    stock: 8,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBfphTE8h8NR1i7YJ7e49fIareHPJ-Z66RPrTCFlzhRsiXYWa4XcZLngWSPmouPbgEjEI4RboslFHQzc6HBpqNTbdsrrl_1IqYpegz6Hd4wKGX272HPVCKw0aAiPwGm0X7bDKUiZ8Pzc4yDijMCOh_oK8tt_m24StCdc_UIXLbRUa3amFD2ifo71n10ICkBYfLx8nEH3Pq7jVztM6q08McqEBap8lKaz5X9MSdePaKNOUESgTBZvewhmg'
    ],
    specs: {
      'Contenance': '220 ml chacune',
      'Matière': 'Grès blanc moucheté',
      'Usage': 'Micro-ondes et lave-vaisselle compatibles'
    },
    shippingFee: 0,
    estimatedDelivery: 'Expédié sous 24h'
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-lampe-gres-alba',
    userName: 'Claire Dupont',
    rating: 5,
    date: '14 février 2024',
    comment: 'Une pièce magnifique ! L\'effet de la lumière à travers la terre cuite est doux et sculptural.',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'prod-casque-nova-acoustics',
    userName: 'Julien M.',
    rating: 5,
    date: '28 janvier 2024',
    comment: 'Qualité de son incroyable pour un prix aussi mesuré. L\'assemblage en bois et métal est très noble.',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'prod-housse-mac-cuir',
    userName: 'Antoine L.',
    rating: 5,
    date: '3 février 2024',
    comment: 'Le cuir a déjà pris une patine superbe après quelques semaines. Ajustement au millimètre pour mon Mac 14".',
    verifiedPurchase: true
  }
];

export const sampleOrders: Order[] = [
  {
    id: 'ORD-2024-8841',
    date: '15 Février 2024',
    items: [
      {
        product: initialProducts[0],
        quantity: 1
      },
      {
        product: initialProducts[2],
        quantity: 1
      },
      {
        product: initialProducts[4],
        quantity: 1
      }
    ],
    totalAmount: 189.90,
    shippingAddress: {
      fullName: 'Sophie Martin',
      email: 'sophie.martin@example.fr',
      phone: '+33 6 12 34 56 78',
      address: '24 Rue des Créateurs',
      city: 'Paris',
      postalCode: '75011',
      country: 'France'
    },
    paymentMethod: 'Carte Bancaire (Chiffré SSL 256-bit)',
    packages: [
      {
        sellerId: 'seller-atelier-lumiere',
        sellerName: 'Atelier Lumière',
        items: [{ product: initialProducts[0], quantity: 1 }],
        subtotal: 76.50,
        shippingFee: 0,
        status: 'En préparation',
        trackingNumber: 'NE-FR-8492048'
      },
      {
        sellerId: 'seller-maison-epure',
        sellerName: 'Maison Épure',
        items: [
          { product: initialProducts[2], quantity: 1 },
          { product: initialProducts[4], quantity: 1 }
        ],
        subtotal: 102.00,
        shippingFee: 0,
        status: 'Expédiée',
        trackingNumber: 'NE-FR-9102834'
      }
    ],
    overallStatus: 'En préparation'
  }
];

export const initialMessages = [
  {
    id: 'msg-1',
    sellerId: 'seller-atelier-lumiere',
    sender: 'buyer' as const,
    text: 'Bonjour, la lampe Grès Alba est-elle compatible avec un variateur mural ?',
    timestamp: 'Hier à 14:20',
    productId: 'prod-lampe-gres-alba',
    productTitle: 'Lampe Sculpturale Grès Alba'
  },
  {
    id: 'msg-2',
    sellerId: 'seller-atelier-lumiere',
    sender: 'seller' as const,
    text: 'Bonjour ! Oui tout à fait, l\'ampoule LED fournie est compatible variateur coupure de phase.',
    timestamp: 'Hier à 14:35',
    productId: 'prod-lampe-gres-alba',
    productTitle: 'Lampe Sculpturale Grès Alba'
  }
];
