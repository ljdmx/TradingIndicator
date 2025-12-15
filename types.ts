import { LucideIcon } from 'lucide-react';

export interface SectionContent {
  title: string;
  type: 'concept' | 'case-study' | 'real-world' | 'tips' | 'list' | 'process' | 'discipline';
  content: string | string[];
  // For Real World cases
  asset?: string; 
  date?: string;
  // Chart configs
  chartType?: 'ema' | 'boll' | 'macd' | 'rsi' | 'vol' | 'ma' | 'supertrend' | 'kdj' | 'sar' | 'avl' | 'obv' | 'wr' | 'stochrsi';
  chartScenario?: 'bullish' | 'bearish' | 'consolidation' | 'divergence_bull' | 'divergence_bear' | 'squeeze' | 'breakout_up' | 'breakout_down' | 'support' | 'resistance' | 'reversal' | 'ride_upper' | 'overbought' | 'oversold' | 'resonance_bull' | 'resonance_bear' | 'refuse_death' | 'air_refuel';
}

export interface Module {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  description: string;
  sections: SectionContent[];
}

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}