'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Plus, Edit, Trash2, AlertTriangle, Target, TrendingUp, TrendingDown, Calendar as CalendarIcon, PieChart, BarChart3, AlertCircle } from 'lucide-react'
import { WithAuth } from '@/components/with-auth'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Dados mockados para desenvolvimento
const mockBudgets = [
  {
    id: '1',
    name: 'Orçamento Mensal - Agosto 2024',
    amount: 7000,
    period: 'MONTHLY',
    startDate: '2024-08-01',
    endDate: '2024-08-31',
    alertAt: 80,
    isActive: true,
    createdAt: '2024-07-31'
  }
]

const mockBudgetCategories = [
  {
    id: '1',
    budgetId: '1',
    category: {
      id: '1',
      name: 'Alimentação',
      color: '#ef4444',
      icon: 'shopping-cart'
    },
    amount: 1500,
    spent: 1235.50,
    alertAt: 80
  },
  {
    id: '2',
    budgetId: '1',
    category: {
      id: '2',
      name: 'Moradia',
      color: '#f59e0b',
      icon: 'home'
    },
    amount: 2500,
    spent: 2500,
    alertAt: 90
  },
  {
    id: '3',
    budgetId: '1',
    category: {
      id: '3',
      name: 'Transporte',
      color: '#3b82f6',
      icon: 'car'
    },
    amount: 800,
    spent: 650.75,
    alertAt: 80
  },
  {
    id: '4',
    budgetId: '1',
    category: {
      id: '4',
      name: 'Lazer',
      color: '#8b5cf6',
      icon: 'gamepad-2'
    },
    amount: 600,
    spent: 450.00,
    alertAt: 80
  },
  {
    id: '5',
    budgetId: '1',
    category: {
      id: '8',
      name: 'Outros',
      color: '#6b7280',
      icon: 'more-horizontal'
    },
    amount: 1600,
    spent: 1399.00,
    alertAt: 80
  }
]

const mockCategories = [
  { id: '1', name: 'Alimentação', color: '#ef4444', icon: 'shopping-cart' },
  { id: '2', name: 'Moradia', color: '#f59e0b', icon: 'home' },
  { id: '3', name: 'Transporte', color: '#3b82f6', icon: 'car' },
  { id: '4', name: 'Lazer', color: '#8b5cf6', icon: 'gamepad-2' },
  { id: '5', name: 'Saúde', color: '#ec4899', icon: 'heart' },
  { id: '6', name: 'Educação', color: '#8b5cf6', icon: 'graduation-cap' },
  { id: '7', name: 'Investimentos', color: '#10b981', icon: 'trending-up' },
  { id: '8', name: 'Outros', color: '#6b7280', icon: 'more-horizontal' }
]

const periodOptions = [
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'MONTHLY', label: 'Mensal' },
  { value: 'QUARTERLY', label: 'Trimestral' },
  { value: 'ANNUAL', label: 'Anual' }
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

