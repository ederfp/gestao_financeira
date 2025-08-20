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
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, Target, TrendingUp, Calendar as CalendarIcon, Flag, CheckCircle, AlertTriangle, Clock, DollarSign, PiggyBank, Home, Car, GraduationCap, Heart, Gift, AlertCircle } from 'lucide-react'
import { WithAuth } from '@/components/with-auth'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Dados mockados para desenvolvimento
const mockGoals = [
  {
    id: '1',
    name: 'Compra do Apartamento',
    description: 'Economizar para dar entrada no apartamento dos sonhos',
    targetAmount: 50000,
    currentAmount: 15000,
    deadline: '2025-12-31',
    color: '#3b82f6',
    icon: 'home',
    status: 'ACTIVE',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Carro Novo',
    description: 'Trocar de carro até o final do ano',
    targetAmount: 30000,
    currentAmount: 12000,
    deadline: '2024-12-31',
    color: '#ef4444',
    icon: 'car',
    status: 'ACTIVE',
    createdAt: '2024-02-15'
  },
  {
    id: '3',
    name: 'Curso de Especialização',
    description: 'Investir em educação profissional',
    targetAmount: 8000,
    currentAmount: 8000,
    deadline: '2024-06-30',
    color: '#10b981',
    icon: 'graduation-cap',
    status: 'COMPLETED',
    completedAt: '2024-06-28',
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    name: 'Fundo de Emergência',
    description: 'Construir um fundo de emergência para 6 meses',
    targetAmount: 24000,
    currentAmount: 18500,
    deadline: '2024-10-31',
    color: '#f59e0b',
    icon: 'piggy-bank',
    status: 'ACTIVE',
    createdAt: '2024-01-05'
  }
]

const mockContributions = [
  {
    id: '1',
    goalId: '1',
    amount: 1000,
    notes: 'Salário do mês',
    createdAt: '2024-08-01'
  },
  {
    id: '2',
    goalId: '1',
    amount: 500,
    notes: 'Extra freelance',
    createdAt: '2024-08-05'
  },
  {
    id: '3',
    goalId: '2',
    amount: 800,
    notes: 'Economia do mês',
    createdAt: '2024-08-01'
  }
]

const goalStatuses = [
  { value: 'ACTIVE', label: 'Ativa', color: 'bg-green-100 text-green-800' },
  { value: 'PAUSED', label: 'Pausada', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'COMPLETED', label: 'Concluída', color: 'bg-blue-100 text-blue-800' },
  { value: 'CANCELLED', label: 'Cancelada', color: 'bg-red-100 text-red-800' }
]

const iconOptions = [
  { value: 'target', label: 'Alvo', icon: Target },
  { value: 'home', label: 'Casa', icon: Home },
  { value: 'car', label: 'Carro', icon: Car },
  { value: 'graduation-cap', label: 'Educação', icon: GraduationCap },
  { value: 'heart', label: 'Saúde', icon: Heart },
  { value: 'gift', label: 'Presente', icon: Gift },
  { value: 'piggy-bank', label: 'Poupança', icon: PiggyBank },
  { value: 'trending-up', label: 'Investimento', icon: TrendingUp }
]

const colorOptions = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899',
  '#dc2626', '#ea580c', '#059669', '#2563eb', '#7c3aed', '#db2777'
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

