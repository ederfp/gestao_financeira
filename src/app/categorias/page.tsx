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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Trash2, Folder, FolderOpen, Tag, Palette, Hash, AlertCircle } from 'lucide-react'
import { WithAuth } from '@/components/with-auth'

// Dados mockados para desenvolvimento
const mockCategories = [
  {
    id: '1',
    name: 'Alimentação',
    type: 'EXPENSE',
    color: '#ef4444',
    icon: 'shopping-cart',
    isSystem: true,
    isActive: true,
    parentId: null,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Moradia',
    type: 'EXPENSE',
    color: '#f59e0b',
    icon: 'home',
    isSystem: true,
    isActive: true,
    parentId: null,
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Transporte',
    type: 'EXPENSE',
    color: '#3b82f6',
    icon: 'car',
    isSystem: true,
    isActive: true,
    parentId: null,
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Lazer',
    type: 'EXPENSE',
    color: '#8b5cf6',
    icon: 'gamepad-2',
    isSystem: true,
    isActive: true,
    parentId: null,
    createdAt: '2024-01-01'
  },
  {
    id: '5',
    name: 'Salário',
    type: 'INCOME',
    color: '#10b981',
    icon: 'briefcase',
    isSystem: true,
    isActive: true,
    parentId: null,
    createdAt: '2024-01-01'
  },
  {
    id: '6',
    name: 'Trabalho',
    type: 'INCOME',
    color: '#8b5cf6',
    icon: 'briefcase',
    isSystem: true,
    isActive: true,
    parentId: null,
    createdAt: '2024-01-01'
  },
  {
    id: '7',
    name: 'Investimentos',
    type: 'INCOME',
    color: '#059669',
    icon: 'trending-up',
    isSystem: true,
    isActive: true,
    parentId: null,
    createdAt: '2024-01-01'
  },
  {
    id: '8',
    name: 'Outros',
    type: 'BOTH',
    color: '#6b7280',
    icon: 'more-horizontal',
    isSystem: true,
    isActive: true,
    parentId: null,
    createdAt: '2024-01-01'
  },
  {
    id: '9',
    name: 'Supermercado',
    type: 'EXPENSE',
    color: '#ef4444',
    icon: 'shopping-basket',
    isSystem: false,
    isActive: true,
    parentId: '1',
    createdAt: '2024-02-15'
  },
  {
    id: '10',
    name: 'Restaurante',
    type: 'EXPENSE',
    color: '#ef4444',
    icon: 'utensils',
    isSystem: false,
    isActive: true,
    parentId: '1',
    createdAt: '2024-02-16'
  }
]

const categoryTypes = [
  { value: 'INCOME', label: 'Receita' },
  { value: 'EXPENSE', label: 'Despesa' },
  { value: 'BOTH', label: 'Ambos' }
]

const iconOptions = [
  'home', 'building', 'shopping-cart', 'shopping-basket', 'utensils', 'coffee',
  'car', 'bus', 'bike', 'plane', 'gamepad-2', 'music', 'film', 'book',
  'briefcase', 'trending-up', 'piggy-bank', 'credit-card', 'wallet', 'dollar-sign',
  'heart', 'gift', 'graduation-cap', 'stethoscope', 'pill', 'smartphone',
  'laptop', 'monitor', 'headphones', 'camera', 'image', 'file-text', 'more-horizontal'
]

const colorOptions = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899',
  '#f97316', '#84cc16', '#06b6d4', '#6366f1', '#a855f7', '#d946ef',
  '#dc2626', '#ea580c', '#059669', '#2563eb', '#7c3aed', '#db2777'
]

