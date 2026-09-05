import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, SyntheticEvent } from 'react'
import {
  BarChart3,
  Copy,
  Crown,
  Database,
  ExternalLink,
  LoaderCircle,
  RotateCcw,
  Settings2,
  Sparkles,
  Target,
  Ticket,
  WandSparkles,
} from 'lucide-react'
import './App.css'
import { sourcedCharacterBanners, sourcedWeaponBanners } from './genshinHistory'
import { starRailCharacterRecords, starRailWeaponRecords } from './starRailHistory'
import { starRailCharacterImages, starRailRewardImages } from './starRailAssets'

type BannerRules = {
  id: string
  game: string
  banner: string
  bannerKind: 'character' | 'weapon'
  featuredName: string
  offBannerName: string
  featuredPool: string[]
  offBannerPool: string[]
  fourStarPool: string[]
  threeStarPool: string[]
  imageUrl: string
  bannerVersion?: string
  baseFiveRate: number
  softPityStart: number
  hardPity: number
  baseFourRate: number
  hardFourPity: number
  guaranteeRate: number
  hasGuarantee: boolean
  currencyName: string
  pullCost: number
  accent: string
  sourceName: string
  sourceUrl: string
}

type BannerChoice = {
  id: string
  name: string
  featuredName: string
  imageUrl: string
  version: string
  phase?: number
  featuredFourStars: string[]
  featuredNames?: string[]
  imageUrls?: string[]
}

type GenshinDbCharacter = {
  name?: string
  rarity?: number | string
  version?: string
  images?: {
    hoyowiki_icon?: string
    icon?: string
  }
}

const defaultCharacterAsset = '/summon-prism.svg'
const brandLogoAsset = '/gacha-logo.png'
const genshinPrimogemAsset = '/genshin-primogem.png'
const currencyAssetByPreset: Record<string, string> = {
  'genshin-character': genshinPrimogemAsset,
  'star-rail-character': '/star-rail-stellar-jade.png',
  'zenless-signal': '/zenless-polychrome.svg',
  'wuwa-convene': '/wuthering-waves-astrite.svg',
}
const genshinCharacterFourStarFallback = ['Xiangling', 'Barbara', 'Noelle', 'Fischl', 'Sucrose']
const genshinWeaponFourStarFallback = ['Favonius Sword', 'The Stringless', 'Dragon\'s Bane', 'The Bell', 'Sacrificial Bow']
const genshinStandardWeaponPool = ['Aquila Favonia', 'Skyward Blade', 'Skyward Pride', 'Skyward Harp', 'Skyward Atlas', 'Lost Prayer to the Sacred Winds', 'Amos\' Bow', 'Wolf\'s Gravestone']
const genshinWeaponThreeStarPool = ['Cool Steel', 'Raven Bow', 'White Iron Greatsword', 'Black Tassel', 'Magic Guide']
const starRailStandardLightConePool = ['Night on the Milky Way', 'In the Name of the World', 'Moment of Victory', 'Something Irreplaceable', 'But the Battle Isn\'t Over', 'Time Waits for No One', 'Sleep Like the Dead']
const starRailFourStarLightConePool = ['Good Night and Sleep Well', 'Memories of the Past', 'The Moles Welcome You', 'A Secret Vow', 'Dance! Dance! Dance!', 'Resolution Shines As Pearls of Sweat']
const starRailThreeStarPool = ['Arrows', 'Cornucopia', 'Collapsing Sky', 'Void', 'Chorus', 'Data Bank', 'Darting Arrow', 'Defense', 'Fine Fruit', 'Hidden Shadow', 'Lingering Tear', 'Loop', 'Mediation', 'Meshing Cogs', 'Multiplication', 'Mutual Demise', 'Passkey', 'Pioneering', 'Reminiscence', 'Sagacity', 'Shadowburn', 'Shattered Home', 'Sneering']
const starRailFourStarCharacterPool = ['March 7th', 'Dan Heng', 'Asta', 'Arlan', 'Herta', 'Hook', 'Natasha', 'Pela', 'Sampo', 'Serval', 'Sushang', 'Tingyun', 'Qingque', 'Luka', 'Lynx', 'Guinaifen', 'Misha', 'Xueyi', 'Gallagher', 'Moze', 'Yukong', 'Hanya']

type PullResult = {
  id: string
  number: number
  rarity: 3 | 4 | 5
  name: string
  featured: boolean
  pityAt: number
  chance: number
  guaranteed: boolean
  imageUrl: string
}

type Totals = {
  pulls: number
  fiveStars: number
  fourStars: number
  featured: number
  lostRateUps: number
  longestDry: number
  spent: number
}

type NumericRuleKey =
  | 'baseFiveRate'
  | 'softPityStart'
  | 'hardPity'
  | 'baseFourRate'
  | 'hardFourPity'
  | 'guaranteeRate'
  | 'pullCost'

