import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface DataDashboardProps {
  stats: {
    tokens: number;
    totalTokens: number;
    repositories: number;
    maxRepositories: number;
  };
}

const DataDashboard: React.FC<DataDashboardProps> = ({ stats }) => {
  // Monthly token usage data
  const monthlyUsageData = [
    { name: 'Jan', tokens: 1200 },
    { name: 'Feb', tokens: 1900 },
    { name: 'Mar', tokens: 1500 },
    { name: 'Apr', tokens: 2800 },
    { name: 'May', tokens: 2100 },
    { name: 'Jun', tokens: 2400 },
    { name: 'Jul', tokens: stats.tokens },
  ];

  // Repository usage by type
  const repoTypeData = [
    { name: 'JavaScript', value: 40 },
    { name: 'TypeScript', value: 30 },
    { name: 'Python', value: 20 },
    { name: 'Other', value: 10 },
  ];

  // AI features usage data
  const aiUsageData = [
    { name: 'Documentation', docs: 65, insights: 40 },
    { name: 'Code Review', docs: 45, insights: 60 },
    { name: 'Refactoring', docs: 30, insights: 50 },
    { name: 'Testing', docs: 20, insights: 35 },
    { name: 'Debugging', docs: 35, insights: 45 },
  ];

  // Time saved over time
  const timeSavedData = [
    { name: 'Week 1', time: 2 },
    { name: 'Week 2', time: 3 },
    { name: 'Week 3', time: 3.5 },
    { name: 'Week 4', time: 5 },
    { name: 'Week 5', time: 7 },
    { name: 'Week 6', time: 6.5 },
    { name: 'Week 7', time: 8 },
  ];

  const COLORS = ['#8B5CF6', '#0EA5E9', '#F97316', '#D946EF'];

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-5"
    >
      {/* Monthly Token Consumption */}
      <div 
        className="bg-[#1A1A1A] p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4">Monthly Token Consumption</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyUsageData}>
              <defs>
                <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                tickLine={false}
                tick={{ fill: '#8E9196', fontSize: 12 }}
              />
              <YAxis 
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                tickLine={false}
                tick={{ fill: '#8E9196', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: '#8E9196' }}
              />
              <Area 
                type="monotone" 
                dataKey="tokens" 
                stroke="#8B5CF6" 
                fillOpacity={1} 
                fill="url(#tokenGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Repository Distribution */}
      <div 
        className="bg-[#1A1A1A] p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4">Repository Types</h3>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={repoTypeData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {repoTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: '#8E9196' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* AI Features Usage */}
      <div 
        className="bg-[#1A1A1A] p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4">AI Features Usage</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={aiUsageData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                tickLine={false}
                tick={{ fill: '#8E9196', fontSize: 12 }}
              />
              <YAxis 
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                tickLine={false}
                tick={{ fill: '#8E9196', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: '#8E9196' }}
              />
              <Legend 
                wrapperStyle={{ color: '#8E9196', fontSize: 12 }}
              />
              <Bar dataKey="docs" name="Documentation Generated" stackId="a" fill="#0EA5E9" />
              <Bar dataKey="insights" name="Insights Provided" stackId="a" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Time Saved */}
    <div 
        className="bg-[#1A1A1A] p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4">Time Saved (hours)</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSavedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                tickLine={false}
                tick={{ fill: '#8E9196', fontSize: 12 }}
              />
              <YAxis 
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                tickLine={false}
                tick={{ fill: '#8E9196', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: '#8E9196' }}
              />
              <Line 
                type="monotone" 
                dataKey="time" 
                stroke="#D946EF" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#D946EF', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#F97316' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DataDashboard;
