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
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Edit, Trash2, CreditCard, Wallet, PiggyBank, Smartphone, Building, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { WithAuth } from '@/components/with-auth'

// Dados mockados para desenvolvimento
const mockAccounts = [
  {
    id: '1',
    name: 'Conta Corrente',
    type: 'CHECKING',
    balance: 8500.50,
    initialBalance: 0,
    bankName: 'Banco do Brasil',
    agency: '1234-5',
    accountNumber: '56789-0',
    color: '#6366f1',
    icon: 'building',
    isActive: true,
    isDefault: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Cartão Nubank',
    type: 'CREDIT_CARD',
    balance: -1235.25,
    initialBalance: 0,
    bankName: 'Nubank',
    creditLimit: 5000,
    closingDay: 10,
    dueDay: 15,
    color: '#8b5cf6',
    icon: 'credit-card',
    isActive: true,
    isDefault: false,
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Poupança',
    type: 'SAVINGS',
    balance: 5235.50,
    initialBalance: 5000,
    bankName: 'Caixa Econômica',
    agency: '6789-0',
    accountNumber: '12345-6',
    color: '#10b981',
    icon: 'piggy-bank',
    isActive: true,
    isDefault: false,
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    name: 'Carteira Digital',
    type: 'DIGITAL',
    balance: 250.00,
    initialBalance: 0,
    color: '#f59e0b',
    icon: 'smartphone',
    isActive: true,
    isDefault: false,
    createdAt: '2024-03-05'
  }
]

const accountTypes = [
  { value: 'CHECKING', label: 'Conta Corrente', icon: Building },
  { value: 'SAVINGS', label: 'Poupança', icon: PiggyBank },
  { value: 'CREDIT_CARD', label: 'Cartão de Crédito', icon: CreditCard },
  { value: 'DIGITAL', label: 'Carteira Digital', icon: Smartphone },
  { value: 'CASH', label: 'Dinheiro', icon: Wallet },
  { value: 'INVESTMENT', label: 'Investimento', icon: TrendingUp },
  { value: 'OTHER', label: 'Outros', icon: Wallet }
]

