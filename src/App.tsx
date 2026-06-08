import { useMemo, useState } from 'react'
import type { CSSProperties, SyntheticEvent } from 'react'
import {
  BarChart3,
  Copy,
  Crown,
  Dice5,
  RotateCcw,
  Settings2,
  Sparkles,
  Target,
  Ticket,
  WandSparkles,
  Zap,
} from 'lucide-react'
import './App.css'

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
}

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
    threeStarPool: ['Traveler gear', 'Slingshot', 'Magic Guide', 'Sharpshooter\'s Oath', 'Black Tassel'],
    imageUrl: '',
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
    imageUrl: '',
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
    imageUrl: '',
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
    imageUrl: '',
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
  imageUrl: '',
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

  const activeRules = useMemo(() => normalizeRules(rules), [rules])
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
  }

  function selectCustomPreset() {
    setSelectedPresetId('custom')
    setRules((current) => (current.id === 'custom' ? current : copyRules(customPreset)))
    resetSession()
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

        batch.push({
          id: resultId(pullNumber),
          number: pullNumber,
          rarity: 5,
          name: wonFeatured
            ? pickRewardName(runRules.featuredPool, runRules.featuredName)
            : pickRewardName(runRules.offBannerPool, runRules.offBannerName),
          featured: wonFeatured,
          pityAt,
          chance: fiveChance,
          guaranteed: wasGuaranteed,
          imageUrl: runRules.imageUrl,
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
        batch.push({
          id: resultId(pullNumber),
          number: pullNumber,
          rarity: 4,
          name: pickRewardName(runRules.fourStarPool, '4-star reward'),
          featured: false,
          pityAt: nextPity4 + 1,
          chance: fourChance,
          guaranteed: false,
          imageUrl: '',
        })

        nextTotals.fourStars += 1
        nextPity4 = 0
      } else {
        batch.push({
          id: resultId(pullNumber),
          number: pullNumber,
          rarity: 3,
          name: pickRewardName(runRules.threeStarPool, '3-star reward'),
          featured: false,
          pityAt: 0,
          chance: 0,
          guaranteed: false,
          imageUrl: '',
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
          <img className="brand-mark" src="/summon-prism.svg" alt="" />
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
            <div className="summon-stage">
              <div className="summon-art-wrap">
                <div className="banner-badge">{activeRules.bannerKind}</div>
                <img
                  className="summon-art"
                  src={activeImageUrl}
                  alt=""
                data-character={activeRules.imageUrl ? 'true' : 'false'}
                onError={handleImageFallback}
              />
            </div>

            <div className="summon-copy">
              <p className="eyebrow">{activeRules.game}</p>
              <h2 id="summon-heading">{activeRules.banner}</h2>
              <p className="banner-face">Spotlight: {activeBannerFace}</p>
              <div className="target-line">
                <Target size={18} aria-hidden="true" />
                <span>{activeRules.featuredName}</span>
              </div>
            </div>
          </div>

          <div className="pull-actions">
            <button className="button primary" type="button" onClick={() => performPulls(1)}>
              <Sparkles size={18} aria-hidden="true" />
              1 Pull
            </button>
            <button className="button primary" type="button" onClick={() => performPulls(10)}>
              <Dice5 size={18} aria-hidden="true" />
              10 Pulls
            </button>
            <button className="button accent" type="button" onClick={() => performPulls(1, true)}>
              <WandSparkles size={18} aria-hidden="true" />
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
            <Zap size={18} aria-hidden="true" />
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
