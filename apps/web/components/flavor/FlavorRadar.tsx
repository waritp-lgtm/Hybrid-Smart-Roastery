'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTranslations } from 'next-intl';

interface FlavorRadarProps {
  scores: {
    sweet: number;
    sour: number;
    body: number;
    aroma: number;
    bitter: number;
  };
}

export function FlavorRadar({ scores }: FlavorRadarProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('flavor');

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    chart.setOption({
      backgroundColor: 'transparent',
      radar: {
        indicator: [
          { name: t('sweet'), max: 5 },
          { name: t('aroma'), max: 5 },
          { name: t('sour'), max: 5 },
          { name: t('body'), max: 5 },
          { name: t('bitter'), max: 5 },
        ],
        radius: '65%',
        axisName: { color: '#8b7355', fontSize: 12, fontFamily: 'Sarabun, Inter, sans-serif' },
        splitLine: { lineStyle: { color: 'rgba(139, 115, 85, 0.2)' } },
        splitArea: { areaStyle: { color: ['rgba(139, 115, 85, 0.05)', 'transparent'] } },
        axisLine: { lineStyle: { color: 'rgba(139, 115, 85, 0.3)' } },
      },
      series: [{
        type: 'radar',
        data: [{
          value: [scores.sweet, scores.aroma, scores.sour, scores.body, scores.bitter],
          name: 'Flavor Profile',
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#c8963e', width: 2 },
          areaStyle: { color: 'rgba(200, 150, 62, 0.25)' },
          itemStyle: { color: '#c8963e' },
        }],
      }],
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    return () => { chart.dispose(); window.removeEventListener('resize', handleResize); };
  }, [scores, t]);

  return <div ref={chartRef} style={{ width: '100%', height: '280px' }} aria-label="Flavor radar chart" />;
}