function CategoriesContent() {
  const [categories, setCategories] = useState(mockCategories)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'EXPENSE',
    color: '#6366f1',
    icon: 'folder',
    parentId: '',
    isActive: true
  })
  const [error, setError] = useState('')

  const mainCategories = categories.filter(cat => !cat.parentId)
  const subCategories = categories.filter(cat => cat.parentId)

  const getSubcategories = (parentId: string) => {
    return subCategories.filter(cat => cat.parentId === parentId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulação de salvamento - substituir por integração real com backend
      await new Promise(resolve => setTimeout(resolve, 1000))

      const categoryData = {
        ...formData,
        id: editingCategory?.id || Date.now().toString(),
        isSystem: false,
        createdAt: editingCategory?.createdAt || new Date().toISOString()
      }

      if (editingCategory) {
        // Atualizar categoria existente
        setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? categoryData : cat))
      } else {
        // Criar nova categoria
        setCategories(prev => [...prev, categoryData])
      }

      // Resetar formulário e fechar diálogo
      setFormData({
        name: '',
        type: 'EXPENSE',
        color: '#6366f1',
        icon: 'folder',
        parentId: '',
        isActive: true
      })
      setEditingCategory(null)
      setIsDialogOpen(false)
    } catch (err) {
      setError('Erro ao salvar categoria. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      parentId: category.parentId || '',
      isActive: category.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (categoryId: string) => {
    // Verificar se há subcategorias
    const hasSubcategories = categories.some(cat => cat.parentId === categoryId)
    
    if (hasSubcategories) {
      setError('Não é possível excluir esta categoria porque ela possui subcategorias.')
      return
    }

    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        // Simulação de exclusão - substituir por integração real com backend
        await new Promise(resolve => setTimeout(resolve, 500))
        setCategories(prev => prev.filter(cat => cat.id !== categoryId))
      } catch (err) {
        setError('Erro ao excluir categoria. Tente novamente.')
      }
    }
  }

  const handleToggleActive = async (categoryId: string, isActive: boolean) => {
    try {
      // Simulação de atualização - substituir por integração real com backend
      await new Promise(resolve => setTimeout(resolve, 300))
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? { ...cat, isActive } : cat
      ))
    } catch (err) {
      setError('Erro ao atualizar categoria. Tente novamente.')
    }
  }

  const getCategoryTypeInfo = (type: string) => {
    return categoryTypes.find(t => t.value === type) || categoryTypes[0]
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
            <p className="text-muted-foreground">
              Organize suas receitas e despesas em categorias personalizadas
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingCategory(null)
                setFormData({
                  name: '',
                  type: 'EXPENSE',
                  color: '#6366f1',
                  icon: 'folder',
                  parentId: '',
                  isActive: true
                })
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory ? 'Atualize as informações da categoria.' : 'Crie uma nova categoria para organizar seus lançamentos.'}
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
                  <Label htmlFor="name">Nome da Categoria</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Alimentação"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Ícone</Label>
                    <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center text-xs">
                                  {icon.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              {icon}
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
                  <Label htmlFor="parentId">Categoria Pai (opcional)</Label>
                  <Select value={formData.parentId} onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhuma (categoria principal)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma (categoria principal)</SelectItem>
                      {mainCategories
                        .filter(cat => cat.id !== editingCategory?.id)
                        .map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Categoria ativa</Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : editingCategory ? 'Atualizar' : 'Criar'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid gap-4">
              {mainCategories.map((category) => {
                const subcategories = getSubcategories(category.id)
                const categoryTypeInfo = getCategoryTypeInfo(category.type)

                return (
                  <div key={category.id}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: category.color + '20' }}>
                              <div className="w-6 h-6 flex items-center justify-center">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{category.name}</h3>
                                <Badge variant="secondary">{categoryTypeInfo.label}</Badge>
                                {category.isSystem && (
                                  <Badge variant="outline">Sistema</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {subcategories.length} subcategoria{subcategories.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={category.isActive}
                              onCheckedChange={(checked) => handleToggleActive(category.id, checked)}
                              disabled={category.isSystem}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(category)}
                              disabled={category.isSystem}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(category.id)}
                              disabled={category.isSystem}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Subcategorias */}
                    {subcategories.length > 0 && (
                      <div className="ml-8 space-y-2">
                        {subcategories.map((subcategory) => {
                          const subcategoryTypeInfo = getCategoryTypeInfo(subcategory.type)

                          return (
                            <Card key={subcategory.id}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: subcategory.color + '20' }}>
                                      <div className="w-4 h-4 flex items-center justify-center">
                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: subcategory.color }} />
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-medium">{subcategory.name}</h4>
                                        <Badge variant="outline" className="text-xs">
                                          {subcategoryTypeInfo.label}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={subcategory.isActive}
                                      onCheckedChange={(checked) => handleToggleActive(subcategory.id, checked)}
                                    />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEdit(subcategory)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDelete(subcategory.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Categorias
                  </CardTitle>
                  <Folder className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {categories.filter(c => c.isActive).length} ativas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Categorias de Receita
                  </CardTitle>
                  <Tag className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {categories.filter(c => c.type === 'INCOME' || c.type === 'BOTH').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Para registro de receitas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Categorias de Despesa
                  </CardTitle>
                  <Tag className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {categories.filter(c => c.type === 'EXPENSE' || c.type === 'BOTH').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Para registro de despesas
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Categorias por Tipo</CardTitle>
                <CardDescription>
                  Distribuição das categorias por tipo de lançamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryTypes.map((type) => {
                    const typeCategories = categories.filter(c => c.type === type.value)
                    const activeCategories = typeCategories.filter(c => c.isActive)

                    return (
                      <div key={type.value} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <span className="font-medium">{type.label}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {activeCategories.length} de {typeCategories.length} ativas
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

export default function CategoriesPage() {
  return (
    <WithAuth>
      <CategoriesContent />
    </WithAuth>
  )
}