function BudgetContent() {
  const [budgets, setBudgets] = useState(mockBudgets)
  const [budgetCategories, setBudgetCategories] = useState(mockBudgetCategories)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<any>(null)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    period: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    alertAt: 80,
    isActive: true
  })
  const [categoryFormData, setCategoryFormData] = useState({
    categoryId: '',
    amount: 0,
    alertAt: 80
  })
  const [error, setError] = useState('')

  const currentBudget = budgets.find(b => b.isActive)
  const totalBudget = currentBudget ? currentBudget.amount : 0
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0)
  const totalRemaining = totalBudget - totalSpent
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulação de salvamento - substituir por integração real com backend
      await new Promise(resolve => setTimeout(resolve, 1000))

      const budgetData = {
        ...formData,
        id: editingBudget?.id || Date.now().toString(),
        createdAt: editingBudget?.createdAt || new Date().toISOString()
      }

      if (editingBudget) {
        // Atualizar orçamento existente
        setBudgets(prev => prev.map(b => b.id === editingBudget.id ? budgetData : b))
      } else {
        // Criar novo orçamento
        setBudgets(prev => [...prev, budgetData])
      }

      // Resetar formulário e fechar diálogo
      setFormData({
        name: '',
        amount: 0,
        period: 'MONTHLY',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        alertAt: 80,
        isActive: true
      })
      setEditingBudget(null)
      setIsDialogOpen(false)
    } catch (err) {
      setError('Erro ao salvar orçamento. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulação de salvamento - substituir por integração real com backend
      await new Promise(resolve => setTimeout(resolve, 1000))

      const categoryData = {
        ...categoryFormData,
        id: editingCategory?.id || Date.now().toString(),
        budgetId: currentBudget?.id || '1',
        spent: editingCategory?.spent || 0,
        category: mockCategories.find(c => c.id === categoryFormData.categoryId) || mockCategories[0]
      }

      if (editingCategory) {
        // Atualizar categoria do orçamento existente
        setBudgetCategories(prev => prev.map(cat => cat.id === editingCategory.id ? categoryData : cat))
      } else {
        // Criar nova categoria no orçamento
        setBudgetCategories(prev => [...prev, categoryData])
      }

      // Resetar formulário e fechar diálogo
      setCategoryFormData({
        categoryId: '',
        amount: 0,
        alertAt: 80
      })
      setEditingCategory(null)
      setIsCategoryDialogOpen(false)
    } catch (err) {
      setError('Erro ao salvar categoria. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (budget: any) => {
    setEditingBudget(budget)
    setFormData({
      name: budget.name,
      amount: budget.amount,
      period: budget.period,
      startDate: budget.startDate,
      endDate: budget.endDate,
      alertAt: budget.alertAt,
      isActive: budget.isActive
    })
    setIsDialogOpen(true)
  }

  const handleCategoryEdit = (category: any) => {
    setEditingCategory(category)
    setCategoryFormData({
      categoryId: category.category.id,
      amount: category.amount,
      alertAt: category.alertAt
    })
    setIsCategoryDialogOpen(true)
  }

  const handleDelete = async (budgetId: string) => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        // Simulação de exclusão - substituir por integração real com backend
        await new Promise(resolve => setTimeout(resolve, 500))
        setBudgets(prev => prev.filter(b => b.id !== budgetId))
      } catch (err) {
        setError('Erro ao excluir orçamento. Tente novamente.')
      }
    }
  }

  const handleCategoryDelete = async (categoryId: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria do orçamento?')) {
      try {
        // Simulação de exclusão - substituir por integração real com backend
        await new Promise(resolve => setTimeout(resolve, 500))
        setBudgetCategories(prev => prev.filter(cat => cat.id !== categoryId))
      } catch (err) {
        setError('Erro ao excluir categoria. Tente novamente.')
      }
    }
  }

  const getBudgetStatus = (spent: number, budget: number, alertAt: number) => {
    const percentage = (spent / budget) * 100
    
    if (percentage >= 100) {
      return { status: 'exceeded', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertTriangle }
    } else if (percentage >= alertAt) {
      return { status: 'warning', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: AlertTriangle }
    } else {
      return { status: 'normal', color: 'text-green-600', bgColor: 'bg-green-100', icon: TrendingUp }
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orçamento</h1>
            <p className="text-muted-foreground">
              Planeje e acompanhe seus gastos por categoria
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingBudget(null)
                  setFormData({
                    name: '',
                    amount: 0,
                    period: 'MONTHLY',
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    alertAt: 80,
                    isActive: true
                  })
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Orçamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingBudget ? 'Atualize as informações do orçamento.' : 'Crie um novo orçamento para planejar seus gastos.'}
                  </DialogDescription>
                </DialogHeader>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Orçamento</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Orçamento Mensal - Agosto 2024"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor Total</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      placeholder="0,00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="period">Período</Label>
                    <Select value={formData.period} onValueChange={(value) => setFormData(prev => ({ ...prev, period: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {periodOptions.map((period) => (
                          <SelectItem key={period.value} value={period.value}>
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Data Inicial</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data Final</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alertAt">Alertar em (%)</Label>
                    <Input
                      id="alertAt"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.alertAt}
                      onChange={(e) => setFormData(prev => ({ ...prev, alertAt: Number(e.target.value) }))}
                      placeholder="80"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Orçamento ativo</Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : editingBudget ? 'Atualizar' : 'Criar'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Cards de Resumo */}
        {currentBudget && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Orçamento Total
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
                <p className="text-xs text-muted-foreground">
                  {currentBudget.name}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Gasto
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalSpent)}</div>
                <p className="text-xs text-muted-foreground">
                  {totalPercentage.toFixed(1)}% do orçamento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Saldo Restante
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(totalRemaining))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalRemaining >= 0 ? 'Disponível' : 'Estourado'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Período
                </CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDate(currentBudget.startDate)}
                </div>
                <p className="text-xs text-muted-foreground">
                  até {formatDate(currentBudget.endDate)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progresso Geral */}
        {currentBudget && (
          <Card>
            <CardHeader>
              <CardTitle>Progresso Geral do Orçamento</CardTitle>
              <CardDescription>
                Acompanhe o consumo total do seu orçamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progresso Total</span>
                  <span className="text-sm text-muted-foreground">{totalPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(totalPercentage, 100)} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatCurrency(0)}</span>
                  <span>{formatCurrency(totalBudget)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Categorias do Orçamento</h3>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingCategory(null)
                    setCategoryFormData({
                      categoryId: '',
                      amount: 0,
                      alertAt: 80
                    })
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? 'Editar Categoria' : 'Adicionar Categoria'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCategory ? 'Atualize o limite da categoria.' : 'Adicione uma nova categoria ao orçamento.'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryId">Categoria</Label>
                      <Select value={categoryFormData.categoryId} onValueChange={(value) => setCategoryFormData(prev => ({ ...prev, categoryId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCategories
                            .filter(cat => !budgetCategories.some(bc => bc.category.id === cat.id && bc.id !== editingCategory?.id))
                            .map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }} />
                                  {category.name}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Limite</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={categoryFormData.amount}
                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                        placeholder="0,00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alertAt">Alertar em (%)</Label>
                      <Input
                        id="alertAt"
                        type="number"
                        min="0"
                        max="100"
                        value={categoryFormData.alertAt}
                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, alertAt: Number(e.target.value) }))}
                        placeholder="80"
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Salvando...' : editingCategory ? 'Atualizar' : 'Adicionar'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {budgetCategories.map((category) => {
                const percentage = category.amount > 0 ? (category.spent / category.amount) * 100 : 0
                const status = getBudgetStatus(category.spent, category.amount, category.alertAt)
                const StatusIcon = status.icon

                return (
                  <Card key={category.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-lg" style={{ backgroundColor: category.category.color + '20' }}>
                            <div className="w-6 h-6 flex items-center justify-center">
                              <div className="w-4 h-4 rounded" style={{ backgroundColor: category.category.color }} />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold">{category.category.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${status.color}`}>
                                {formatCurrency(category.spent)} de {formatCurrency(category.amount)}
                              </span>
                              <StatusIcon className={`h-4 w-4 ${status.color}`} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategoryEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategoryDelete(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                          <span className="text-sm text-muted-foreground">
                            Alerta em {category.alertAt}%
                          </span>
                        </div>
                        <Progress value={Math.min(percentage, 100)} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatCurrency(0)}</span>
                          <span>{formatCurrency(category.amount)}</span>
                        </div>
                      </div>

                      {status.status === 'exceeded' && (
                        <div className={`mt-3 p-2 rounded-lg ${status.bgColor}`}>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-4 w-4 ${status.color}`} />
                            <span className={`text-sm font-medium ${status.color}`}>
                              Orçamento excedido! Você gastou {formatCurrency(category.spent - category.amount)} a mais.
                            </span>
                          </div>
                        </div>
                      )}

                      {status.status === 'warning' && (
                        <div className={`mt-3 p-2 rounded-lg ${status.bgColor}`}>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-4 w-4 ${status.color}`} />
                            <span className={`text-sm font-medium ${status.color}`}>
                              Atenção! Você já gastou {percentage.toFixed(1)}% do orçamento desta categoria.
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Orçamentos
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{budgets.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {budgets.filter(b => b.isActive).length} ativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Categorias Planejadas
                  </CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{budgetCategories.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Categorias no orçamento atual
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Maior Gasto
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {budgetCategories.length > 0 
                      ? formatCurrency(Math.max(...budgetCategories.map(c => c.spent)))
                      : formatCurrency(0)
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Categoria com maior gasto
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Economia Potencial
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(Math.max(0, totalRemaining))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valor que ainda pode ser gasto
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Status das Categorias</CardTitle>
                <CardDescription>
                  Visão geral do status de cada categoria no orçamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetCategories.map((category) => {
                    const percentage = category.amount > 0 ? (category.spent / category.amount) * 100 : 0
                    const status = getBudgetStatus(category.spent, category.amount, category.alertAt)

                    return (
                      <div key={category.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: category.category.color }} />
                          <span className="font-medium">{category.category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            status.status === 'exceeded' ? 'bg-red-600' :
                            status.status === 'warning' ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function BudgetPage() {
  return (
    <WithAuth>
      <BudgetContent />
    </WithAuth>
  )
}