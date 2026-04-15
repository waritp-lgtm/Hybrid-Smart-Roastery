'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface FlavorWheelProps {
  flavorNotes: Record<string, any>; // SCA Wheel JSON structure
}

// SCA Flavor Wheel color mapping (matches the official wheel)
const SCA_COLORS: Record<string, string> = {
  fruity: '#e74c3c',
  floral: '#e91e63',
  sweet: '#ff9800',
  nutty: '#795548',
  spices: '#f44336',
  roasted: '#4e342e',
  other: '#607d8b',
  sour: '#cddc39',
  fermented: '#8bc34a',
  green: '#4caf50',
  chemical: '#00bcd4',
};

function buildSunburstData(notes: Record<string, any>): any[] {
  return Object.entries(notes).map(([category, sub]) => {
    const color = SCA_COLORS[category.toLowerCase()] ?? '#90a4ae';
    if (typeof sub === 'object' && !Array.isArray(sub)) {
      return {
        name: category,
        itemStyle: { color },
        children: Object.entries(sub).map(([subCat, items]) => ({
          name: subCat,
          itemStyle: { color: color + 'cc' },
          children: (Array.isArray(items) ? items : [items]).map((item: string) => ({
            name: item,
            value: 1,
            itemStyle: { color: color + '88' },
          })),
        })),
      };
    }
    const items = Array.isArray(sub) ? sub : [sub];
    return {
      name: category,
      itemStyle: { color },
      children: items.map((item: string) => ({
        name: item,
        value: 1,
        itemStyle: { color: color + '88' },
      })),
    };
  });
}

export function FlavorWheel({ flavorNotes }: FlavorWheelProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => params.name,
      },
      series: [{
        type: 'sunburst',
        data: buildSunburstData(flavorNotes),
        radius: ['15%', '90%'],
        label: {
          fontSize: 11,
          fontFamily: 'Inter, Sarabun, sans-serif',
          color: '#fff',
          textShadowBlur: 3,
          textShadowColor: 'rgba(0,0,0,0.5)',
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff',
        },
        emphasis: {
          focus: 'ancestor',
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' },
        },
        levels: [
          {},
          { r0: '15%', r: '40%', label: { align: 'right', rotate: 'radial' } },
          { r0: '40%', r: '65%', label: { align: 'right' } },
          { r0: '65%', r: '90%', label: { position: 'outside', padding: 3, silent: false } },
        ],
      }],
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    return () => { chart.dispose(); window.removeEventListener('resize', handleResize); };
  }, [flavorNotes]);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '400px' }} aria-label="SCA Flavor Wheel sunburst chart" />
  );
}