const presets: BannerRules[] = [
  {
    id: 'genshin-character',
    game: 'Genshin Impact',
    banner: 'Character Event Wish',
    bannerKind: 'character',
    featuredName: 'Featured 5-star character',
    offBannerName: 'Standard 5-star character',
    featuredPool: ['Nahida', 'Furina', 'Yelan', 'Kazuha'],
    offBannerPool: ['Jean', 'Diluc', 'Mona', 'Keqing', 'Tighnari', 'Dehya', 'Qiqi'],
    fourStarPool: ['Xingqiu', 'Fischl', 'Bennett', 'Sucrose', 'Diona', 'Rosaria', 'Beidou'],
    threeStarPool: ["Traveler's Handy Sword", 'Slingshot', 'Magic Guide', "Sharpshooter's Oath", 'Black Tassel'],
    imageUrl: defaultCharacterAsset,
    baseFiveRate: 0.6,
    softPityStart: 74,
    hardPity: 90,
    baseFourRate: 5.1,
    hardFourPity: 10,
    guaranteeRate: 50,
    hasGuarantee: true,
    currencyName: 'Primogem',
    pullCost: 160,
    accent: '#2f80ed',
    sourceName: 'BannerHistory + genshin-db',
    sourceUrl: 'https://bannerhistory.app/en/genshin-banners',
  },
  {
    id: 'star-rail-character',
    game: 'Honkai: Star Rail',
    banner: 'Character Event Warp',
    bannerKind: 'character',
    featuredName: 'Limited 5-star character',
    offBannerName: 'Standard 5-star character',
    featuredPool: ['Acheron', 'Kafka', 'Firefly', 'Jingliu'],
    offBannerPool: ['Himeko', 'Bailu', 'Bronya', 'Welt', 'Yanqing', 'Clara', 'Gepard'],
    fourStarPool: ['March 7th', 'Dan Heng', 'Asta', 'Pela', 'Sampo', 'Tingyun', 'Xueyi'],
    threeStarPool: ['Generic light cone', 'Stellar scrap', 'Trailblazer salvage', 'Calibration unit'],
    imageUrl: defaultCharacterAsset,
    baseFiveRate: 0.6,
    softPityStart: 74,
    hardPity: 90,
    baseFourRate: 5.1,
    hardFourPity: 10,
    guaranteeRate: 50,
    hasGuarantee: true,
    currencyName: 'Stellar Jade',
    pullCost: 160,
    accent: '#c8553d',
    sourceName: 'StarRailRes',
    sourceUrl: 'https://github.com/Mar-7th/StarRailRes',
  },
  {
    id: 'zenless-signal',
    game: 'Zenless Zone Zero',
    banner: 'Exclusive Channel',
    bannerKind: 'character',
    featuredName: 'Exclusive S-rank agent',
    offBannerName: 'Standard S-rank agent',
    featuredPool: ['Ellen', 'Zhu Yuan', 'Jane Doe', 'Yanagi'],
    offBannerPool: ['Soldier 11', 'Rina', 'Koleda', 'Lycaon', 'Grace', 'Nekomata', 'Alexandrina'],
    fourStarPool: ['Billy', 'Anby', 'Nicole', 'Ben', 'Corin', 'Anton', 'Seth'],
    threeStarPool: ['W-Engine scrap', 'Hollow material', 'Drive disc shard', 'Inter-Knot coupon'],
    imageUrl: defaultCharacterAsset,
    baseFiveRate: 0.6,
    softPityStart: 74,
    hardPity: 90,
    baseFourRate: 9.4,
    hardFourPity: 10,
    guaranteeRate: 50,
    hasGuarantee: true,
    currencyName: 'Polychrome',
    pullCost: 160,
    accent: '#ffb703',
    sourceName: 'Dimbreath ZenlessData',
    sourceUrl: 'https://github.com/Nagano-original-fireworks-store/Dimbreath-ZenlessData',
  },
  {
    id: 'wuwa-convene',
    game: 'Wuthering Waves',
    banner: 'Featured Resonator Convene',
    bannerKind: 'character',
    featuredName: 'Featured 5-star resonator',
    offBannerName: 'Standard 5-star resonator',
    featuredPool: ['Jiyan', 'Changli', 'Zhezhi', 'Camellya'],
    offBannerPool: ['Verina', 'Lingyang', 'Calcharo', 'Encore', 'Jianxin', 'Shorekeeper', 'Encore'],
    fourStarPool: ['Danjin', 'Sanhua', 'Mortefi', 'Chixia', 'Baizhi', 'Yangyang', 'Taoqi'],
    threeStarPool: ['Tuner scrap', 'Weapon shell', 'Resonance dust', 'Casket material'],
    imageUrl: defaultCharacterAsset,
    baseFiveRate: 0.8,
    softPityStart: 66,
    hardPity: 80,
    baseFourRate: 6,
    hardFourPity: 10,
    guaranteeRate: 50,
    hasGuarantee: true,
    currencyName: 'Astrite',
    pullCost: 160,
    accent: '#0d9488',
    sourceName: 'Resonance REST API',
    sourceUrl: 'https://github.com/resonance-rest/api',
  },
]

const customPreset: BannerRules = {
  id: 'custom',
  game: 'Custom Game',
  banner: 'Custom Banner',
  bannerKind: 'character',
  featuredName: 'Featured highest rarity',
  offBannerName: 'Off-banner highest rarity',
  featuredPool: ['Featured unit'],
  offBannerPool: ['Off-banner unit'],
  fourStarPool: ['4-star reward'],
  threeStarPool: ['3-star reward'],
  imageUrl: defaultCharacterAsset,
  baseFiveRate: 1,
  softPityStart: 70,
  hardPity: 90,
  baseFourRate: 8,
  hardFourPity: 10,
  guaranteeRate: 50,
  hasGuarantee: true,
  currencyName: 'Currency',
  pullCost: 1,
  accent: '#7c3aed',
  sourceName: 'Manual rules',
  sourceUrl: 'https://github.com/Jonathaneldokusuma/Pity-Simulator',
}

const genshinBanner = (id: string, version: string, phase: 1 | 2, names: string[], fourStars: string[]): BannerChoice => ({
  id, name: names.join(' + '), featuredName: names[0], featuredNames: names,
  version, phase, featuredFourStars: fourStars, imageUrl: defaultCharacterAsset,
  imageUrls: names.map(() => defaultCharacterAsset),
})

const genshinPhaseBanners: BannerChoice[] = [
  genshinBanner('6-7-p1', '6.7', 1, ['Sandrone', 'Citlali'], ['Beidou', 'Freminet', 'Diona']),
  genshinBanner('6-7-p2', '6.7', 2, ['Columbina', 'Raiden Shogun'], ['Jahoda', 'Ororon', 'Sethos']),
  genshinBanner('6-6-p1', '6.6', 1, ['Nicole', 'Durin'], ['Fischl', 'Prune', 'Razor']),
  genshinBanner('6-6-p2', '6.6', 2, ['Lohen', 'Mavuika'], ['Bennett', 'Xiangling', 'Mika']),
  genshinBanner('6-5-p1', '6.5', 1, ['Linnea', 'Chasca'], ['Illuga', 'Aino', 'Noelle']),
  genshinBanner('6-5-p2', '6.5', 2, ['Nefer', 'Lauma'], ['Xingqiu', 'Kirara', 'Jahoda']),
  genshinBanner('6-4-p1', '6.4', 1, ['Varka', 'Flins'], ['Bennett', 'Xiangling', 'Sucrose']),
  genshinBanner('6-4-p2', '6.4', 2, ['Skirk', 'Escoffier'], ['Dahlia', 'Candace', 'Charlotte']),
  genshinBanner('6-3-p1', '6.3', 1, ['Columbina', 'Ineffa'], ['Fischl', 'Sethos', 'Ifa']),
  genshinBanner('6-3-p2', '6.3', 2, ['Zibai', 'Neuvillette'], ['Illuga', 'Aino', 'Gorou']),
  genshinBanner('6-2-p1', '6.2', 1, ['Durin', 'Venti'], ['Jahoda', 'Bennett', 'Faruzan']),
  genshinBanner('6-2-p2', '6.2', 2, ['Varesa', 'Xilonen'], ['Iansan', 'Chevreuse', 'Gaming']),
  genshinBanner('6-1-p1', '6.1', 1, ['Nefer', 'Furina'], ['Xingqiu', 'Collei', 'Yaoyao']),
  genshinBanner('6-1-p2', '6.1', 2, ['Arlecchino', 'Zhongli'], ['Lan Yan', 'Rosaria', 'Yun Jin']),
  genshinBanner('5-0-p1', '5.0', 1, ['Mualani', 'Kazuha'], ['Kachina', 'Xinyan', 'Bennett']),
  genshinBanner('5-0-p2', '5.0', 2, ['Kinich', 'Raiden Shogun'], ['Thoma', 'Kujou Sara', 'Chevreuse']),
  genshinBanner('4-3-p2', '4.3', 2, ['Raiden Shogun', 'Yoimiya'], ['Chevreuse', 'Kujou Sara', 'Bennett']),
  genshinBanner('2-5-p2', '2.5', 2, ['Raiden Shogun', 'Sangonomiya Kokomi'], ['Bennett', 'Xinyan', 'Kujou Sara']),
  genshinBanner('2-1-p1', '2.1', 1, ['Raiden Shogun'], ['Kujou Sara', 'Xiangling', 'Sucrose']),
]

