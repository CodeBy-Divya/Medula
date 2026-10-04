'use client'

// ─── UNDERSTAND · living-scene registry ───
// Scene files are independent; the view only ever talks to this map.

import type { ComponentType } from 'react'
import type { SceneProps } from './scene-contract'
import { HeartScene } from './scene-heart'
import { EcgScene } from './scene-ecg'
import { NephronScene } from './scene-nephron'
import { AlveolusScene } from './scene-alveolus'
import { NeuronScene } from './scene-neuron'
import { GastricScene } from './scene-gastric'

export type SceneId = 'heart' | 'nephron' | 'alveolus' | 'neuron' | 'gastric' | 'ecg'

export const LIVE_SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  heart: HeartScene,
  ecg: EcgScene,
  nephron: NephronScene,
  alveolus: AlveolusScene,
  neuron: NeuronScene,
  gastric: GastricScene,
}
