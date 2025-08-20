'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area } from 'recharts'
import { Calendar as CalendarIcon, Download, TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Target, ArrowUpRight, ArrowDownRight, FileText, BarChart3, PieChart as PieChartIcon } from 'lucide-react'
import { WithAuth } from '@/components/with-auth'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Dados mockados para desenvolvimento
const mockTransactions = [
  { id: '1', description: 'Salário', amount: 5000, type: 'INCOME', date: '2024-08-01', category: 'Salário' },
  { id: '2', description: 'Supermercado', amount: 235.50, type: 'EXPENSE', date: '2024-08-02', category: 'Alimentação' },
  { id: '3', description: 'Aluguel', amount: 1200, type: 'EXPENSE', date: '2024-08-03', category: 'Moradia' },
  { id: '4', description: 'Freelance', amount: 3500, type: 'INCOME', date: '2024-08-05', category: 'Trabalho' },
  { id: '5', description: 'Café', amount: 25, type: 'EXPENSE', date: '2024-08-06', category: 'Alimentação' },
  { id: '6', description: 'Transporte', amount: 150, type: 'EXPENSE', date: '2024-08-07', category: 'Transporte' },
  { id: '7', description: 'Cinema', amount: 80, type: 'EXPENSE', date: '2024-08-08', category: 'Lazer' },
  { id: '8', description: 'Investimento', amount: 1000, type: 'INCOME', date: '2024-08-10', category: 'Investimentos' }
]

const mockMonthlyData = [
  { month: 'Jan', income: 7000, expenses: 5500, balance: 1500 },
  { month: 'Fev', income: 7500, expenses: 5800, balance: 1700 },
  { month: 'Mar', income: 8000, expenses: 6000, balance: 2000 },
  { month: 'Abr', income: 7800, expenses: 6200, balance: 1600 },
  { month: 'Mai', income: 8200, expenses: 5900, balance: 2300 },
  { month: 'Jun', income: 8500, expenses: 6235, balance: 2265 },
  { month: 'Jul', income: 8300, expenses: 6100, balance: 2200 },
  { month: 'Ago', income: 9500, expenses: 6190.5, balance: 3309.5 }
]

const mockCategoryData = [
  { name: 'Alimentação', value: 1200, color: '#ef4444' },
  { name: 'Moradia', value: 2500, color: '#f59e0b' },
  { name: 'Transporte', value: 800, color: '#3b82f6' },
  { name: 'Lazer', value: 600, color: '#8b5cf6' },
  { name: 'Saúde', value: 300, color: '#ec4899' },
  { name: 'Educação', value: 400, color: '#8b5cf6' },
  { name: 'Outros', value: 390.5, color: '#6b7280' }
]

const mockAccountData = [
  { name: 'Conta Corrente', balance: 8500.50, type: 'CHECKING' },
  { name: 'Cartão de Crédito', balance: -1235.25, type: 'CREDIT_CARD' },
  { name: 'Poupança', balance: 5235.50, type: 'SAVINGS' },
  { name: 'Carteira Digital', balance: 250.00, type: 'DIGITAL' }
]