// Two rate-up characters share a phase, but they are still separate wishes.
// Keep one selectable card per 5-star so their pity simulations never merge.
const splitGenshinBanners = (phases: BannerChoice[]) => phases.flatMap((phase) =>
  (phase.featuredNames ?? [phase.featuredName]).map((name, index) => ({
    ...phase,
    id: `${phase.id}-${name.toLowerCase().replaceAll(' ', '-')}`,
    name,
    featuredName: name,
    featuredNames: [name],
    imageUrl: phase.imageUrls?.[index] ?? phase.imageUrl,
    imageUrls: [phase.imageUrls?.[index] ?? phase.imageUrl],
  })),
)

const manualGenshinCharacterBanners = splitGenshinBanners(genshinPhaseBanners)

function sourceBannerKey(name: string, version: string, phase: number) {
  return `${version}-${phase}-${name.toLowerCase().replace(/^kaedehara |^sangonomiya /, '')}`
}

const verifiedFourStars = new Map(
  manualGenshinCharacterBanners.map((choice) => [
    sourceBannerKey(choice.featuredName, choice.version, choice.phase ?? 1),
    choice.featuredFourStars,
  ]),
)

function sourceImageUrl(imageUrl: string) {
  return imageUrl.startsWith('/') ? `https://bannerhistory.app${imageUrl}` : imageUrl
}

const genshinCharacterBanners: BannerChoice[] = sourcedCharacterBanners.map((source) => ({
  ...source,
  phase: source.phase,
  imageUrl: sourceImageUrl(source.imageUrl),
  featuredFourStars: verifiedFourStars.get(sourceBannerKey(source.featuredName, source.version, source.phase)) ?? [],
}))

const starRailCharacterBanners: BannerChoice[] = starRailCharacterRecords.map((source) => ({
  ...source,
  name: source.featuredName,
  featuredNames: [source.featuredName],
  featuredFourStars: [],
  imageUrl: starRailCharacterImages[source.featuredName.toLowerCase()] ?? source.imageUrl,
}))

const starRailWeaponBanners: BannerChoice[] = starRailWeaponRecords.map((source) => ({
  ...source,
  name: source.featuredName,
  featuredNames: [source.featuredName],
  featuredFourStars: [],
}))

const bannerChoices: Record<string, BannerChoice[]> = {
  'genshin-character': genshinCharacterBanners,
  'star-rail-character': starRailCharacterBanners,
  'zenless-signal': ['Ellen', 'Zhu Yuan', 'Jane Doe', 'Yanagi'].map((name) => ({
    id: name.toLowerCase().replaceAll(' ', '-'), name, featuredName: name, version: 'All versions', featuredFourStars: [], imageUrl: defaultCharacterAsset,
  })),
  'wuwa-convene': ['Jiyan', 'Changli', 'Zhezhi', 'Camellya'].map((name) => ({
    id: name.toLowerCase(), name, featuredName: name, version: 'All versions', featuredFourStars: [], imageUrl: defaultCharacterAsset,
  })),
}

const genshinWeaponPhaseBanners: BannerChoice[] = [
  { id: 'weapons-2-1-p1', name: 'Engulfing Lightning + The Unforged', featuredName: 'Engulfing Lightning', featuredNames: ['Engulfing Lightning', 'The Unforged'], version: '2.1', phase: 1, featuredFourStars: ['The Alley Flash', 'The Bell', 'The Stringless'], imageUrl: defaultCharacterAsset },
  { id: 'weapons-2-5-p2', name: 'Engulfing Lightning + Everlasting Moonglow', featuredName: 'Engulfing Lightning', featuredNames: ['Engulfing Lightning', 'Everlasting Moonglow'], version: '2.5', phase: 2, featuredFourStars: ['The Widsith', 'Favonius Lance', 'Eye of Perception'], imageUrl: defaultCharacterAsset },
  { id: 'weapons-3-3-p2', name: 'Engulfing Lightning + Haran Geppaku Futsu', featuredName: 'Engulfing Lightning', featuredNames: ['Engulfing Lightning', 'Haran Geppaku Futsu'], version: '3.3', phase: 2, featuredFourStars: ['Favonius Sword', 'Dragon\'s Bane', 'Favonius Warbow'], imageUrl: defaultCharacterAsset },
  { id: 'weapons-4-3-p2', name: 'Engulfing Lightning + Thundering Pulse', featuredName: 'Engulfing Lightning', featuredNames: ['Engulfing Lightning', 'Thundering Pulse'], version: '4.3', phase: 2, featuredFourStars: ['Lithic Spear', 'Akuoumaru', 'Rust'], imageUrl: defaultCharacterAsset },
  { id: 'weapons-5-0-p2', name: 'Engulfing Lightning + Fang of the Mountain King', featuredName: 'Engulfing Lightning', featuredNames: ['Engulfing Lightning', 'Fang of the Mountain King'], version: '5.0', phase: 2, featuredFourStars: ['Xiphos\' Moonlight', 'Sacrificial Greatsword', 'The Stringless'], imageUrl: defaultCharacterAsset },
]

const manualWeaponBannerChoices = splitGenshinBanners(genshinWeaponPhaseBanners)
const genshinWeaponBanners: BannerChoice[] = sourcedWeaponBanners.map((source) => ({
  ...source,
  phase: source.phase,
  imageUrl: sourceImageUrl(source.imageUrl),
  featuredFourStars: manualWeaponBannerChoices.find((choice) =>
    choice.featuredName === source.featuredName && choice.version === source.version && choice.phase === source.phase,
  )?.featuredFourStars ?? [],
}))
const weaponBannerChoices = genshinWeaponBanners
const weaponChoicesByPreset: Record<string, BannerChoice[]> = {
  'genshin-character': weaponBannerChoices,
  'star-rail-character': starRailWeaponBanners,
}
const genshinWeaponReleaseVersions = new Map<string, string>([
  ['engulfing lightning', '2.1'],
  ['the unforged', '1.1'],
  ['everlasting moonglow', '2.1'],
  ['haran geppaku futsu', '2.6'],
  ['thundering pulse', '2.0'],
  ['fang of the mountain king', '5.0'],
  ['the alley flash', '1.0'],
  ['the bell', '1.0'],
  ['the stringless', '1.0'],
  ['the widsith', '1.0'],
  ['favonius lance', '1.0'],
  ['eye of perception', '1.0'],
  ['favonius sword', '1.0'],
  ["dragon's bane", '1.0'],
  ['favonius warbow', '1.0'],
  ['lithic spear', '1.3'],
  ['akuoumaru', '2.2'],
  ['rust', '1.0'],
  ["xiphos' moonlight", '3.1'],
  ['sacrificial greatsword', '1.0'],
])

// Keep every released patch selectable even when a source has not published a
// phase record yet. This prevents the picker from silently hiding versions.
const genshinVersions = Array.from(new Set(
  [...sourcedCharacterBanners, ...sourcedWeaponBanners].map((banner) => banner.version),
))

function sortVersions(first: string, second: string) {
  const firstParts = first.split('.').map(Number)
  const secondParts = second.split('.').map(Number)
  return (secondParts[0] || 0) - (firstParts[0] || 0) || (secondParts[1] || 0) - (firstParts[1] || 0)
}

