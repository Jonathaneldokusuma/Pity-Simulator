export type WuwaBannerRecord = {
  id: string
  version: string
  phase: number
  featuredName: string
  imageUrl: string
}

const characterAsset = (name: string) => `https://raw.githubusercontent.com/ryanbenson/wuthering-waves-assets/master/images/${name}.png`
const weaponAsset = (name: string) => `https://raw.githubusercontent.com/ryanbenson/wuthering-waves-assets/master/images/weapons/${name}.png`

export const wuwaCharacterRecords: WuwaBannerRecord[] = [
  { id: 'wuwa-character-1-0-p1-jiyan', version: '1.0', phase: 1, featuredName: 'Jiyan', imageUrl: characterAsset('Jiyan') },
  { id: 'wuwa-character-1-0-p2-yinlin', version: '1.0', phase: 2, featuredName: 'Yinlin', imageUrl: characterAsset('Yinlin') },
  { id: 'wuwa-character-1-1-p1-jinhsi', version: '1.1', phase: 1, featuredName: 'Jinhsi', imageUrl: characterAsset('Jinhsi') },
  { id: 'wuwa-character-1-1-p2-changli', version: '1.1', phase: 2, featuredName: 'Changli', imageUrl: characterAsset('Changli') },
  { id: 'wuwa-character-1-2-p1-zhezhi', version: '1.2', phase: 1, featuredName: 'Zhezhi', imageUrl: characterAsset('Zhezhi') },
  { id: 'wuwa-character-1-2-p2-xiangli-yao', version: '1.2', phase: 2, featuredName: 'Xiangli Yao', imageUrl: characterAsset('XiangliYao') },
  { id: 'wuwa-character-1-3-p1-shorekeeper', version: '1.3', phase: 1, featuredName: 'Shorekeeper', imageUrl: characterAsset('Shorekeeper') },
  { id: 'wuwa-character-1-3-p2-jiyan', version: '1.3', phase: 2, featuredName: 'Jiyan', imageUrl: characterAsset('Jiyan') },
  { id: 'wuwa-character-1-4-p1-camellya', version: '1.4', phase: 1, featuredName: 'Camellya', imageUrl: characterAsset('Camellya') },
  { id: 'wuwa-character-1-4-p2-yinlin', version: '1.4', phase: 2, featuredName: 'Yinlin', imageUrl: characterAsset('Yinlin') },
  { id: 'wuwa-character-2-0-p1-carlotta', version: '2.0', phase: 1, featuredName: 'Carlotta', imageUrl: characterAsset('Carlotta') },
  { id: 'wuwa-character-2-0-p2-roccia', version: '2.0', phase: 2, featuredName: 'Roccia', imageUrl: characterAsset('Roccia') },
  { id: 'wuwa-character-2-1-p1-phoebe', version: '2.1', phase: 1, featuredName: 'Phoebe', imageUrl: characterAsset('Phoebe') },
  { id: 'wuwa-character-2-1-p2-brant', version: '2.1', phase: 2, featuredName: 'Brant', imageUrl: characterAsset('Brant') },
  { id: 'wuwa-character-2-2-p1-cantarella', version: '2.2', phase: 1, featuredName: 'Cantarella', imageUrl: characterAsset('Cantarella') },
  { id: 'wuwa-character-2-2-p2-shorekeeper', version: '2.2', phase: 2, featuredName: 'Shorekeeper', imageUrl: characterAsset('Shorekeeper') },
  { id: 'wuwa-character-2-3-p1-zani', version: '2.3', phase: 1, featuredName: 'Zani', imageUrl: characterAsset('Zani') },
  { id: 'wuwa-character-2-3-p2-ciaccona', version: '2.3', phase: 2, featuredName: 'Ciaccona', imageUrl: characterAsset('Ciaccona') },
  { id: 'wuwa-character-2-4-p1-cartethyia', version: '2.4', phase: 1, featuredName: 'Cartethyia', imageUrl: characterAsset('Cartethyia') },
  { id: 'wuwa-character-2-4-p2-lupa', version: '2.4', phase: 2, featuredName: 'Lupa', imageUrl: characterAsset('Lupa') },
  { id: 'wuwa-character-2-5-p1-phrolova', version: '2.5', phase: 1, featuredName: 'Phrolova', imageUrl: characterAsset('Phrolova') },
  { id: 'wuwa-character-2-5-p2-cantarella', version: '2.5', phase: 2, featuredName: 'Cantarella', imageUrl: characterAsset('Cantarella') },
  { id: 'wuwa-character-2-6-p1-augusta', version: '2.6', phase: 1, featuredName: 'Augusta', imageUrl: characterAsset('Augusta') },
  { id: 'wuwa-character-2-6-p2-iuno', version: '2.6', phase: 2, featuredName: 'Iuno', imageUrl: characterAsset('Iuno') },
  { id: 'wuwa-character-2-7-p1-galbrena', version: '2.7', phase: 1, featuredName: 'Galbrena', imageUrl: characterAsset('Galbrena') },
  { id: 'wuwa-character-2-7-p2-qiuyuan', version: '2.7', phase: 2, featuredName: 'Qiuyuan', imageUrl: characterAsset('Qiuyuan') },
  { id: 'wuwa-character-2-8-p1-chisa', version: '2.8', phase: 1, featuredName: 'Chisa', imageUrl: characterAsset('Chisa') },
  { id: 'wuwa-character-2-8-p2-phrolova', version: '2.8', phase: 2, featuredName: 'Phrolova', imageUrl: characterAsset('Phrolova') },
  { id: 'wuwa-character-3-0-p1-lynae', version: '3.0', phase: 1, featuredName: 'Lynae', imageUrl: characterAsset('Lynae') },
  { id: 'wuwa-character-3-0-p2-mornye', version: '3.0', phase: 2, featuredName: 'Mornye', imageUrl: characterAsset('Mornye') },
  { id: 'wuwa-character-3-1-p1-aemeath', version: '3.1', phase: 1, featuredName: 'Aemeath', imageUrl: characterAsset('Aemeath') },
  { id: 'wuwa-character-3-2-p1-sigrika', version: '3.2', phase: 1, featuredName: 'Sigrika', imageUrl: characterAsset('Sigrika') },
  { id: 'wuwa-character-3-2-p2-lynae', version: '3.2', phase: 2, featuredName: 'Lynae', imageUrl: characterAsset('Lynae') },
  { id: 'wuwa-character-3-2-p2-zani', version: '3.2', phase: 2, featuredName: 'Zani', imageUrl: characterAsset('Zani') },
  { id: 'wuwa-character-3-2-p2-phoebe', version: '3.2', phase: 2, featuredName: 'Phoebe', imageUrl: characterAsset('Phoebe') },
  { id: 'wuwa-character-3-3-p1-hiyuki', version: '3.3', phase: 1, featuredName: 'Hiyuki', imageUrl: characterAsset('Hiyuki') },
  { id: 'wuwa-character-3-3-p1-mornye', version: '3.3', phase: 1, featuredName: 'Mornye', imageUrl: characterAsset('Mornye') },
  { id: 'wuwa-character-3-3-p1-iuno', version: '3.3', phase: 1, featuredName: 'Iuno', imageUrl: characterAsset('Iuno') },
  { id: 'wuwa-character-3-3-p2-denia', version: '3.3', phase: 2, featuredName: 'Denia', imageUrl: characterAsset('Denia') },
  { id: 'wuwa-character-3-3-p2-chisa', version: '3.3', phase: 2, featuredName: 'Chisa', imageUrl: characterAsset('Chisa') },
  { id: 'wuwa-character-3-3-p2-phrolova', version: '3.3', phase: 2, featuredName: 'Phrolova', imageUrl: characterAsset('Phrolova') },
]

