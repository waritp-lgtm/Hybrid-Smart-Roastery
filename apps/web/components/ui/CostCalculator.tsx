'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface FlavorScores {
  sweet: number;
  sour: number;
  body: number;
  aroma: number;
  bitter: number;
}

interface CostCalculatorProps {
  bagPriceThb: number;
  bagWeightGram: number;
}

export function CostCalculator({ bagPriceThb, bagWeightGram }: CostCalculatorProps) {
  const t = useTranslations('b2b');
  const [doseGram, setDoseGram] = useState(18);
  const costPerCup = ((bagPriceThb / bagWeightGram) * doseGram).toFixed(2);

  return (
    <div className="cost-calculator">
      <h3>{t('cost_calculator')}</h3>
      <div className="slider-group">
        <label>
          {t('dose_label')}: <strong>{doseGram}g</strong>
        </label>
        <input
          type="range"
          min={12}
          max={25}
          step={0.5}
          value={doseGram}
          onChange={(e) => setDoseGram(Number(e.target.value))}
          className="dose-slider"
          aria-label="Coffee dose in grams"
        />
        <div className="dose-range">
          <span>12g</span><span>25g</span>
        </div>
      </div>
      <div className="cost-result">
        <span>{t('cost_per_cup')}</span>
        <strong className="cost-value">฿{costPerCup}</strong>
      </div>
    </div>
  );
}
