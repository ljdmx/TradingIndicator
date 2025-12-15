import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  ReferenceLine,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

interface ConceptChartProps {
  type: 'ema' | 'boll' | 'macd' | 'rsi' | 'vol' | 'ma' | 'supertrend' | 'kdj' | 'sar' | 'avl' | 'obv' | 'wr' | 'stochrsi';
  scenario?: 'bullish' | 'bearish' | 'consolidation' | 'divergence_bull' | 'divergence_bear' | 'squeeze' | 'breakout_up' | 'breakout_down' | 'support' | 'resistance' | 'reversal' | 'ride_upper' | 'overbought' | 'oversold' | 'resonance_bull' | 'resonance_bear' | 'refuse_death' | 'air_refuel';
}

const ConceptChart: React.FC<ConceptChartProps> = ({ type, scenario = 'bullish' }) => {
  
  // --- Data Generators ---

  const generateMAData = () => {
    const data = [];
    let price = 50;
    
    for (let i = 0; i < 60; i++) {
        if (scenario === 'bullish' || scenario === 'resonance_bull') {
            // Fan shape up
            price += i * 0.15 + Math.sin(i/5);
        } else if (scenario === 'bearish' || scenario === 'resonance_bear') {
            // Fan shape down
            price = 100 - i * 1.5 + Math.sin(i/5);
        } else if (scenario === 'consolidation') {
            // Entangled
            price = 50 + Math.sin(i/2) * 5;
        } else if (scenario === 'refuse_death') {
            // Approaching cross but bouncing up
            if(i < 30) price = 50 + i * 0.5; // Up
            else if (i < 45) price -= 0.5; // Dip
            else price += 1; // Resume up
        }

        let ma5, ma10, ma20;
        
        if (scenario === 'refuse_death') {
            ma5 = price * 0.98;
            ma10 = i > 30 && i < 45 ? price * 0.99 : price * 0.95; // Close but no touch
            ma20 = price * 0.90;
        } else {
            ma5 = scenario === 'consolidation' ? price + Math.sin(i)*2 : (scenario.includes('bear') ? price * 1.02 : price * 0.98);
            ma10 = scenario === 'consolidation' ? price + Math.cos(i)*2 : (scenario.includes('bear') ? price * 1.05 : price * 0.95);
            ma20 = scenario === 'consolidation' ? 50 : (scenario.includes('bear') ? price * 1.10 : price * 0.90);
        }

        data.push({
            name: i,
            price: price,
            ma5, ma10, ma20,
            ma60: scenario === 'consolidation' ? 50 : (scenario.includes('bear') ? price * 1.20 : price * 0.80),
        });
    }
    return data;
  };

  const generateMACDData = () => {
    const data = [];
    const len = 60;
    
    for(let i=0; i<len; i++) {
        let price = 100;
        let dif = 0;

        if (scenario === 'divergence_bull') {
            const t = i / len;
            price = 80 - t * 20 + Math.sin(i/3)*5; 
            dif = -5 + t * 8 + Math.sin(i/3)*2;
        } else if (scenario === 'divergence_bear') {
             const t = i / len;
             price = 100 + t * 30 + Math.sin(i/3)*5;
             dif = 8 - t * 10 + Math.sin(i/3)*2;
        } else if (scenario === 'bullish' || scenario === 'resonance_bull') {
            dif = -5 + (i/len) * 12;
        } else if (scenario === 'air_refuel') {
             // Up, dip to zero, up again
             if (i < 20) dif = i * 0.2;
             else if (i < 40) dif = 4 - (i-20)*0.2; // Dip to near 0
             else dif = (i-40)*0.3; // Up again
        } else {
            dif = 5 - (i/len) * 12;
        }

        const dea = scenario === 'air_refuel' ? (i > 35 && i < 45 ? dif - 0.1 : dif * 0.8) : dif * 0.8;
        
        data.push({
            name: i,
            price: price, 
            macd: dif,
            signal: dea,
            hist: (dif - dea) * 1.5 
        })
    }
    return data;
  }

  const generateSARData = () => {
      const data = [];
      let price = 50;
      let trend = scenario === 'bullish' ? 1 : -1;
      
      for(let i=0; i<50; i++) {
          if (scenario === 'reversal' && i > 25) trend = trend * -1;
          
          if (trend === 1) price += 1 + Math.random();
          else price -= 1 + Math.random();

          data.push({
              name: i,
              price: price,
              sar: trend === 1 ? price - 5 : price + 5
          })
      }
      return data;
  }

  const generateAVLData = () => {
      const data = [];
      let price = 50;
      for(let i=0; i<50; i++) {
           if (scenario === 'bullish' || scenario === 'support') {
               price += 0.5 + Math.sin(i/3);
               if (scenario === 'support' && i === 25) price -= 3; // Dip to support
           } else {
               price -= 0.5 + Math.sin(i/3);
           }
           data.push({
               name: i,
               price: price,
               avl: scenario === 'bullish' || scenario === 'support' ? price - 2 : price + 2
           })
      }
      return data;
  }
  
  const generateEMAData = () => {
      const data = [];
      let price = 50;
      for(let i=0; i<50; i++) {
          if (scenario === 'bullish') price += 1 + Math.sin(i/4);
          else if (scenario === 'breakout_down') {
             if (i < 25) price += 0.5;
             else price -= 2; // Break down
          } else if (scenario === 'air_refuel') {
             // Up, touch, up
             price += 0.5;
             if (i > 20 && i < 30) price -= 0.8;
          }
          data.push({
              name: i,
              price: price,
              ema: scenario === 'breakout_down' && i > 25 ? price + 5 : price - 2
          })
      }
      return data;
  }

  const generateBollData = () => {
    const data = [];
    let price = 100;
    for (let i = 0; i < 60; i++) {
        let volatility = 5;
        
        if (scenario === 'squeeze') {
            volatility = 1.5;
            price = 100 + Math.sin(i) * 2;
        } else if (scenario === 'ride_upper' || scenario === 'breakout_up') {
            volatility = i > 30 ? 8 : 2;
            price += i > 30 ? 2 : Math.sin(i);
        }

        const baseUpper = price + volatility;
        const finalUpper = scenario === 'ride_upper' ? price + 1 : baseUpper;

        data.push({
            name: i,
            price: price,
            upper: finalUpper,
            lower: price - volatility,
        });
    }
    return data;
  }

  const generateSuperTrendData = () => {
    const data = [];
    let price = 100;
    let trend = 1; 
    
    for (let i = 0; i < 60; i++) {
        if (scenario === 'reversal' && i > 30) trend = -1;
        
        if (trend === 1) price += 0.5 + Math.random();
        else price -= 1 + Math.random();
        
        const stValue = trend === 1 ? price - 5 : price + 5;

        data.push({
            name: i,
            price: price,
            st_up: trend === 1 ? stValue : null,
            st_down: trend === -1 ? stValue : null,
        });
    }
    return data;
  };

  const generateVolData = () => {
      const data = [];
      let price = 50;
      for(let i=0; i<50; i++) {
          const isUp = i > 25 ? (scenario === 'breakout_up') : (Math.random() > 0.5);
          const change = isUp ? 2 : -1.5;
          price += change;
          
          let vol = 200 + Math.random() * 300;
          if (i > 25 && scenario === 'breakout_up') vol += 800;
          if (i > 25 && scenario === 'breakout_down') vol -= 100; // Low vol breakout (fake)
          
          data.push({
              name: i,
              price: price,
              vol: vol,
              isUp: isUp
          })
      }
      return data;
  }

  const generateOBVData = () => {
      const data = [];
      let obv = 1000;
      let price = 50;
      for(let i=0; i<50; i++) {
          price += 1;
          if (scenario === 'bullish') obv += 50 + Math.random()*20;
          if (scenario === 'divergence_bear') obv -= 20; // Price up, OBV down
          
          data.push({
              name: i,
              price: price,
              obv: obv
          })
      }
      return data;
  }
  
  const generateOscillatorData = (type: 'rsi' | 'wr' | 'kdj' | 'stochrsi') => {
      const data = [];
      for(let i=0; i<50; i++) {
          let val = 50;
          if (scenario === 'overbought' || type === 'wr' && scenario === 'oversold') val = type === 'wr' ? -90 : 85;
          else if (scenario === 'bullish') val = 40 + i;
          else if (scenario === 'divergence_bear') val = 80 - i*0.5; // Price likely up
          else if (scenario === 'resonance_bull') val = 30 + i * 1.5;
          
          // Noise
          val += Math.sin(i)*5;
          
          data.push({
              name: i,
              val: val,
              k: val,
              d: val - 5,
              j: val + 5
          })
      }
      return data;
  }

  // --- Render Logic ---

  const renderChart = () => {
    const commonGrid = <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />;
    const commonTooltip = <Tooltip 
        contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} 
        itemStyle={{ fontSize: '12px' }}
        labelStyle={{ display: 'none' }}
    />;

    switch (type) {
      case 'ma':
        const maData = generateMAData();
        return (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={maData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              {commonGrid}
              <XAxis hide />
              <YAxis hide domain={['auto', 'auto']} />
              {commonTooltip}
              <Line type="monotone" dataKey="price" stroke="#9ca3af" strokeWidth={1} dot={false} name="价格" />
              <Line type="monotone" dataKey="ma5" stroke="#fbbf24" strokeWidth={2} dot={false} name="MA5" />
              <Line type="monotone" dataKey="ma10" stroke="#f472b6" strokeWidth={2} dot={false} name="MA10" />
              <Line type="monotone" dataKey="ma20" stroke="#60a5fa" strokeWidth={2} dot={false} name="MA20" />
              <Line type="monotone" dataKey="ma60" stroke="#a78bfa" strokeWidth={2} dot={false} name="MA60" />
              {scenario === 'refuse_death' && <ReferenceLine x={40} stroke="green" label="拒绝死叉" />}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'ema':
          const emaData = generateEMAData();
          return (
             <ResponsiveContainer width="100%" height={260}>
                <LineChart data={emaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    {commonGrid}
                    <XAxis hide />
                    <YAxis hide domain={['auto', 'auto']} />
                    {commonTooltip}
                    <Line type="monotone" dataKey="price" stroke="#fff" strokeWidth={2} dot={false} name="价格" />
                    <Line type="monotone" dataKey="ema" stroke="#facc15" strokeWidth={2} dot={false} name="EMA" />
                    {scenario === 'breakout_down' && <ReferenceLine x={25} stroke="red" label="跌破" />}
                    {scenario === 'air_refuel' && <ReferenceLine x={25} stroke="green" label="回踩不破" />}
                </LineChart>
             </ResponsiveContainer>
          );

      case 'boll':
        const bollData = generateBollData();
        return (
            <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={bollData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              {commonGrid}
              <XAxis hide />
              <YAxis hide domain={['auto', 'auto']} />
              {commonTooltip}
              <Area type="monotone" dataKey="upper" stroke="none" fill="#60a5fa" fillOpacity={0.1} />
              <Area type="monotone" dataKey="lower" stroke="none" fill="#60a5fa" fillOpacity={0.1} />
              <Line type="monotone" dataKey="upper" stroke="#60a5fa" strokeOpacity={0.5} dot={false} name="上轨" />
              <Line type="monotone" dataKey="lower" stroke="#60a5fa" strokeOpacity={0.5} dot={false} name="下轨" />
              <Line type="monotone" dataKey="price" stroke="#fff" strokeWidth={2} dot={false} name="价格" />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'macd':
          const macdData = generateMACDData();
          return (
            <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={macdData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {commonGrid}
                <XAxis hide />
                <YAxis hide domain={['auto', 'auto']} />
                {commonTooltip}
                <Bar dataKey="hist" name="动能柱" barSize={4}>
                  {macdData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hist > 0 ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="macd" stroke="#facc15" dot={false} strokeWidth={2} name="DIF" />
                <Line type="monotone" dataKey="signal" stroke="#f472b6" dot={false} strokeWidth={2} name="DEA" />
                <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />
                {scenario === 'air_refuel' && <ReferenceLine x={35} stroke="yellow" label="空中加油" />}
            </ComposedChart>
            </ResponsiveContainer>
          );
      
      case 'sar':
          const sarData = generateSARData();
           return (
            <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={sarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              {commonGrid}
              <XAxis hide />
              <YAxis hide domain={['auto', 'auto']} />
              {commonTooltip}
              <Line type="monotone" dataKey="price" stroke="#fff" strokeWidth={2} dot={false} name="价格" />
              <Scatter name="SAR" dataKey="sar" fill={scenario === 'bullish' ? '#22c55e' : '#facc15'} shape="circle" />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'avl':
          const avlData = generateAVLData();
           return (
            <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={avlData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              {commonGrid}
              <XAxis hide />
              <YAxis hide domain={['auto', 'auto']} />
              {commonTooltip}
              <Line type="monotone" dataKey="price" stroke="#fff" strokeWidth={2} dot={false} name="价格" />
              <Line type="monotone" dataKey="avl" stroke="#facc15" strokeWidth={2} dot={false} name="均价线(AVL)" />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'supertrend':
        const stData = generateSuperTrendData();
        return (
            <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={stData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              {commonGrid}
              <XAxis hide />
              <YAxis hide domain={['auto', 'auto']} />
              {commonTooltip}
              <Line type="monotone" dataKey="price" stroke="#fff" strokeWidth={2} dot={false} name="价格" />
              <Line type="step" dataKey="st_up" stroke="#22c55e" strokeWidth={3} dot={false} name="做多止损" connectNulls={false} />
              <Line type="step" dataKey="st_down" stroke="#ef4444" strokeWidth={3} dot={false} name="做空止损" connectNulls={false} />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      case 'obv':
          const obvData = generateOBVData();
          return (
             <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={obvData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    {commonGrid}
                    <XAxis hide />
                    <YAxis yAxisId="left" hide domain={['auto', 'auto']} />
                    <YAxis yAxisId="right" hide orientation="right" domain={['auto', 'auto']} />
                    {commonTooltip}
                    <Line yAxisId="left" type="monotone" dataKey="price" stroke="#fff" strokeWidth={1} dot={false} name="价格" opacity={0.5} />
                    <Line yAxisId="right" type="monotone" dataKey="obv" stroke="#facc15" strokeWidth={2} dot={false} name="OBV" />
                </ComposedChart>
            </ResponsiveContainer> 
          )

      case 'vol':
          const volData = generateVolData();
          return (
             <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={volData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    {commonGrid}
                    <XAxis hide />
                    <YAxis yAxisId="left" hide domain={['auto', 'auto']} />
                    <YAxis yAxisId="right" hide orientation="right" />
                    {commonTooltip}
                    <Line yAxisId="left" type="monotone" dataKey="price" stroke="#fff" strokeWidth={2} dot={false} name="价格" />
                    <Bar yAxisId="right" dataKey="vol" name="成交量" barSize={4}>
                         {volData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isUp ? '#22c55e' : '#ef4444'} opacity={0.5} />
                          ))}
                    </Bar>
                </ComposedChart>
            </ResponsiveContainer> 
          )
      
      case 'rsi':
      case 'wr':
      case 'stochrsi':
      case 'kdj':
          const oscData = generateOscillatorData(type);
          const isWr = type === 'wr';
          return (
             <ResponsiveContainer width="100%" height={260}>
                <LineChart data={oscData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    {commonGrid}
                    <XAxis hide />
                    <YAxis domain={isWr ? [-100, 0] : [0, 100]} hide />
                    {commonTooltip}
                    <ReferenceLine y={isWr ? -20 : 80} stroke="#ef4444" strokeDasharray="3 3" />
                    <ReferenceLine y={isWr ? -80 : 20} stroke="#22c55e" strokeDasharray="3 3" />
                    
                    {type === 'kdj' ? (
                        <>
                           <Line type="monotone" dataKey="k" stroke="#fff" strokeWidth={1} dot={false} name="K" />
                           <Line type="monotone" dataKey="d" stroke="#facc15" strokeWidth={1} dot={false} name="D" />
                           <Line type="monotone" dataKey="j" stroke="#a78bfa" strokeWidth={2} dot={false} name="J" />
                        </>
                    ) : (
                        <Line type="monotone" dataKey="val" stroke="#818cf8" strokeWidth={2} dot={false} name={type.toUpperCase()} />
                    )}
                </LineChart>
            </ResponsiveContainer>
          )

      default:
        return <div className="h-64 flex items-center justify-center text-gray-500 text-sm">此指标图表正在生成中...</div>;
    }
  };

  const getScenarioLabel = () => {
      const map: Record<string, string> = {
          'bullish': '多头趋势 / 金叉',
          'bearish': '空头趋势 / 死叉',
          'consolidation': '震荡 / 缠绕',
          'divergence_bull': '底背离 (看涨)',
          'divergence_bear': '顶背离 (看跌)',
          'squeeze': '收口 (变盘前)',
          'breakout_up': '放量突破 (看涨)',
          'breakout_down': '跌破支撑 (看跌)',
          'support': '回踩支撑',
          'resistance': '遇阻回落',
          'reversal': '趋势反转',
          'ride_upper': '贴上轨运行 (强势)',
          'overbought': '超买区',
          'oversold': '超卖区',
          'resonance_bull': '多头共振 (强买入)',
          'resonance_bear': '空头共振 (强卖出)',
          'refuse_death': '拒绝死叉 (强中强)',
          'air_refuel': '空中加油 (中继)',
      }
      return map[scenario] || scenario.toUpperCase();
  }

  return (
    <div className="bg-gray-950 rounded-xl p-4 border border-gray-800 my-6 shadow-xl ring-1 ring-gray-800/50">
      <div className="mb-4 flex items-center justify-between border-b border-gray-900 pb-2">
        <div className="flex items-center space-x-2">
           <div className={`w-2 h-2 rounded-full ${scenario.includes('bull') || scenario.includes('up') ? 'bg-green-500' : (scenario.includes('bear') || scenario.includes('down') ? 'bg-red-500' : 'bg-yellow-500')}`}></div>
           <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">
            {type.toUpperCase()} • {getScenarioLabel()}
           </div>
        </div>
        <div className="text-[10px] text-gray-600 bg-gray-900 px-2 py-1 rounded font-mono">
            SIMULATION
        </div>
      </div>
      {renderChart()}
    </div>
  );
};

export default ConceptChart;