export const wuwaWeaponRecords: WuwaBannerRecord[] = [
  { id: 'wuwa-weapon-1-0-p1-verdant-summit', version: '1.0', phase: 1, featuredName: 'Verdant Summit', imageUrl: weaponAsset('VerdantSummit') },
  { id: 'wuwa-weapon-1-0-p2-stringmaster', version: '1.0', phase: 2, featuredName: 'Stringmaster', imageUrl: weaponAsset('Stringmaster') },
  { id: 'wuwa-weapon-1-1-p1-ages-of-harvest', version: '1.1', phase: 1, featuredName: 'Ages of Harvest', imageUrl: weaponAsset('AgesOfHarvest') },
  { id: 'wuwa-weapon-1-1-p2-blazing-brilliance', version: '1.1', phase: 2, featuredName: 'Blazing Brilliance', imageUrl: weaponAsset('BlazingBrilliance') },
  { id: 'wuwa-weapon-1-2-p1-rime-draped-sprouts', version: '1.2', phase: 1, featuredName: 'Rime-Draped Sprouts', imageUrl: weaponAsset('RimeDrapedSprouts') },
  { id: 'wuwa-weapon-1-2-p2-veritys-handle', version: '1.2', phase: 2, featuredName: "Verity's Handle", imageUrl: weaponAsset('VeritysHandle') },
  { id: 'wuwa-weapon-1-3-p1-stellar-symphony', version: '1.3', phase: 1, featuredName: 'Stellar Symphony', imageUrl: weaponAsset('StellarSymphony') },
  { id: 'wuwa-weapon-1-4-p1-red-spring', version: '1.4', phase: 1, featuredName: 'Red Spring', imageUrl: weaponAsset('RedSpring') },
  { id: 'wuwa-weapon-2-0-p1-the-last-dance', version: '2.0', phase: 1, featuredName: 'The Last Dance', imageUrl: weaponAsset('TheLastDance') },
  { id: 'wuwa-weapon-2-0-p2-tragicomedy', version: '2.0', phase: 2, featuredName: 'Tragicomedy', imageUrl: weaponAsset('Tragicomedy') },
  { id: 'wuwa-weapon-2-6-p1-radiance-cleaver', version: '2.6', phase: 1, featuredName: 'Radiance Cleaver', imageUrl: weaponAsset('RadianceCleaver') },
  { id: 'wuwa-weapon-2-8-p1-spectrum-blaster', version: '2.8', phase: 1, featuredName: 'Spectrum Blaster', imageUrl: weaponAsset('SpectrumBlaster') },
]
