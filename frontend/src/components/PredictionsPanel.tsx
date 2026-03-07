import React, { useState, useEffect } from 'react';
import { predictionsAPI } from '../services/api';

interface Prediction {
  wardId?: number;
  wardName?: string;
  departmentId?: number;
  departmentName?: string;
  predictedComplaints: number;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  historicalAverage: number;
  trend: number;
}

interface PredictionsData {
  predictions: Prediction[];
  metadata: {
    periodDays: number;
    groupBy: string;
    totalComplaints: number;
    generatedAt: string;
    algorithm: string;
  };
}

const PredictionsPanel: React.FC<{ onWardFilter?: (wardId: number) => void }> = ({ onWardFilter }) => {
  const [predictionsData, setPredictionsData] = useState<PredictionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7);
  const [groupBy, setGroupBy] = useState<'ward' | 'department'>('ward');

  useEffect(() => {
    fetchPredictions();
  }, [days, groupBy]);

  const fetchPredictions = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await predictionsAPI.getPredictions({ days, groupBy });
      setPredictionsData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load predictions');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-rose-400 bg-rose-500/10 border border-rose-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
      case 'low': return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-800 border border-slate-700';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-emerald-400';
    if (confidence >= 0.6) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0.01) return '📈';
    if (trend < -0.01) return '📉';
    return '➡️';
  };

  const handleWardClick = (wardId: number) => {
    if (onWardFilter) {
      onWardFilter(wardId);
    }
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-slate-50 mb-4">Complaint Predictions</h3>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full blur-sm"></div>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
          <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">Loading Matrix...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-slate-50 mb-4">Complaint Predictions</h3>
        <div className="bg-rose-950/30 border border-rose-900/50 text-rose-400 px-4 py-3 rounded-2xl text-sm font-medium">
          {error}
        </div>
      </div>
    );
  }

  if (!predictionsData || predictionsData.predictions.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-slate-50 mb-4">Complaint Predictions</h3>
        <div className="bg-slate-950/30 border border-slate-800 text-slate-400 px-4 py-3 rounded-2xl text-sm italic">
          No predictions available. Insufficient telemetry data.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative">
        <h3 className="text-2xl font-bold text-slate-50 tracking-tight">Predictions Matrix</h3>
        <div className="flex space-x-3 w-full md:w-auto">
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="flex-1 md:flex-none px-4 py-2 text-sm bg-slate-950 border border-slate-700 text-slate-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none shadow-inner"
          >
            <option value={7} className="bg-slate-900 hover:bg-slate-800">7 Days</option>
            <option value={14} className="bg-slate-900 hover:bg-slate-800">14 Days</option>
            <option value={21} className="bg-slate-900 hover:bg-slate-800">21 Days</option>
            <option value={30} className="bg-slate-900 hover:bg-slate-800">30 Days</option>
          </select>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as 'ward' | 'department')}
            className="flex-1 md:flex-none px-4 py-2 text-sm bg-slate-950 border border-slate-700 text-slate-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none shadow-inner"
          >
            <option value="ward" className="bg-slate-900 hover:bg-slate-800">By Sector</option>
            <option value="department" className="bg-slate-900 hover:bg-slate-800">By Division</option>
          </select>
        </div>
      </div>

      <div className="mb-6 p-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl relative">
        <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
          <span>Engine: <span className="text-cyan-400">{predictionsData.metadata.algorithm}</span></span>
          <span>Nodes: <span className="text-cyan-400">{predictionsData.metadata.totalComplaints}</span> metrics</span>
        </div>
        <div className="text-xs text-slate-600 mt-2 font-mono">
          Snapshot: {new Date(predictionsData.metadata.generatedAt).toLocaleString()}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/20 mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase text-xs tracking-wider">
              <th className="text-left py-4 px-4 font-semibold">
                {groupBy === 'ward' ? 'Sector' : 'Division'}
              </th>
              <th className="text-right py-4 px-4 font-semibold tracking-wider">Predicted</th>
              <th className="text-right py-4 px-4 font-semibold tracking-wider">Historical Avg</th>
              <th className="text-center py-4 px-4 font-semibold tracking-wider">Trend</th>
              <th className="text-center py-4 px-4 font-semibold tracking-wider">Risk Level</th>
              <th className="text-center py-4 px-4 font-semibold tracking-wider">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {predictionsData.predictions.map((prediction, index) => (
              <tr 
                key={index} 
                className={`group hover:bg-slate-800/40 transition-colors ${prediction.wardId ? 'cursor-pointer' : ''}`}
                onClick={() => prediction.wardId && handleWardClick(prediction.wardId!)}
              >
                <td className="py-4 px-4 font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">
                  {prediction.wardName || prediction.departmentName}
                </td>
                <td className="text-right py-4 px-4">
                  <span className="font-bold text-slate-50 text-lg">{prediction.predictedComplaints}</span>
                </td>
                <td className="text-right py-4 px-4 text-slate-500 font-mono">
                  {prediction.historicalAverage.toFixed(1)}
                </td>
                <td className="text-center py-4 px-4">
                  <div className="flex items-center justify-center font-mono">
                    <span className="mr-2 text-sm">{getTrendIcon(prediction.trend)}</span>
                    <span className={prediction.trend > 0.01 ? 'text-rose-400' : prediction.trend < -0.01 ? 'text-emerald-400' : 'text-slate-500'}>
                      {formatPercentage(Math.abs(prediction.trend))}
                    </span>
                  </div>
                </td>
                <td className="text-center py-4 px-4">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest shadow-sm ${getRiskColor(prediction.risk)}`}>
                    {prediction.risk}
                  </span>
                </td>
                <td className="text-center py-4 px-4">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-slate-800 rounded-full h-1.5 mr-3 overflow-hidden border border-slate-700/50">
                      <div 
                        className="bg-cyan-500 h-full rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" 
                        style={{ width: `${prediction.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-mono font-bold ${getConfidenceColor(prediction.confidence)}`}>
                      {formatPercentage(prediction.confidence)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {predictionsData.predictions.some(p => p.wardId) && (
        <div className="mb-6 text-xs text-slate-500 text-center uppercase tracking-widest font-mono">
          &lt; Select a sector to cross-reference coordinates &gt;
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-inner">
          <div className="font-bold text-slate-400 uppercase tracking-widest mb-3 text-[10px]">Risk Indicators</div>
          <div className="space-y-2.5">
            <div className="flex items-center">
              <span className="flex items-center justify-center w-5 h-5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[10px] font-bold mr-3 shadow-inner">H</span>
              <span className="text-slate-300 font-medium">Critical: &gt;50% variance</span>
            </div>
            <div className="flex items-center">
              <span className="flex items-center justify-center w-5 h-5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px] font-bold mr-3 shadow-inner">M</span>
              <span className="text-slate-300 font-medium">Elevated: 20-50% variance</span>
            </div>
            <div className="flex items-center">
              <span className="flex items-center justify-center w-5 h-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold mr-3 shadow-inner">L</span>
              <span className="text-slate-300 font-medium">Stable: &lt;20% variance</span>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-inner">
          <div className="font-bold text-slate-400 uppercase tracking-widest mb-2 text-[10px]">Processing Model</div>
          <div className="text-slate-300 leading-relaxed font-medium">
            Applying rolling average coupled with linear regression mapping over temporal complaint matrices.
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-inner">
          <div className="font-bold text-slate-400 uppercase tracking-widest mb-2 text-[10px]">Confidence Metrics</div>
          <div className="text-slate-300 leading-relaxed font-medium">
            Weighting index derived from timeline consistency markers and structural data density.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionsPanel;