const emptyTotals: Totals = {
  pulls: 0,
  fiveStars: 0,
  fourStars: 0,
  featured: 0,
  lostRateUps: 0,
  longestDry: 0,
  spent: 0,
}

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
})

const numberFormatter = new Intl.NumberFormat('en-US')

function copyRules(rules: BannerRules): BannerRules {
  return { ...rules }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function normalizeRules(rules: BannerRules): BannerRules {
  const hardPity = Math.max(1, Math.round(rules.hardPity))
  const softPityStart = clamp(Math.round(rules.softPityStart), 1, hardPity)

  return {
    ...rules,
    game: rules.game.trim() || 'Custom Game',
    banner: rules.banner.trim() || 'Custom Banner',
    featuredName: rules.featuredName.trim() || 'Featured highest rarity',
    offBannerName: rules.offBannerName.trim() || 'Off-banner highest rarity',
    imageUrl: rules.imageUrl.trim(),
    baseFiveRate: clamp(rules.baseFiveRate, 0, 100),
    softPityStart,
    hardPity,
    baseFourRate: clamp(rules.baseFourRate, 0, 100),
    hardFourPity: Math.max(1, Math.round(rules.hardFourPity)),
    guaranteeRate: clamp(rules.guaranteeRate, 0, 100),
    pullCost: Math.max(0, Math.round(rules.pullCost)),
    accent: rules.accent || '#7c3aed',
  }
}

function formatPercent(value: number) {
  return `${percentFormatter.format(value)}%`
}

function pickRewardName(names: string[], fallback: string) {
  if (names.length === 0) {
    return fallback
  }

  return names[Math.floor(Math.random() * names.length)]
}

function getFiveStarChance(rules: BannerRules, pity: number) {
  const currentPull = pity + 1

  if (currentPull >= rules.hardPity) {
    return 100
  }

  if (currentPull < rules.softPityStart) {
    return rules.baseFiveRate
  }

  const softWindow = Math.max(1, rules.hardPity - rules.softPityStart + 1)
  const softProgress = (currentPull - rules.softPityStart + 1) / softWindow

  return clamp(rules.baseFiveRate + (100 - rules.baseFiveRate) * softProgress, 0, 100)
}

function getFourStarChance(rules: BannerRules, pity: number) {
  return pity + 1 >= rules.hardFourPity ? 100 : rules.baseFourRate
}

function resultId(pullNumber: number) {
  return `${pullNumber}-${Math.random().toString(36).slice(2)}`
}

function handleImageFallback(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.dataset.character = 'false'
  event.currentTarget.src = '/summon-prism.svg'
}

function pickBannerFace(rules: BannerRules) {
  const pool = rules.featuredPool.length > 0 ? rules.featuredPool : [rules.featuredName]
  return pool[Math.floor(Math.random() * pool.length)]
}

function App() {
  const [selectedPresetId, setSelectedPresetId] = useState(presets[0].id)
  const [rules, setRules] = useState<BannerRules>(() => copyRules(presets[0]))
  const [pity5, setPity5] = useState(0)
  const [pity4, setPity4] = useState(0)
  const [guaranteed, setGuaranteed] = useState(false)
  const [totals, setTotals] = useState<Totals>(emptyTotals)
  const [lastBatch, setLastBatch] = useState<PullResult[]>([])
  const [history, setHistory] = useState<PullResult[]>([])
  const [copied, setCopied] = useState(false)
  const [selectedBannerId, setSelectedBannerId] = useState('6-7-p1')
  const [selectedBannerVersion, setSelectedBannerVersion] = useState('All versions')
  const [liveGenshinBanners, setLiveGenshinBanners] = useState(bannerChoices['genshin-character'])
  const [genshinImages, setGenshinImages] = useState<Map<string, string>>(
    () => new Map([
      ...sourcedWeaponBanners.map((item) => [item.featuredName.toLowerCase(), sourceImageUrl(item.imageUrl)] as const),
      ...starRailCharacterRecords.map((item) => [item.featuredName.toLowerCase(), item.imageUrl] as const),
      ...Object.entries(starRailCharacterImages),
      ...starRailWeaponRecords.map((item) => [item.featuredName.toLowerCase(), item.imageUrl] as const),
      ...Object.entries(starRailRewardImages),
    ]),
  )
  const [genshinReleaseVersions, setGenshinReleaseVersions] = useState<Map<string, string>>(new Map())
  const [selectedWishType, setSelectedWishType] = useState<'character' | 'weapon'>('character')
  const [sourceState, setSourceState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  const [sourceMessage, setSourceMessage] = useState('')

  const activeRules = useMemo(() => normalizeRules(rules), [rules])
  const currencyAsset = currencyAssetByPreset[activeRules.id]
  const nextFiveChance = useMemo(
    () => getFiveStarChance(activeRules, pity5),
    [activeRules, pity5],
  )
  const nextFourChance = useMemo(
    () => getFourStarChance(activeRules, pity4),
    [activeRules, pity4],
  )
  const themeStyle = {
    '--rule-accent': activeRules.accent,
  } as CSSProperties

  const fivePityProgress = clamp((pity5 / activeRules.hardPity) * 100, 0, 100)
  const fourPityProgress = clamp((pity4 / activeRules.hardFourPity) * 100, 0, 100)
  const averagePullsPerFive =
    totals.fiveStars > 0 ? (totals.pulls / totals.fiveStars).toFixed(1) : '-'
  const featuredRate =
    totals.fiveStars > 0 ? formatPercent((totals.featured / totals.fiveStars) * 100) : '-'
  const activeImageUrl = activeRules.imageUrl || '/summon-prism.svg'
  const activeBannerFace = useMemo(() => pickBannerFace(activeRules), [activeRules])
  const activeFeaturedPool = activeRules.featuredPool.length > 0 ? activeRules.featuredPool : [activeRules.featuredName]
  const activeOffBannerPool = activeRules.offBannerPool.length > 0 ? activeRules.offBannerPool : [activeRules.offBannerName]
  const activeBannerChoices = activeRules.id === 'genshin-character' || activeRules.id === 'star-rail-character'
    ? selectedWishType === 'character'
      ? activeRules.id === 'genshin-character' ? liveGenshinBanners : starRailCharacterBanners
      : weaponChoicesByPreset[activeRules.id] ?? []
    : bannerChoices[activeRules.id] ?? []
  const bannerVersions = activeRules.id === 'genshin-character'
    ? ['All versions', ...genshinVersions.sort(sortVersions)]
    : ['All versions', ...Array.from(new Set(activeBannerChoices.map((choice) => choice.version))).sort(sortVersions)]
  const visibleBannerChoices = selectedBannerVersion === 'All versions'
    ? activeBannerChoices
    : activeBannerChoices.filter((choice) => choice.version === selectedBannerVersion)
  const hasVersionBanner = selectedBannerVersion === 'All versions' || visibleBannerChoices.length > 0

  function resetSession() {
    setPity5(0)
    setPity4(0)
    setGuaranteed(false)
    setTotals(emptyTotals)
    setLastBatch([])
    setHistory([])
  }

  function selectPreset(preset: BannerRules) {
    setSelectedPresetId(preset.id)
    setRules(copyRules(preset))
    resetSession()
    setSourceState('idle')
    setSourceMessage('')
    setSelectedBannerId(bannerChoices[preset.id]?.[0]?.id ?? '')
    setSelectedBannerVersion('All versions')
    setSelectedWishType('character')
  }

  function selectCustomPreset() {
    setSelectedPresetId('custom')
    setRules((current) => (current.id === 'custom' ? current : copyRules(customPreset)))
    resetSession()
    setSourceState('idle')
    setSourceMessage('')
  }

  function selectBanner(choice: BannerChoice, wishType = selectedWishType) {
    setSelectedBannerId(choice.id)
    setRules((current) => ({
      ...current,
      banner: `${choice.name} Banner`,
      bannerKind: wishType,
      featuredName: choice.featuredName,
      featuredPool: choice.featuredNames ?? [choice.featuredName],
      offBannerPool: wishType === 'weapon'
        ? activeRules.id === 'genshin-character' ? genshinStandardWeaponPool : starRailStandardLightConePool
        : current.offBannerPool,
      fourStarPool: choice.featuredFourStars,
      threeStarPool: activeRules.id === 'genshin-character' && wishType === 'weapon'
        ? genshinWeaponThreeStarPool
        : activeRules.id === 'star-rail-character'
          ? starRailThreeStarPool
        : current.threeStarPool,
      imageUrl: choice.imageUrl,
      bannerVersion: choice.version,
    }))
    resetSession()
  }

  function changeBannerVersion(version: string) {
    setSelectedBannerVersion(version)
    const choices = version === 'All versions'
      ? activeBannerChoices
      : activeBannerChoices.filter((choice) => choice.version === version)
    if (choices[0]) {
      selectBanner(choices[0])
      return
    }
    setSelectedBannerId('')
    setRules((current) => ({
      ...current,
      banner: `${version} banner data unavailable`,
      bannerVersion: version,
      featuredName: 'No banner loaded',
      featuredPool: [],
      fourStarPool: [],
      imageUrl: defaultCharacterAsset,
    }))
    resetSession()
  }

  function getRewardImage(name: string) {
    return genshinImages.get(name.toLowerCase()) || ''
  }

  function isAvailableAtVersion(name: string, version: string | undefined) {
    if (!version || activeRules.id !== 'genshin-character') return true
    const releaseMap = selectedWishType === 'weapon' ? genshinWeaponReleaseVersions : genshinReleaseVersions
    const released = releaseMap.get(name.toLowerCase())
    if (!released) return true
    return sortVersions(released, version) >= 0
  }

  function availablePool(pool: string[], fallback: string | string[]) {
    const available = pool.filter((name) => isAvailableAtVersion(name, activeRules.bannerVersion))
    return available.length > 0 ? available : Array.isArray(fallback) ? fallback : [fallback]
  }

  useEffect(() => {
    void loadLiveSource()
    // The loader is intentionally run once when the simulator opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadLiveSource() {
    if (activeRules.id !== 'genshin-character') {
      setSourceMessage('This source is linked for reference; live roster loading is available for Genshin first.')
      setSourceState('error')
      return
    }

    setSourceState('loading')
    setSourceMessage('Refreshing banner artwork and metadata...')

    try {
      async function fetchCharacters() {
        const response = await fetch(
          'https://genshin-db-api.vercel.app/api/v5/characters?query=names&matchCategories=true&verboseCategories=true&resultLanguage=English',
        )
        if (!response.ok) throw new Error('characters request failed')
        const payload: unknown = await response.json()
        return Array.isArray(payload)
          ? payload.filter((item): item is GenshinDbCharacter => typeof item === 'object' && item !== null)
          : []
      }

      async function fetchWeapons() {
        const response = await fetch(
          'https://genshin-db-api.vercel.app/api/v5/weapons?query=names&matchCategories=true&verboseCategories=true&resultLanguage=English',
        )
        if (!response.ok) return []
        const payload: unknown = await response.json()
        return Array.isArray(payload)
          ? payload.filter((item): item is GenshinDbCharacter => typeof item === 'object' && item !== null)
          : []
      }

      const characterRecords = await fetchCharacters()
      const weaponRecords = await fetchWeapons()
      const metadataByName = new Map(
        characterRecords
          .filter((item) => typeof item.name === 'string')
          .map((item) => [item.name?.toLowerCase(), item]),
      )
      const aliases: Record<string, string> = {
        kazuha: 'kaedehara kazuha',
        kokomi: 'sangonomiya kokomi',
        raiden: 'raiden shogun',
        chasca: 'chasca',
      }
      const characterBanners = genshinCharacterBanners.map((choice) => {
        const metadata = metadataByName.get((aliases[choice.featuredName.toLowerCase()] || choice.featuredName).toLowerCase())
        return {
          ...choice,
          imageUrl: metadata?.images?.hoyowiki_icon || metadata?.images?.icon || choice.imageUrl,
          imageUrls: (choice.featuredNames ?? [choice.featuredName]).map((name) => {
            const nameKey = aliases[name.toLowerCase()] || name
            const item = metadataByName.get(nameKey.toLowerCase())
            return item?.images?.hoyowiki_icon || item?.images?.icon || choice.imageUrl
          }),
        }
      })
      if (characterBanners.length === 0) throw new Error('Empty catalog returned')

      const imageMap = new Map([...characterRecords, ...weaponRecords].flatMap((item) => {
        if (!item.name) return []
        const image = item.images?.hoyowiki_icon || item.images?.icon
        return image ? [[item.name.toLowerCase(), image] as [string, string]] : []
      }))
      Object.entries(aliases).forEach(([label, canonical]) => {
        const image = imageMap.get(canonical.toLowerCase())
        if (image) imageMap.set(label, image)
      })
      setGenshinImages(imageMap)
      const releaseMap = new Map(characterRecords.flatMap((item) => {
        if (!item.name || !item.version) return []
        return [[item.name.toLowerCase(), item.version.replace(/^version\s*/i, '')] as [string, string]]
      }))
      Object.entries(aliases).forEach(([label, canonical]) => {
        const version = releaseMap.get(canonical.toLowerCase())
        if (version) releaseMap.set(label, version)
      })
      setGenshinReleaseVersions(releaseMap)

      setRules((current) => ({
        ...current,
        banner: `${characterBanners[0].name} Banner`,
        featuredName: characterBanners[0].featuredName,
        featuredPool: characterBanners[0].featuredNames ?? [characterBanners[0].featuredName],
        imageUrl: characterBanners[0].imageUrl,
        fourStarPool: characterBanners[0].featuredFourStars,
        bannerVersion: characterBanners[0].version,
      }))
      setLiveGenshinBanners(characterBanners)
      setSelectedBannerId(characterBanners[0].id)
      setSourceState('loaded')
      setSourceMessage(`Loaded ${characterBanners.length} patch banner records with metadata.`)
    } catch {
      setSourceState('error')
      setSourceMessage('Could not reach the API. The built-in preset is still available.')
    }
  }

  function updateRule<K extends keyof BannerRules>(key: K, value: BannerRules[K]) {
    setSelectedPresetId('custom')
    setRules((current) => ({
      ...current,
      id: 'custom',
      [key]: value,
    }))
  }

  function updateNumericRule(key: NumericRuleKey, rawValue: string) {
    const nextValue = Number(rawValue)
    updateRule(key, Number.isFinite(nextValue) ? nextValue : 0)
  }

  function performPulls(requestedPulls: number, stopOnFeatured = false) {
    const runRules = activeRules
    const featuredPool = availablePool(runRules.featuredPool, runRules.featuredName)
    const offBannerPool = availablePool(runRules.offBannerPool, runRules.offBannerName)
    const fourStarFallback = runRules.id === 'genshin-character'
      ? selectedWishType === 'weapon' ? genshinWeaponFourStarFallback : genshinCharacterFourStarFallback
      : runRules.id === 'star-rail-character' && selectedWishType === 'weapon'
        ? starRailFourStarLightConePool
        : runRules.id === 'star-rail-character'
          ? starRailFourStarCharacterPool
          : '4-star reward'
    const fourStarPool = availablePool(runRules.fourStarPool, fourStarFallback)
    const threeStarPool = availablePool(
      runRules.threeStarPool,
      runRules.id === 'genshin-character' && selectedWishType === 'weapon'
        ? genshinWeaponThreeStarPool
        : runRules.id === 'star-rail-character' && selectedWishType === 'weapon'
          ? starRailThreeStarPool
          : '3-star reward',
    )
    const limit = stopOnFeatured ? 500 : requestedPulls
    const batch: PullResult[] = []
    let nextPity5 = pity5
    let nextPity4 = pity4
    let nextGuaranteed = guaranteed
    const nextTotals = { ...totals }

    for (let index = 0; index < limit; index += 1) {
      const pullNumber = nextTotals.pulls + 1
      const fiveChance = getFiveStarChance(runRules, nextPity5)
      const hitFiveStar = Math.random() * 100 < fiveChance

      nextTotals.pulls += 1
      nextTotals.spent += runRules.pullCost

      if (hitFiveStar) {
        const pityAt = nextPity5 + 1
        const wasGuaranteed = runRules.hasGuarantee && nextGuaranteed
        const wonFeatured =
          wasGuaranteed || !runRules.hasGuarantee
            ? true
            : Math.random() * 100 < runRules.guaranteeRate

        const rewardName = wonFeatured
          ? pickRewardName(featuredPool, runRules.featuredName)
          : pickRewardName(offBannerPool, runRules.offBannerName)
        batch.push({
          id: resultId(pullNumber),
          number: pullNumber,
          rarity: 5,
          name: rewardName,
          featured: wonFeatured,
          pityAt,
          chance: fiveChance,
          guaranteed: wasGuaranteed,
          imageUrl: getRewardImage(rewardName) || runRules.imageUrl,
        })

        nextTotals.fiveStars += 1
        nextTotals.featured += wonFeatured ? 1 : 0
        nextTotals.lostRateUps += wonFeatured ? 0 : 1
        nextTotals.longestDry = Math.max(nextTotals.longestDry, pityAt)
        nextPity5 = 0
        nextPity4 += 1
        nextGuaranteed = runRules.hasGuarantee ? !wonFeatured : false

        if (stopOnFeatured && wonFeatured) {
          break
        }

        continue
      }

      nextPity5 += 1

      const fourChance = getFourStarChance(runRules, nextPity4)
      const hitFourStar = Math.random() * 100 < fourChance

      if (hitFourStar) {
        const rewardName = pickRewardName(fourStarPool, '4-star reward')
        batch.push({
          id: resultId(pullNumber),
          number: pullNumber,
          rarity: 4,
          name: rewardName,
          featured: false,
          pityAt: nextPity4 + 1,
          chance: fourChance,
          guaranteed: false,
          imageUrl: getRewardImage(rewardName),
        })

        nextTotals.fourStars += 1
        nextPity4 = 0
      } else {
        const rewardName = pickRewardName(threeStarPool, '3-star reward')
        batch.push({
          id: resultId(pullNumber),
          number: pullNumber,
          rarity: 3,
          name: rewardName,
          featured: false,
          pityAt: 0,
          chance: 0,
          guaranteed: false,
          imageUrl: getRewardImage(rewardName),
        })

        nextPity4 += 1
      }
    }

    setPity5(nextPity5)
    setPity4(nextPity4)
    setGuaranteed(nextGuaranteed)
    setTotals(nextTotals)
    setLastBatch(batch.slice(-60))
    setHistory((current) => [...batch].reverse().concat(current).slice(0, 100))
  }

  async function copySummary() {
    const summary = [
      `${activeRules.game} - ${activeRules.banner}`,
      `Pulls: ${totals.pulls}`,
      `5-star: ${totals.fiveStars}`,
      `Featured: ${totals.featured}`,
      `Lost rate-up: ${totals.lostRateUps}`,
      `Current 5-star pity: ${pity5}/${activeRules.hardPity}`,
      `Guarantee: ${activeRules.hasGuarantee ? (guaranteed ? 'active' : 'not active') : 'off'}`,
      `Spent: ${numberFormatter.format(totals.spent)} ${activeRules.currencyName}`,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="app-shell" style={themeStyle}>
      <header className="app-header">
        <div className="brand-lockup">
          <img className="brand-mark" src={brandLogoAsset} alt="" />
          <div>
            <p className="eyebrow">Gacha Lab</p>
            <h1>Pity Simulator</h1>
          </div>
        </div>

        <div className="header-actions">
          <button className="button ghost" type="button" onClick={copySummary}>
            <Copy size={18} aria-hidden="true" />
            {copied ? 'Copied' : 'Copy Stats'}
          </button>
          <button className="button ghost" type="button" onClick={resetSession}>
            <RotateCcw size={18} aria-hidden="true" />
            Reset
          </button>
        </div>
      </header>

      <div className="dashboard">
        <section className="panel preset-panel" aria-labelledby="preset-heading">
          <div className="panel-header">
            <Ticket size={20} aria-hidden="true" />
            <h2 id="preset-heading">Game Preset</h2>
          </div>

          <div className="source-card">
            <div className="source-card-heading">
              <Database size={18} aria-hidden="true" />
              <span>
                <strong>Real data source</strong>
                <small>{activeRules.sourceName}</small>
              </span>
            </div>
            <a href={activeRules.sourceUrl} target="_blank" rel="noreferrer">
              View source <ExternalLink size={14} aria-hidden="true" />
            </a>
            <button className="button source-button" type="button" onClick={loadLiveSource} disabled={sourceState === 'loading'}>
              {sourceState === 'loading' ? <LoaderCircle className="spin" size={16} aria-hidden="true" /> : <Database size={16} aria-hidden="true" />}
              {sourceState === 'loading'
                ? 'Loading...'
                : activeRules.id === 'genshin-character'
                  ? 'Refresh banner data'
                  : 'Source linked'}
            </button>
            {sourceMessage && <small className={`source-message ${sourceState}`}>{sourceMessage}</small>}
          </div>

          <div className="preset-grid">
            {presets.map((preset) => (
              <button
                className={`preset-option ${selectedPresetId === preset.id ? 'active' : ''}`}
                key={preset.id}
                type="button"
                onClick={() => selectPreset(preset)}
              >
                <span
                  className="preset-swatch"
                  style={{ backgroundColor: preset.accent }}
                  aria-hidden="true"
                />
                <span>
                  <strong>{preset.game}</strong>
                  <small>{preset.banner}</small>
                </span>
              </button>
            ))}

            <button
              className={`preset-option ${selectedPresetId === 'custom' ? 'active' : ''}`}
              type="button"
              onClick={selectCustomPreset}
            >
              <span className="preset-swatch custom" aria-hidden="true" />
              <span>
                <strong>Custom</strong>
                <small>Any game rules</small>
              </span>
            </button>
          </div>
        </section>

        <section className="panel summon-panel" aria-labelledby="summon-heading">
          {activeBannerChoices.length > 0 && (
            <div className="banner-picker" aria-label="Choose a banner">
              <div className="banner-picker-heading">
                <span className="eyebrow">Choose banner</span>
                {(activeRules.id === 'genshin-character' || activeRules.id === 'star-rail-character') && <div className="collection-toggle" role="tablist" aria-label="Wish type">
                  {(['character', 'weapon'] as const).map((wishType) => (
                    <button
                      className={selectedWishType === wishType ? 'active' : ''}
                      key={wishType}
                      type="button"
                      onClick={() => {
                        setSelectedWishType(wishType)
                        setSelectedBannerVersion('All versions')
                        const choices = wishType === 'character'
                          ? activeRules.id === 'genshin-character' ? liveGenshinBanners : starRailCharacterBanners
                          : weaponChoicesByPreset[activeRules.id] ?? []
                        if (choices[0]) selectBanner(choices[0], wishType)
                      }}
                    >
                      {wishType === 'character' ? 'Characters' : 'Weapons'}
                    </button>
                  ))}
                </div>}
                <label>
                  <span>Version</span>
                  <select value={selectedBannerVersion} onChange={(event) => changeBannerVersion(event.target.value)}>
                    {bannerVersions.map((version) => <option key={version}>{version}</option>)}
                  </select>
                </label>
              </div>
              <div className="banner-choice-grid">
                {visibleBannerChoices.map((choice) => (
                  <button
                    className={`banner-choice ${selectedBannerId === choice.id ? 'active' : ''}`}
                    key={choice.id}
                    type="button"
                    onClick={() => selectBanner(choice)}
                  >
                    <span>{choice.name}</span>
                    <small>{selectedBannerId === choice.id ? 'Selected' : `Patch ${choice.version} · Phase ${choice.phase ?? '-'}`}</small>
                    </button>
                ))}
                {visibleBannerChoices.length === 0 && (
                  <p className="banner-empty">No sourced phase data for {selectedBannerVersion} yet. Pulls are disabled until a real banner record is loaded.</p>
                )}
              </div>
            </div>
          )}
            <div className="summon-stage">
              <div className="summon-art-wrap">
                <div className="banner-badge">{activeRules.bannerKind}</div>
                {(activeBannerChoices.find((choice) => choice.id === selectedBannerId)?.imageUrls ?? [activeImageUrl]).map((imageUrl, index) => (
                  <img
                    className="summon-art"
                    key={`${imageUrl}-${index}`}
                    src={imageUrl}
                    alt=""
                    data-character={imageUrl !== defaultCharacterAsset ? 'true' : 'false'}
                    onError={handleImageFallback}
                  />
                ))}
            </div>

            <div className="summon-copy">
              <p className="eyebrow">{activeRules.game}</p>
              <h2 id="summon-heading">{activeRules.banner}</h2>
              <div className="banner-rail">
                <span className={`banner-pill ${activeRules.bannerKind}`}>{activeRules.bannerKind}</span>
                <span className="banner-pill subtle">Featured pool: {activeFeaturedPool.length}</span>
                <span className="banner-pill subtle">Off-banner pool: {activeOffBannerPool.length}</span>
              </div>
              <p className="banner-face">Spotlight: {activeBannerFace}</p>
              <div className="target-line">
                <Target size={18} aria-hidden="true" />
                <span>{activeRules.featuredName}</span>
              </div>

              <div className="banner-pools" aria-label="Banner pools">
                <section className="pool-chip-group">
                  <strong>Featured</strong>
                  <div className="chip-row">
                    {activeFeaturedPool.slice(0, 6).map((item) => (
                      <span key={item} className="chip featured">
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
                <section className="pool-chip-group">
                  <strong>Off-banner</strong>
                  <div className="chip-row">
                    {activeOffBannerPool.slice(0, 6).map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="pull-actions">
            <button className="button primary" type="button" disabled={!hasVersionBanner} onClick={() => performPulls(1)}>
              {currencyAsset ? <img className="currency-control-icon" src={currencyAsset} alt="" /> : <Sparkles size={18} aria-hidden="true" />}
              1 Pull
            </button>
            <button className="button primary" type="button" disabled={!hasVersionBanner} onClick={() => performPulls(10)}>
              {currencyAsset ? <img className="currency-control-icon" src={currencyAsset} alt="" /> : <Sparkles size={18} aria-hidden="true" />}
              10 Pulls
            </button>
            <button className="button accent" type="button" disabled={!hasVersionBanner} onClick={() => performPulls(1, true)}>
              {currencyAsset ? <img className="currency-control-icon" src={currencyAsset} alt="" /> : <WandSparkles size={18} aria-hidden="true" />}
              Until Featured
            </button>
          </div>

          <div className="odds-grid">
            <article className="odds-card">
              <div className="odds-topline">
                <span>5-star pity</span>
                <strong>
                  {pity5}/{activeRules.hardPity}
                </strong>
              </div>
              <div className="meter" aria-hidden="true">
                <span style={{ width: `${fivePityProgress}%` }} />
              </div>
              <small>Next odds {formatPercent(nextFiveChance)}</small>
            </article>

            <article className="odds-card">
              <div className="odds-topline">
                <span>4-star pity</span>
                <strong>
                  {pity4}/{activeRules.hardFourPity}
                </strong>
              </div>
              <div className="meter four" aria-hidden="true">
                <span style={{ width: `${fourPityProgress}%` }} />
              </div>
              <small>Next odds {formatPercent(nextFourChance)}</small>
            </article>

            <article className="odds-card guarantee-card">
              <div className="odds-topline">
                <span>Rate-up state</span>
                <strong>{guaranteed ? 'Guaranteed' : `${activeRules.guaranteeRate}%`}</strong>
              </div>
              <small>{activeRules.hasGuarantee ? 'Guarantee after loss' : 'Guarantee off'}</small>
            </article>
          </div>
        </section>

        <section className="panel stats-panel" aria-labelledby="stats-heading">
          <div className="panel-header">
            <BarChart3 size={20} aria-hidden="true" />
            <h2 id="stats-heading">Run Stats</h2>
          </div>

          <div className="stat-grid">
            <div className="stat-tile">
              <span>Total Pulls</span>
              <strong>{numberFormatter.format(totals.pulls)}</strong>
            </div>
            <div className="stat-tile">
              <span>5-star</span>
              <strong>{numberFormatter.format(totals.fiveStars)}</strong>
            </div>
            <div className="stat-tile">
              <span>Featured</span>
              <strong>{numberFormatter.format(totals.featured)}</strong>
            </div>
            <div className="stat-tile">
              <span>Lost</span>
              <strong>{numberFormatter.format(totals.lostRateUps)}</strong>
            </div>
            <div className="stat-tile">
              <span>Average</span>
              <strong>{averagePullsPerFive}</strong>
            </div>
            <div className="stat-tile">
              <span>Featured Rate</span>
              <strong>{featuredRate}</strong>
            </div>
          </div>

          <div className="spent-box">
            {currencyAsset ? <img className="currency-control-icon" src={currencyAsset} alt="" /> : <Sparkles size={18} aria-hidden="true" />}
            <span>{numberFormatter.format(totals.spent)}</span>
            <small>{activeRules.currencyName}</small>
          </div>
        </section>

        <section className="panel rules-panel" aria-labelledby="rules-heading">
          <div className="panel-header">
            <Settings2 size={20} aria-hidden="true" />
            <h2 id="rules-heading">Rules</h2>
          </div>

          <div className="rules-form">
            <label className="field wide">
              <span>Game</span>
              <input
                value={rules.game}
                onChange={(event) => updateRule('game', event.target.value)}
              />
            </label>

            <label className="field wide">
              <span>Banner</span>
              <input
                value={rules.banner}
                onChange={(event) => updateRule('banner', event.target.value)}
              />
            </label>

            <label className="field wide">
              <span>Featured 5-star</span>
              <input
                value={rules.featuredName}
                onChange={(event) => updateRule('featuredName', event.target.value)}
              />
            </label>

            <label className="field wide">
              <span>Off-banner 5-star</span>
              <input
                value={rules.offBannerName}
                onChange={(event) => updateRule('offBannerName', event.target.value)}
              />
            </label>

            <label className="field wide">
              <span>Banner Type</span>
              <select
                value={rules.bannerKind}
                onChange={(event) =>
                  updateRule('bannerKind', event.target.value === 'weapon' ? 'weapon' : 'character')
                }
              >
                <option value="character">Character</option>
                <option value="weapon">Weapon</option>
              </select>
            </label>

            <label className="field wide">
              <span>Featured Pool</span>
              <input
                value={rules.featuredPool.join(', ')}
                onChange={(event) =>
                  updateRule(
                    'featuredPool',
                    event.target.value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  )
                }
              />
            </label>

            <label className="field wide">
              <span>Off-banner Pool</span>
              <input
                value={rules.offBannerPool.join(', ')}
                onChange={(event) =>
                  updateRule(
                    'offBannerPool',
                    event.target.value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  )
                }
              />
            </label>

            <label className="field wide">
              <span>4-star Pool</span>
              <input
                value={rules.fourStarPool.join(', ')}
                onChange={(event) =>
                  updateRule(
                    'fourStarPool',
                    event.target.value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  )
                }
              />
            </label>

            <label className="field wide">
              <span>3-star Pool</span>
              <input
                value={rules.threeStarPool.join(', ')}
                onChange={(event) =>
                  updateRule(
                    'threeStarPool',
                    event.target.value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  )
                }
              />
            </label>

            <label className="field wide">
              <span>Character Image URL</span>
              <input
                type="url"
                placeholder="https://..."
                value={rules.imageUrl}
                onChange={(event) => updateRule('imageUrl', event.target.value)}
              />
            </label>

            <label className="field">
              <span>5-star base %</span>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={rules.baseFiveRate}
                onChange={(event) => updateNumericRule('baseFiveRate', event.target.value)}
              />
            </label>

            <label className="field">
              <span>Soft pity</span>
              <input
                type="number"
                min="1"
                step="1"
                value={rules.softPityStart}
                onChange={(event) => updateNumericRule('softPityStart', event.target.value)}
              />
            </label>

            <label className="field">
              <span>Hard pity</span>
              <input
                type="number"
                min="1"
                step="1"
                value={rules.hardPity}
                onChange={(event) => updateNumericRule('hardPity', event.target.value)}
              />
            </label>

            <label className="field">
              <span>4-star base %</span>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={rules.baseFourRate}
                onChange={(event) => updateNumericRule('baseFourRate', event.target.value)}
              />
            </label>

            <label className="field">
              <span>4-star pity</span>
              <input
                type="number"
                min="1"
                step="1"
                value={rules.hardFourPity}
                onChange={(event) => updateNumericRule('hardFourPity', event.target.value)}
              />
            </label>

            <label className="field">
              <span>Rate-up %</span>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={rules.guaranteeRate}
                onChange={(event) => updateNumericRule('guaranteeRate', event.target.value)}
              />
            </label>

            <label className="field">
              <span>Currency</span>
              <input
                value={rules.currencyName}
                onChange={(event) => updateRule('currencyName', event.target.value)}
              />
            </label>

            <label className="field">
              <span>Cost per pull</span>
              <input
                type="number"
                min="0"
                step="1"
                value={rules.pullCost}
                onChange={(event) => updateNumericRule('pullCost', event.target.value)}
              />
            </label>

            <label className="field color-field">
              <span>Accent</span>
              <input
                type="color"
                value={rules.accent}
                onChange={(event) => updateRule('accent', event.target.value)}
              />
            </label>

            <label className="toggle-field">
              <input
                type="checkbox"
                checked={rules.hasGuarantee}
                onChange={(event) => updateRule('hasGuarantee', event.target.checked)}
              />
              <span>Guarantee after losing rate-up</span>
            </label>
          </div>
        </section>

        <section className="panel results-panel" aria-labelledby="results-heading">
          <div className="panel-header">
            <Crown size={20} aria-hidden="true" />
            <h2 id="results-heading">Latest Results</h2>
            {lastBatch.length > 0 && <span className="panel-count">{lastBatch.length}</span>}
          </div>

          {lastBatch.length === 0 ? (
            <div className="empty-state">
              <Sparkles size={28} aria-hidden="true" />
              <p>No pulls yet</p>
            </div>
          ) : (
            <ol className="result-grid">
              {lastBatch.map((result) => (
                <li
                  className={`result-card rarity-${result.rarity} ${
                    result.featured ? 'featured' : ''
                  } ${result.imageUrl ? 'has-image' : ''}`}
                  key={result.id}
                >
                  {result.imageUrl && (
                    <img
                      className="result-image"
                      src={result.imageUrl}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.hidden = true
                      }}
                    />
                  )}
                  <span className="rarity-label">{result.rarity}-star</span>
                  <strong>{result.name}</strong>
                  <small>
                    #{result.number}
                    {result.rarity === 5
                      ? ` | pity ${result.pityAt} | ${formatPercent(result.chance)}`
                      : ''}
                    {result.guaranteed ? ' | guaranteed' : ''}
                  </small>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="panel history-panel" aria-labelledby="history-heading">
          <div className="panel-header">
            <Crown size={20} aria-hidden="true" />
            <h2 id="history-heading">History</h2>
            {totals.longestDry > 0 && (
              <span className="panel-count">Dry {totals.longestDry}</span>
            )}
          </div>

          {history.length === 0 ? (
            <div className="empty-state compact">
              <p>Session history is empty</p>
            </div>
          ) : (
            <div className="history-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pull</th>
                    <th>Rarity</th>
                    <th>Reward</th>
                    <th>Pity</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((result) => (
                    <tr key={result.id}>
                      <td>#{result.number}</td>
                      <td>{result.rarity}-star</td>
                      <td>{result.name}</td>
                      <td>{result.rarity === 5 ? result.pityAt : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