const reportPeriods = [
  { value: 'THIS_MONTH', label: 'Este Mês' },
  { value: 'LAST_MONTH', label: 'Mês Anterior' },
  { value: 'THIS_QUARTER', label: 'Este Trimestre' },
  { value: 'THIS_YEAR', label: 'Este Ano' },
  { value: 'CUSTOM', label: 'Personalizado' }
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function ReportsContent() {
  const [selectedPeriod, setSelectedPeriod] = useState('THIS_MONTH')
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  })
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const totalIncome = mockTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = mockTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const expensesByCategory = mockTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
      return acc
    }, {} as Record<string, number>)

  const categoryData = Object.entries(expensesByCategory).map(([name, value], index) => ({
    name,
    value,
    color: mockCategoryData[index]?.color || '#6b7280'
  }))

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground">
              Analise seus dados financeiros e obtenha insights valiosos
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportPeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedPeriod === 'CUSTOM' && (
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-60 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} - {format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to
                    }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to })
                        setIsCalendarOpen(false)
                      }
                    }}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            )}
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Receitas
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
              <p className="text-xs text-muted-foreground">
                +12.5% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Despesas
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">
                -5.2% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Saldo Líquido
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </div>
              <p className="text-xs text-muted-foreground">
                {balance >= 0 ? 'Superávit' : 'Déficit'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Economia
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome - totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                Taxa de economia: {((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="categories">Por Categoria</TabsTrigger>
            <TabsTrigger value="evolution">Evolução</TabsTrigger>
            <TabsTrigger value="accounts">Por Conta</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Evolução Mensal */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolução Financeira</CardTitle>
                  <CardDescription>
                    Comparativo de receitas e despesas ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mockMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Receitas" />
                      <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Despesas" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Saldo */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do Saldo</CardTitle>
                  <CardDescription>
                    Variação do saldo líquido mensal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} name="Saldo" dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Resumo das Categorias */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo por Categoria</CardTitle>
                <CardDescription>
                  Distribuição dos gastos por categoria no período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(category.value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Pizza */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Despesas</CardTitle>
                  <CardDescription>
                    Visualização percentual por categoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Barras */}
              <Card>
                <CardHeader>
                  <CardTitle>Despesas por Categoria</CardTitle>
                  <CardDescription>
                    Comparativo de valores em reais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="value" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tabela Detalhada */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhamento por Categoria</CardTitle>
                <CardDescription>
                  Valores absolutos e percentuais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData
                    .sort((a, b) => b.value - a.value)
                    .map((category) => {
                      const percentage = totalExpenses > 0 ? (category.value / totalExpenses) * 100 : 0
                      return (
                        <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }} />
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}% do total</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(category.value)}</p>
                            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evolução de Receitas */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolução de Receitas</CardTitle>
                  <CardDescription>
                    Histórico de receitas mensais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} name="Receitas" dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Evolução de Despesas */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolução de Despesas</CardTitle>
                  <CardDescription>
                    Histórico de despesas mensais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} name="Despesas" dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Comparativo Períodos */}
            <Card>
              <CardHeader>
                <CardTitle>Comparativo de Períodos</CardTitle>
                <CardDescription>
                  Comparação entre diferentes meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Mês</th>
                        <th className="text-right p-2">Receitas</th>
                        <th className="text-right p-2">Despesas</th>
                        <th className="text-right p-2">Saldo</th>
                        <th className="text-right p-2">Variação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockMonthlyData.map((month, index) => {
                        const prevMonth = mockMonthlyData[index - 1]
                        const variation = prevMonth ? ((month.balance - prevMonth.balance) / prevMonth.balance * 100) : 0
                        
                        return (
                          <tr key={month.month} className="border-b">
                            <td className="p-2 font-medium">{month.month}</td>
                            <td className="p-2 text-right text-green-600">{formatCurrency(month.income)}</td>
                            <td className="p-2 text-right text-red-600">{formatCurrency(month.expenses)}</td>
                            <td className={`p-2 text-right ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(month.balance)}
                            </td>
                            <td className={`p-2 text-right ${variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {variation >= 0 ? '+' : ''}{variation.toFixed(1)}%
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Saldo por Conta */}
              <Card>
                <CardHeader>
                  <CardTitle>Saldo por Conta</CardTitle>
                  <CardDescription>
                    Distribuição de saldo entre suas contas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAccountData.map((account) => (
                      <div key={account.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {account.type === 'CHECKING' ? 'Conta Corrente' :
                               account.type === 'CREDIT_CARD' ? 'Cartão de Crédito' :
                               account.type === 'SAVINGS' ? 'Poupança' : account.type}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${
                            account.balance < 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(account.balance)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Comparação */}
              <Card>
                <CardHeader>
                  <CardTitle>Comparação de Saldos</CardTitle>
                  <CardDescription>
                    Valores absolutos por conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockAccountData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="balance" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Resumo Financeiro */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro por Conta</CardTitle>
                <CardDescription>
                  Detalhamento dos saldos e movimentações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Conta</th>
                        <th className="text-right p-2">Saldo Atual</th>
                        <th className="text-right p-2">Tipo</th>
                        <th className="text-right p-2">% do Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAccountData.map((account) => {
                        const totalBalance = mockAccountData.reduce((sum, acc) => sum + acc.balance, 0)
                        const percentage = totalBalance !== 0 ? (account.balance / totalBalance) * 100 : 0
                        
                        return (
                          <tr key={account.name} className="border-b">
                            <td className="p-2 font-medium">{account.name}</td>
                            <td className={`p-2 text-right ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(account.balance)}
                            </td>
                            <td className="p-2 text-right">
                              <Badge variant="secondary">
                                {account.type === 'CHECKING' ? 'Conta Corrente' :
                                 account.type === 'CREDIT_CARD' ? 'Cartão de Crédito' :
                                 account.type === 'SAVINGS' ? 'Poupança' : account.type}
                              </Badge>
                            </td>
                            <td className="p-2 text-right">{percentage.toFixed(1)}%</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <WithAuth>
      <ReportsContent />
    </WithAuth>
  )
}