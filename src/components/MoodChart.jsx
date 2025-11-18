import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const MoodChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg font-semibold">Evolução do Humor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 flex items-center justify-center">
            <p className="text-gray-400">Não há dados suficientes para exibir o gráfico.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-lg font-semibold">Evolução do Humor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: -10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="date" stroke="#A0AEC0" fontSize={12} />
              <YAxis domain={[0, 10]} stroke="#A0AEC0" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A202C',
                  borderColor: '#4A5568',
                  color: '#FFFFFF',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Line type="monotone" dataKey="Nível" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodChart;