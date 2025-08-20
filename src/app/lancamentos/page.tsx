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
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Edit, Trash2, ArrowUpRight, ArrowDownRight, Calendar as CalendarIcon, Search, Filter, Download, FileText, CreditCard, Wallet, ShoppingCart, Home, Briefcase, Coffee } from 'lucide-react'
import { WithAuth } from '@/components/with-auth'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Dados mockados para desenvolvimento
const mockTransactions = [
  {
    id: '1',
    description: 'Salário',
    amount: 5000.00,
    type: 'INCOME',
    date: '2024-08-01',
    category: { name: 'Salário', color: '#10b981', icon: Briefcase },
    account: { name: 'Conta Corrente', type: 'CHECKING' },
    notes: 'Salário mensal',
    isPaid: true,
    isConfirmed: true,
    tags: 'salário,renda'
  },
  {
    id: '2',
    description: 'Supermercado',
    amount: -235.50,
    type: 'EXPENSE',
    date: '2024-08-02',
    category: { name: 'Alimentação', color: '#ef4444', icon: ShoppingCart },
    account: { name: 'Cartão Nubank', type: 'CREDIT_CARD' },
    notes: 'Compras mensais',
    isPaid: true,
    isConfirmed: true,
    tags: 'supermercado,comida'
  },
  {
    id: '3',
    description: 'Aluguel',
    amount: -1200.00,
    type: 'EXPENSE',
    date: '2024-08-03',
    category: { name: 'Moradia', color: '#f59e0b', icon: Home },
    account: { name: 'Conta Corrente', type: 'CHECKING' },
    notes: 'Aluguel do apartamento',
    isPaid: true,
    isConfirmed: true,
    tags: 'aluguel,moradia'
  },
  {
    id: '4',
    description: 'Freelance',
    amount: 3500.00,
    type: 'INCOME',
    date: '2024-08-05',
    category: { name: 'Trabalho', color: '#8b5cf6', icon: Briefcase },
    account: { name: 'Conta Corrente', type: 'CHECKING' },
    notes: 'Projeto de design',
    isPaid: true,
    isConfirmed: true,
    tags: 'freelance,trabalho'
  },
  {
    id: '5',
    description: 'Café da manhã',
    amount: -25.00,
    type: 'EXPENSE',
    date: '2024-08-06',
    category: { name: 'Alimentação', color: '#ef4444', icon: Coffee },
    account: { name: 'Carteira Digital', type: 'DIGITAL' },
    notes: 'Café com amigos',
    isPaid: true,
    isConfirmed: true,
    tags: 'café,alimentação'
  }
]

const mockAccounts = [
  { id: '1', name: 'Conta Corrente', type: 'CHECKING' },
  { id: '2', name: 'Cartão Nubank', type: 'CREDIT_CARD' },
  { id: '3', name: 'Poupança', type: 'SAVINGS' },
  { id: '4', name: 'Carteira Digital', type: 'DIGITAL' }
]