const getDaysRemaining = (deadline: string) => {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getGoalProgress = (current: number, target: number) => {
  return target > 0 ? Math.min((current / target) * 100, 100) : 0
}

const getGoalStatusInfo = (status: string) => {
  return goalStatuses.find(s => s.value === status) || goalStatuses[0]
}

function GoalsContent() {
  const [goals, setGoals] = useState(mockGoals)
  const [contributions, setContributions] = useState(mockContributions)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isContributionDialogOpen, setIsContributionDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)
  const [selectedGoalForContribution, setSelectedGoalForContribution] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: '',
    color: '#6366f1',
    icon: 'target',
    status: 'ACTIVE'
  })
  const [contributionFormData, setContributionFormData] = useState({
    amount: 0,
    notes: ''
  })
  const [error, setError] = useState('')

  const activeGoals = goals.filter(g => g.status === 'ACTIVE')
  const completedGoals = goals.filter(g => g.status === 'COMPLETED')
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulação de salvamento - substituir por integração real com backend
      await new Promise(resolve => setTimeout(resolve, 1000))

      const goalData = {
        ...formData,
        id: editingGoal?.id || Date.now().toString(),
        createdAt: editingGoal?.createdAt || new Date().toISOString(),
        completedAt: formData.status === 'COMPLETED' ? new Date().toISOString() : null
      }

      if (editingGoal) {
        // Atualizar meta existente
        setGoals(prev => prev.map(g => g.id === editingGoal.id ? goalData : g))
      } else {
        // Criar nova meta
        setGoals(prev => [...prev, goalData])
      }

      // Resetar formulário e fechar diálogo
      setFormData({
        name: '',
        description: '',
        targetAmount: 0,
        currentAmount: 0,
        deadline: '',
        color: '#6366f1',
        icon: 'target',
        status: 'ACTIVE'
      })
      setEditingGoal(null)
      setIsDialogOpen(false)
    } catch (err) {
      setError('Erro ao salvar meta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContributionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulação de salvamento - substituir por integração real com backend
      await new Promise(resolve => setTimeout(resolve, 1000))

      const contributionData = {
        ...contributionFormData,
        id: Date.now().toString(),
        goalId: selectedGoalForContribution.id,
        amount: Number(contributionFormData.amount),
        createdAt: new Date().toISOString()
      }

      // Adicionar contribuição
      setContributions(prev => [...prev, contributionData])

      // Atualizar valor atual da meta
      setGoals(prev => prev.map(g => 
        g.id === selectedGoalForContribution.id 
          ? { ...g, currentAmount: g.currentAmount + Number(contributionFormData.amount) }
          : g
      ))

      // Resetar formulário e fechar diálogo
      setContributionFormData({
        amount: '',
        notes: ''
      })
      setSelectedGoalForContribution(null)
      setIsContributionDialogOpen(false)
    } catch (err) {
      setError('Erro ao registrar contribuição. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (goal: any) => {
    setEditingGoal(goal)
    setFormData({
      name: goal.name,
      description: goal.description,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline,
      color: goal.color,
      icon: goal.icon,
      status: goal.status
    })
    setIsDialogOpen(true)
  }

  const handleContribution = (goal: any) => {
    setSelectedGoalForContribution(goal)
    setContributionFormData({
      amount: '',
      notes: ''
    })
    setIsContributionDialogOpen(true)
  }

  const handleDelete = async (goalId: string) => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      try {
        // Simulação de exclusão - substituir por integração real com backend
        await new Promise(resolve => setTimeout(resolve, 500))
        setGoals(prev => prev.filter(g => g.id !== goalId))
        setContributions(prev => prev.filter(c => c.goalId !== goalId))
      } catch (err) {
        setError('Erro ao excluir meta. Tente novamente.')
      }
    }
  }

  const handleToggleStatus = async (goalId: string, newStatus: string) => {
    try {
      // Simulação de atualização - substituir por integração real com backend
      await new Promise(resolve => setTimeout(resolve, 300))
      setGoals(prev => prev.map(g => 
        g.id === goalId 
          ? { 
              ...g, 
              status: newStatus,
              completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : null
            } 
          : g
      ))
    } catch (err) {
      setError('Erro ao atualizar status. Tente novamente.')
    }
  }

  const getMonthlyContributionNeeded = (goal: any) => {
    const daysRemaining = getDaysRemaining(goal.deadline)
    const monthsRemaining = Math.max(1, Math.ceil(daysRemaining / 30))
    const remainingAmount = goal.targetAmount - goal.currentAmount
    return remainingAmount / monthsRemaining
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Metas Financeiras</h1>
            <p className="text-muted-foreground">
              Planeje e acompanhe seus objetivos financeiros
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingGoal(null)
                setFormData({
                  name: '',
                  description: '',
                  targetAmount: 0,
                  currentAmount: 0,
                  deadline: '',
                  color: '#6366f1',
                  icon: 'target',
                  status: 'ACTIVE'
                })
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingGoal ? 'Editar Meta' : 'Nova Meta Financeira'}
                </DialogTitle>
                <DialogDescription>
                  {editingGoal ? 'Atualize as informações da meta.' : 'Defina um novo objetivo financeiro para alcançar.'}
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
                  <Label htmlFor="name">Nome da Meta</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Compra do Apartamento"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva seu objetivo..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="targetAmount">Valor Alvo</Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      step="0.01"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: Number(e.target.value) }))}
                      placeholder="0,00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentAmount">Valor Atual</Label>
                    <Input
                      id="currentAmount"
                      type="number"
                      step="0.01"
                      value={formData.currentAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: Number(e.target.value) }))}
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Prazo</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Ícone</Label>
                    <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Cor</Label>
                    <div className="grid grid-cols-4 gap-1">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-6 h-6 rounded border-2 ${
                            formData.color === color ? 'border-foreground' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {goalStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : editingGoal ? 'Atualizar' : 'Criar'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Metas
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goals.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeGoals.length} ativas, {completedGoals.length} concluídas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor Acumulado
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalSaved)}</div>
              <p className="text-xs text-muted-foreground">
                Total economizado em todas as metas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor Total das Metas
              </CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalTarget)}</div>
              <p className="text-xs text-muted-foreground">
                Soma de todos os objetivos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Progresso Geral
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                do valor total das metas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Metas Ativas</TabsTrigger>
            <TabsTrigger value="completed">Metas Concluídas</TabsTrigger>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {activeGoals.map((goal) => {
                const progress = getGoalProgress(goal.currentAmount, goal.targetAmount)
                const daysRemaining = getDaysRemaining(goal.deadline)
                const monthlyNeeded = getMonthlyContributionNeeded(goal)
                const IconComponent = iconOptions.find(opt => opt.value === goal.icon)?.icon || Target
                const statusInfo = getGoalStatusInfo(goal.status)

                return (
                  <Card key={goal.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-lg" style={{ backgroundColor: goal.color + '20' }}>
                            <IconComponent className="h-6 w-6" style={{ color: goal.color }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{goal.name}</h3>
                              <Badge className={statusInfo.color}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContribution(goal)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Contribuir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(goal)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(goal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Progresso</span>
                            <span className="text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{formatCurrency(goal.currentAmount)}</span>
                            <span>{formatCurrency(goal.targetAmount)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>Prazo: {formatDate(goal.deadline)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Prazo expirado'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Meta mensal: {formatCurrency(monthlyNeeded)}
                            </span>
                          </div>
                        </div>

                        {progress >= 100 && (
                          <div className="p-3 rounded-lg bg-green-100">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                Parabéns! Meta alcançada! 🎉
                              </span>
                            </div>
                          </div>
                        )}

                        {daysRemaining < 0 && progress < 100 && (
                          <div className="p-3 rounded-lg bg-red-100">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-800">
                                Prazo expirado! Considere estender o prazo ou aumentar as contribuições.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {activeGoals.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <Target className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma meta ativa</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Crie suas primeiras metas financeiras para começar a planejar seu futuro.
                  </p>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingGoal(null)
                        setFormData({
                          name: '',
                          description: '',
                          targetAmount: 0,
                          currentAmount: 0,
                          deadline: '',
                          color: '#6366f1',
                          icon: 'target',
                          status: 'ACTIVE'
                        })
                      }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeira Meta
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4">
              {completedGoals.map((goal) => {
                const progress = getGoalProgress(goal.currentAmount, goal.targetAmount)
                const IconComponent = iconOptions.find(opt => opt.value === goal.icon)?.icon || Target
                const statusInfo = getGoalStatusInfo(goal.status)

                return (
                  <Card key={goal.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-lg" style={{ backgroundColor: goal.color + '20' }}>
                            <IconComponent className="h-6 w-6" style={{ color: goal.color }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{goal.name}</h3>
                              <Badge className={statusInfo.color}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                            {goal.completedAt && (
                              <p className="text-sm text-green-600">
                                Concluída em: {formatDate(goal.completedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(goal)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(goal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Progresso</span>
                          <span className="text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatCurrency(goal.currentAmount)}</span>
                          <span>{formatCurrency(goal.targetAmount)}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-green-100">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Parabéns! Meta alcançada com sucesso! 🎉
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {completedGoals.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma meta concluída</h3>
                  <p className="text-muted-foreground text-center">
                    Continue trabalhando em suas metas para alcançar seus objetivos financeiros.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Metas por Status</CardTitle>
                  <CardDescription>
                    Distribuição das metas por situação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {goalStatuses.map((status) => {
                      const count = goals.filter(g => g.status === status.value).length
                      return (
                        <div key={status.value} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              status.value === 'ACTIVE' ? 'bg-green-600' :
                              status.value === 'COMPLETED' ? 'bg-blue-600' :
                              status.value === 'PAUSED' ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`} />
                            <span className="text-sm">{status.label}</span>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progresso das Metas</CardTitle>
                  <CardDescription>
                    Status de progresso das metas ativas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeGoals.map((goal) => {
                      const progress = getGoalProgress(goal.currentAmount, goal.targetAmount)
                      const IconComponent = iconOptions.find(opt => opt.value === goal.icon)?.icon || Target

                      return (
                        <div key={goal.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" style={{ color: goal.color }} />
                            <span className="text-sm font-medium">{goal.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="flex-1 h-2" />
                            <span className="text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Próximos Prazos</CardTitle>
                  <CardDescription>
                    Metas com prazos mais próximos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeGoals
                      .sort((a, b) => getDaysRemaining(a.deadline) - getDaysRemaining(b.deadline))
                      .slice(0, 3)
                      .map((goal) => {
                        const daysRemaining = getDaysRemaining(goal.deadline)
                        const IconComponent = iconOptions.find(opt => opt.value === goal.icon)?.icon || Target

                        return (
                          <div key={goal.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" style={{ color: goal.color }} />
                              <span className="text-sm">{goal.name}</span>
                            </div>
                            <span className={`text-sm ${
                              daysRemaining < 30 ? 'text-red-600' :
                              daysRemaining < 60 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {daysRemaining} dias
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Diálogo de Contribuição */}
      <Dialog open={isContributionDialogOpen} onOpenChange={setIsContributionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Contribuição</DialogTitle>
            <DialogDescription>
              Adicione um valor à meta "{selectedGoalForContribution?.name}"
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleContributionSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor da Contribuição</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={contributionFormData.amount}
                onChange={(e) => setContributionFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={contributionFormData.notes}
                onChange={(e) => setContributionFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Descreva a origem do valor..."
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrar Contribuição'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function GoalsPage() {
  return (
    <WithAuth>
      <GoalsContent />
    </WithAuth>
  )
}