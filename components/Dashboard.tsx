
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LabExam } from '../types';

interface DashboardProps {
  exams: LabExam[];
}

const Dashboard: React.FC<DashboardProps> = ({ exams }) => {
  const chartData = useMemo(() => {
    if (!exams || exams.length === 0) return [];

    // Agrupa exames por nome
    const grouped = exams.reduce((acc, exam) => {
      if (!acc[exam.examName]) acc[exam.examName] = [];
      acc[exam.examName].push(exam);
      return acc;
    }, {} as Record<string, LabExam[]>);

    // Encontra o exame mais frequente
    const sortedNames = Object.keys(grouped).sort((a, b) => grouped[b].length - grouped[a].length);
    const mostFrequent = sortedNames[0];

    if (!mostFrequent) return [];

    return grouped[mostFrequent]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(e => ({
        date: new Date(e.date + "T00:00:00").toLocaleDateString('pt-BR'),
        valor: e.value,
        nome: e.examName
      }));
  }, [exams]);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Painel de Controle</h2>
        <p className="text-slate-500">Acompanhe a evolução dos seus resultados laboratoriais.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Total de Exames</p>
          <p className="text-3xl font-bold text-indigo-600">{exams.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Último Exame</p>
          <p className="text-xl font-bold text-slate-800 truncate">
            {exams.length > 0 ? exams[exams.length - 1].examName : 'Nenhum'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Status Geral</p>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${exams.length > 0 ? 'bg-green-500' : 'bg-slate-300'}`}></span>
            <p className="text-lg font-semibold text-slate-800">
              {exams.length > 0 ? 'Atualizado' : 'Aguardando dados'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Gráfico de Evolução (Exame mais frequente)</h3>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  name={chartData[0]?.nome || 'Valor'} 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded-xl">
              Adicione exames para visualizar o gráfico de evolução.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