const mockCategories = [
  { id: '1', name: 'Alimentação', type: 'EXPENSE', color: '#ef4444', icon: ShoppingCart },
  { id: '2', name: 'Moradia', type: 'EXPENSE', color: '#f59e0b', icon: Home },
  { id: '3', name: 'Transporte', type: 'EXPENSE', color: '#3b82f6', icon: 'car' },
  { id: '4', name: 'Lazer', type: 'EXPENSE', color: '#8b5cf6', icon: 'gamepad-2' },
  { id: '5', name: 'Salário', type: 'INCOME', color: '#10b981', icon: Briefcase },
  { id: '6', name: 'Trabalho', type: 'INCOME', color: '#8b5cf6', icon: Briefcase },
  { id: '7', name: 'Investimentos', type: 'INCOME', color: '#059669', icon: 'trending-up' },
  { id: '8', name: 'Outros', type: 'BOTH', color: '#6b7280', icon: 'more-horizontal' }
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

function TransactionsContent() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'EXPENSE',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    accountId: '',
    notes: '',
    tags: '',
    isPaid: true,
    isConfirmed: true
  })
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.tags?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'ALL' || transaction.type === filterType
    
    return matchesSearch && matchesType
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulação de salvamento - substituir por integração real com backend
      await new Promise(resolve => setTimeout(resolve, 1000))

      const transactionData = {
        ...formData,
        id: editingTransaction?.id || Date.now().toString(),
        amount: formData.type === 'EXPENSE' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)),
        category: mockCategories.find(c => c.id === formData.categoryId) || mockCategories[7],
        account: mockAccounts.find(a => a.id === formData.accountId) || mockAccounts[0],
        createdAt: editingTransaction?.createdAt || new Date().toISOString()
      }

      if (editingTransaction) {
        // Atualizar transação existente
        setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? transactionData : t))
      } else {
        // Criar nova transação
        setTransactions(prev => [transactionData, ...prev])
      }

      // Resetar formulário e fechar diálogo
      setFormData({
        description: '',
        amount: '',
        type: 'EXPENSE',
        date: new Date().toISOString().split('T')[0],
        categoryId: '',
        accountId: '',
        notes: '',
        tags: '',
        isPaid: true,
        isConfirmed: true
      })
      setEditingTransaction(null)
      setIsDialogOpen(false)
    } catch (err) {
      setError('Erro ao salvar transação. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setFormData({
      description: transaction.description,
      amount: Math.abs(transaction.amount).toString(),
      type: transaction.type,
      date: transaction.date,
      categoryId: transaction.category.id,
      accountId: transaction.account.id,
      notes: transaction.notes || '',
      tags: transaction.tags || '',
      isPaid: transaction.isPaid,
      isConfirmed: transaction.isConfirmed
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (transactionId: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        // Simulação de exclusão - substituir por integração real com backend
        await new Promise(resolve => setTimeout(resolve, 500))
        setTransactions(prev => prev.filter(t => t.id !== transactionId))
      } catch (err) {
        setError('Erro ao excluir transação. Tente novamente.')
      }
    }
  }

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lançamentos</h1>
            <p className="text-muted-foreground">
              Registre e gerencie suas receitas e despesas
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingTransaction(null)
                  setFormData({
                    description: '',
                    amount: '',
                    type: 'EXPENSE',
                    date: new Date().toISOString().split('T')[0],
                    categoryId: '',
                    accountId: '',
                    notes: '',
                    tags: '',
                    isPaid: true,
                    isConfirmed: true
                  })
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Lançamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingTransaction ? 'Editar Lançamento' : 'Novo Lançamento'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTransaction ? 'Atualize as informações do lançamento.' : 'Adicione uma nova receita ou despesa.'}
                  </DialogDescription>
                </DialogHeader>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'INCOME' | 'EXPENSE' }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INCOME">Receita</SelectItem>
                        <SelectItem value="EXPENSE">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Ex: Salário, Supermercado"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0,00"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoryId">Categoria</Label>
                      <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCategories
                            .filter(cat => cat.type === formData.type || cat.type === 'BOTH')
                            .map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center gap-2">
                                  <category.icon className="h-4 w-4" style={{ color: category.color }} />
                                  {category.name}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountId">Conta</Label>
                    <Select value={formData.accountId} onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Adicione notas ou detalhes..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (opcional)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="separadas por vírgula"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPaid"
                      checked={formData.isPaid}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPaid: checked }))}
                    />
                    <Label htmlFor="isPaid">Pago/Recebido</Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : editingTransaction ? 'Atualizar' : 'Criar'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Receitas
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
              <p className="text-xs text-muted-foreground">
                {transactions.filter(t => t.type === 'INCOME').length} transações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Despesas
              </CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">
                {transactions.filter(t => t.type === 'EXPENSE').length} transações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Saldo do Período
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
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
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar transações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="INCOME">Receitas</SelectItem>
                    <SelectItem value="EXPENSE">Despesas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Transações */}
        <div className="space-y-2">
          {filteredTransactions.map((transaction) => {
            const isIncome = transaction.type === 'INCOME'
            const CategoryIcon = transaction.category.icon

            return (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        isIncome ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {isIncome ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{transaction.description}</h3>
                          <Badge variant="secondary" style={{ backgroundColor: transaction.category.color + '20', color: transaction.category.color }}>
                            {transaction.category.name}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.account.name} • {formatDate(transaction.date)}
                          {transaction.notes && ` • ${transaction.notes}`}
                        </div>
                        {transaction.tags && (
                          <div className="flex gap-1 mt-1">
                            {transaction.tags.split(',').map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        isIncome ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isIncome ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || filterType !== 'ALL' 
                  ? 'Nenhuma transação corresponde aos filtros selecionados.'
                  : 'Comece adicionando sua primeira transação para começar a controlar suas finanças.'
                }
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingTransaction(null)
                    setFormData({
                      description: '',
                      amount: '',
                      type: 'EXPENSE',
                      date: new Date().toISOString().split('T')[0],
                      categoryId: '',
                      accountId: '',
                      notes: '',
                      tags: '',
                      isPaid: true,
                      isConfirmed: true
                    })
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeira Transação
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <WithAuth>
      <TransactionsContent />
    </WithAuth>
  )
}