const getAccountTypeInfo = (type: string) => {
  const accountType = accountTypes.find(t => t.value === type)
  return accountType || accountTypes[6] // OTHER como fallback
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

function AccountsContent() {
  const [accounts, setAccounts] = useState(mockAccounts)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'CHECKING',
    balance: 0,
    initialBalance: 0,
    bankName: '',
    agency: '',
    accountNumber: '',
    creditLimit: 0,
    closingDay: 1,
    dueDay: 1,
    color: '#6366f1',
    icon: 'wallet'
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulação de salvamento - substituir por integração real com backend
      await new Promise(resolve => setTimeout(resolve, 1000))

      const accountData = {
        ...formData,
        id: editingAccount?.id || Date.now().toString(),
        isActive: true,
        isDefault: editingAccount?.isDefault || false,
        createdAt: editingAccount?.createdAt || new Date().toISOString()
      }

      if (editingAccount) {
        // Atualizar conta existente
        setAccounts(prev => prev.map(acc => acc.id === editingAccount.id ? accountData : acc))
      } else {
        // Criar nova conta
        setAccounts(prev => [...prev, accountData])
      }

      // Resetar formulário e fechar diálogo
      setFormData({
        name: '',
        type: 'CHECKING',
        balance: 0,
        initialBalance: 0,
        bankName: '',
        agency: '',
        accountNumber: '',
        creditLimit: 0,
        closingDay: 1,
        dueDay: 1,
        color: '#6366f1',
        icon: 'wallet'
      })
      setEditingAccount(null)
      setIsDialogOpen(false)
    } catch (err) {
      setError('Erro ao salvar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (account: any) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance,
      initialBalance: account.initialBalance,
      bankName: account.bankName || '',
      agency: account.agency || '',
      accountNumber: account.accountNumber || '',
      creditLimit: account.creditLimit || 0,
      closingDay: account.closingDay || 1,
      dueDay: account.dueDay || 1,
      color: account.color,
      icon: account.icon
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (accountId: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      try {
        // Simulação de exclusão - substituir por integração real com backend
        await new Promise(resolve => setTimeout(resolve, 500))
        setAccounts(prev => prev.filter(acc => acc.id !== accountId))
      } catch (err) {
        setError('Erro ao excluir conta. Tente novamente.')
      }
    }
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contas</h1>
            <p className="text-muted-foreground">
              Gerencie suas contas bancárias e cartões
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingAccount(null)
                setFormData({
                  name: '',
                  type: 'CHECKING',
                  balance: 0,
                  initialBalance: 0,
                  bankName: '',
                  agency: '',
                  accountNumber: '',
                  creditLimit: 0,
                  closingDay: 1,
                  dueDay: 1,
                  color: '#6366f1',
                  icon: 'wallet'
                })
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAccount ? 'Editar Conta' : 'Nova Conta'}
                </DialogTitle>
                <DialogDescription>
                  {editingAccount ? 'Atualize as informações da conta.' : 'Adicione uma nova conta ao seu painel.'}
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
                  <Label htmlFor="name">Nome da Conta</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Conta Corrente"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Conta</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'CREDIT_CARD' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="creditLimit">Limite de Crédito</Label>
                      <Input
                        id="creditLimit"
                        type="number"
                        value={formData.creditLimit}
                        onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: Number(e.target.value) }))}
                        placeholder="5000"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="closingDay">Dia de Fechamento</Label>
                        <Input
                          id="closingDay"
                          type="number"
                          min="1"
                          max="31"
                          value={formData.closingDay}
                          onChange={(e) => setFormData(prev => ({ ...prev, closingDay: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDay">Dia de Vencimento</Label>
                        <Input
                          id="dueDay"
                          type="number"
                          min="1"
                          max="31"
                          value={formData.dueDay}
                          onChange={(e) => setFormData(prev => ({ ...prev, dueDay: Number(e.target.value) }))}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="balance">Saldo Atual</Label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData(prev => ({ ...prev, balance: Number(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">Banco (opcional)</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="Ex: Banco do Brasil"
                  />
                </div>

                {(formData.type === 'CHECKING' || formData.type === 'SAVINGS') && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="agency">Agência (opcional)</Label>
                      <Input
                        id="agency"
                        value={formData.agency}
                        onChange={(e) => setFormData(prev => ({ ...prev, agency: e.target.value }))}
                        placeholder="1234-5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Conta (opcional)</Label>
                      <Input
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                        placeholder="56789-0"
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : editingAccount ? 'Atualizar' : 'Criar'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Contas
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accounts.length}</div>
              <p className="text-xs text-muted-foreground">
                Contas cadastradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Saldo Consolidado
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalBalance)}
              </div>
              <p className="text-xs text-muted-foreground">
                Saldo total de todas as contas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Limite Total
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(accounts
                  .filter(acc => acc.type === 'CREDIT_CARD')
                  .reduce((sum, acc) => sum + (acc.creditLimit || 0), 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Somatório dos limites de crédito
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Contas */}
        <div className="grid gap-4">
          {accounts.map((account) => {
            const accountTypeInfo = getAccountTypeInfo(account.type)
            const AccountIcon = accountTypeInfo.icon

            return (
              <Card key={account.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: account.color + '20' }}>
                        <AccountIcon className="h-6 w-6" style={{ color: account.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{account.name}</h3>
                          <Badge variant="secondary">{accountTypeInfo.label}</Badge>
                          {account.isDefault && (
                            <Badge variant="default">Padrão</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {account.bankName && `${account.bankName}`}
                          {account.agency && account.accountNumber && ` • Agência ${account.agency} • Conta ${account.accountNumber}`}
                          {account.type === 'CREDIT_CARD' && account.closingDay && account.dueDay && ` • Fecha dia ${account.closingDay} • Vence dia ${account.dueDay}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        account.balance < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(account.balance)}
                      </p>
                      {account.type === 'CREDIT_CARD' && account.creditLimit && (
                        <p className="text-sm text-muted-foreground">
                          Limite: {formatCurrency(account.creditLimit)}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(account)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(account.id)}
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

        {accounts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma conta cadastrada</h3>
              <p className="text-muted-foreground text-center mb-4">
                Comece adicionando sua primeira conta para começar a controlar suas finanças.
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingAccount(null)
                    setFormData({
                      name: '',
                      type: 'CHECKING',
                      balance: 0,
                      initialBalance: 0,
                      bankName: '',
                      agency: '',
                      accountNumber: '',
                      creditLimit: 0,
                      closingDay: 1,
                      dueDay: 1,
                      color: '#6366f1',
                      icon: 'wallet'
                    })
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeira Conta
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

export default function AccountsPage() {
  return (
    <WithAuth>
      <AccountsContent />
    </WithAuth>
  )
}