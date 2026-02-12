import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { analyticsAPI } from '@/services/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react'

// Custom Pie Tooltip
const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload[0]) {
    const { name, value, color } = payload[0];
    return (
      <div 
        className="px-3 py-2 rounded border-2 bg-white font-semibold text-sm"
        style={{ borderColor: color }}
      >
        <span style={{ color }}>{name}: {value}</span>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: analyticsAPI.getDashboardMetrics,
  })

  const { data: trends } = useQuery({
    queryKey: ['trends', '7days'],
    queryFn: () => analyticsAPI.getTrends('7days'),
  })

  // DYNAMIC DATA HANDLER: 
  // This ensures the chart spreads out even if you only have 1 day of data

  const dynamicChartData = useMemo(() => {
    if (!trends?.data || trends.data.length === 0) return [];
    
    // Sort data by date just in case the API returns it out of order
    return [...trends.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [trends]);

  const pieData = useMemo(() => {
    if (!metrics) return [];
    return [
      { name: 'Successful', value: metrics.successful_validations, color: '#10b981' },
      { name: 'Failed', value: metrics.failed_validations, color: '#ef4444' },
    ];
  }, [metrics]);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Validations" 
          value={metrics?.total_validations ?? 0} 
          subtext={`${metrics?.validations_this_month ?? 0} this month`}
          icon={<Activity className="h-5 w-5 text-slate-400" />} 
        />
        <StatCard 
          title="Successful" 
          value={metrics?.successful_validations ?? 0} 
          subtext={`${(metrics?.success_rate ?? 0).toFixed(1)}% success rate`}
          icon={<CheckCircle className="h-5 w-5 text-emerald-500" />} 
        />
        <StatCard 
          title="Failed" 
          value={metrics?.failed_validations ?? 0} 
          subtext={`${metrics?.validations_this_week ?? 0} this week`}
          icon={<XCircle className="h-5 w-5 text-rose-500" />} 
        />
        <StatCard 
          title="Avg. Time" 
          value={`${(metrics?.average_execution_time ?? 0).toFixed(2)}s`} 
          subtext="Per validation"
          icon={<Clock className="h-5 w-5 text-slate-400" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Validation Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamicChartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  dy={10}
                  // FIX: This ensures dots spread out horizontally even with 1 data point
                  padding={{ left: 40, right: 40 }} 
                  minTickGap={30}
                  tickFormatter={(val) => {
                    if (!val) return '';
                    // FIX: Splits by dash, slash, or 'T' (ISO) to avoid "undefined" labels
                    const parts = val.split(/[-/T ]/);
                    if (parts.length >= 3) return `${parts[1]}/${parts[2]}`; // MM/DD
                    if (parts.length === 2) return `${parts[0]}/${parts[1]}`;
                    return val;
                  }}
                />
                
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                  allowDecimals={false}
                />
                
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }}
                  name="Total" 
                  connectNulls // Dynamic: bridges gaps if a day is missing data
                />
                <Line type="monotone" dataKey="successful" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} name="Successful" connectNulls />
                <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} name="Failed" connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donut Success Rate */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Success Rate</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={4} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Success</div>
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Failed</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtext, icon }: { title: string, value: string | number, subtext: string, icon: React.ReactNode }) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
            <p className="text-[11px] text-slate-400 mt-2 font-medium uppercase tracking-wider">{subtext}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}