export type FlowerType = 'focal' | 'greenery' | 'filler'

export interface Flower {
  id: string
  name: string
  type: FlowerType
  origin?: string
  mood?: string
  meaning?: string
  svgPath: string
}

export const FLOWERS: Flower[] = [
  {
    id: 'gerbera',
    name: 'Gerbera',
    type: 'focal',
    origin: 'South Africa',
    mood: 'Joy',
    meaning: 'Cheerfulness & pure affection',
    svgPath: '/flowers/gerbera.svg',
  },
  {
    id: 'tulip',
    name: 'Tulip',
    type: 'focal',
    origin: 'Netherlands',
    mood: 'Love',
    meaning: 'Perfect love & declaration',
    svgPath: '/flowers/tulip.svg',
  },
  {
    id: 'carnation',
    name: 'Carnation',
    type: 'focal',
    origin: 'Mediterranean',
    mood: 'Gratitude',
    meaning: 'Deep love, distinction & pride',
    svgPath: '/flowers/carnation.svg',
  },
  {
    id: 'matthiola',
    name: 'Matthiola',
    type: 'focal',
    origin: 'Mediterranean',
    mood: 'Calm',
    meaning: 'Lasting beauty & bonds of affection',
    svgPath: '/flowers/matthiola.svg',
  },
  {
    id: 'orchid',
    name: 'Orchid',
    type: 'focal',
    origin: 'Thailand',
    mood: 'Love',
    meaning: 'Rare elegance & refinement',
    svgPath: '/flowers/orchid.svg',
  },
  {
    id: 'anthurium',
    name: 'Anthurium',
    type: 'focal',
    origin: 'Colombia',
    mood: 'Gratitude',
    meaning: 'Abundance & heartfelt hospitality',
    svgPath: '/flowers/anthurium.svg',
  },
  {
    id: 'spider-chrysanthemum',
    name: 'Spider Chrysanthemum',
    type: 'focal',
    origin: 'Japan',
    mood: 'Calm',
    meaning: 'Longevity, joy & loyal devotion',
    svgPath: '/flowers/spider-chrysanthemum.svg',
  },
  {
    id: 'eucalyptus',
    name: 'Eucalyptus',
    type: 'greenery',
    svgPath: '/flowers/eucalyptus.svg',
  },
  {
    id: 'maidenhair-fern',
    name: 'Maidenhair Fern',
    type: 'greenery',
    svgPath: '/flowers/maidenhair-fern.svg',
  },
  {
    id: 'babys-breath',
    name: "Baby's Breath",
    type: 'filler',
    svgPath: '/flowers/babys-breath.svg',
  },
  {
    id: 'wax-flower',
    name: 'Wax Flower',
    type: 'filler',
    svgPath: '/flowers/wax-flower.svg',
  },
]

export const FOCAL_FLOWERS = FLOWERS.filter(f => f.type === 'focal')
export const GREENERY = FLOWERS.filter(f => f.type === 'greenery')
export const FILLERS = FLOWERS.filter(f => f.type === 'filler')
