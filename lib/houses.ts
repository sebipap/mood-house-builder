export interface House {
  id: string;
  type: string;
  size: string;
  total_area_m2: number;
  rooms: string[];
  image_url: string;
}

export interface TinyModule {
  id: string;
  type: string;
  size: string;
  total_area_m2: number;
  rooms: string[];
  image_url: string;
}

export const houses: House[] = [
  {

    "type": "articulated",
    "size": "XS",
    "total_area_m2": 76,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "social area with integrated kitchen"
    ],
    "image_url": "XS_-_A.jpg",
    "id": "xsa"
  },
  {
    "type": "articulated",
    "size": "S",
    "total_area_m2": 84,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "social area with integrated kitchen"
    ],
    "image_url": "S_-_A.jpg",
    "id": "sa"
  },
  {
    "type": "articulated",
    "size": "M",
    "total_area_m2": 116,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "1 en suite bedroom",
      "social area with integrated kitchen",
      "laundry"
    ],
    "image_url": "M_-_A.jpg",
    "id": "ma"
  },
  {
    "type": "articulated",
    "size": "L",
    "total_area_m2": 159,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "1 en suite bedroom with walk-in closet",
      "social area with integrated kitchen",
      "laundry and storage"
    ],
    "image_url": "L_-_A.jpg",
    "id": "la"
  },
  {
    "type": "articulated",
    "size": "XL",
    "total_area_m2": 250,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "2 en suite bedrooms",
      "social area with integrated kitchen",
      "toilet",
      "laundry and storage"
    ],
    "image_url": "XL_-_A.jpg",
    "id": "xla"
  },
  {
    "type": "linear",
    "size": "XS",
    "total_area_m2": 65,
    "rooms": [
      "1 bedroom + 1 bathroom",
      "social area with integrated kitchen"
    ],
    "image_url": "XS_-_L.jpg",
    "id": "xsl"
  },
  {
    "type": "linear",
    "size": "S",
    "total_area_m2": 84,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "social area with integrated kitchen"
    ],
    "image_url": "S_-_L.jpg",
    "id": "sl"
  },
  {
    "type": "linear",
    "size": "M",
    "total_area_m2": 120,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "1 en suite bedroom",
      "social area with integrated kitchen",
      "laundry"
    ],
    "image_url": "M_-_L.jpg",
    "id": "ml"
  },
  {
    "type": "linear",
    "size": "L",
    "total_area_m2": 135,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "1 en suite bedroom",
      "social area with integrated kitchen",
      "laundry"
    ],
    "image_url": "L_-_L.jpg",
    "id": "ll"
  },
  {
    "type": "linear",
    "size": "XL",
    "total_area_m2": 235,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "2 en suite bedrooms",
      "social area with integrated kitchen",
      "toilet",
      "laundry and storage"
    ],
    "image_url": "XL_-_L.jpg",
    "id": "xll"
  },
  {
    "type": "parallel",
    "size": "XS",
    "total_area_m2": 69,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "social area with integrated kitchen"
    ],
    "image_url": "XS_-_P.jpg",
    "id": "xsp"
  },
  {
    "type": "parallel",
    "size": "S",
    "total_area_m2": 89,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "social area with integrated kitchen"
    ],
    "image_url": "S_-_P.jpg",
    "id": "sp"
  },
  {
    "type": "parallel",
    "size": "M",
    "total_area_m2": 129,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "1 en suite bedroom",
      "social area with integrated kitchen",
      "laundry and storage"
    ],
    "image_url": "M_-_P.jpg",
    "id": "mp"
  },
  {
    "type": "parallel",
    "size": "L",
    "total_area_m2": 164,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "1 en suite bedroom with walk-in closet",
      "social area with integrated kitchen",
      "laundry and storage"
    ],
    "image_url": "L_-_P.jpg",
    "id": "lp"
  },
  {
    "type": "parallel",
    "size": "XL",
    "total_area_m2": 229,
    "rooms": [
      "2 bedrooms + 1 bathroom",
      "1 en suite bedroom",
      "social area with integrated kitchen"
    ],
    "image_url": "XL_-_P.jpg",
    "id": "xlp"
  }
];

export const tinyModules: TinyModule[] = [
  {
    "type": "tiny",
    "size": "30m2",
    "total_area_m2": 30,
    "rooms": [
      "studio with bathroom"
    ],
    "image_url": "TINY_-_EST.jpg",
    "id": "tinyepg"
  },
  {
    "type": "tiny",
    "size": "38m2",
    "total_area_m2": 38,
    "rooms": [
      "open space (studio apartment)"
    ],
    "image_url": "TINY_-_ES.jpg",
    "id": "tinyeg"
  },
  {
    "type": "linear tiny",
    "size": "40m2",
    "total_area_m2": 40,
    "rooms": [
      "office with 8 workstations",
      "bathroom"
    ],
    "image_url": "TINY_-_OF.jpg",
    "id": "tinyog"
  },
  {
    "type": "tiny",
    "size": "45m2",
    "total_area_m2": 45,
    "rooms": [
      "1 bedroom + 1 bathroom",
      "social area with integrated kitchen"
    ],
    "image_url": "TINY_-_1_DOR.jpg",
    "id": "tiny1.jpg"
  }
];

export function getBedrooms(rooms: string[]): number {
  for (const room of rooms) {
    const match = room.match(/(\d+)\s+bedroom/);
    if (match) {
      return parseInt(match[1]);
    }
    if (room.includes('studio')) {
      return 0;
    }
  }
  return 0;
}

export function filterHousesByBedrooms(targetBedrooms: number): House[] {
  return houses.filter(house => getBedrooms(house.rooms) === targetBedrooms);
}