import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookPlus, Edit, Trash2, BookOpen, Tag, GraduationCap } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CourseAdminAPI } from "@/api/admin/controllers/CourseAdminAPI"
import { CourseCategoryAdminAPI } from "@/api/admin/controllers/CourseCategoryAdminAPI"
import { CourseResponseDTO } from "@/api/dtos/courseDtos"
import { CourseCategoryResponseDTO, CourseCategoryCreateDTO } from "@/api/dtos/courseCategoryDtos"

interface CourseCreateDTO {
  name: string
  description: string
  imageUrl: string
  categoryIds: string[]
  level: string
  duration: number
  creatorId: string
}

const AdminCourses = () => {
  const { toast } = useToast()
  const [courses, setCourses] = useState<CourseResponseDTO[]>([])
  const [categories, setCategories] = useState<CourseCategoryResponseDTO[]>([])
  const [isNewCourseOpen, setIsNewCourseOpen] = useState(false)
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false)
  const [isDeleteCourseDialogOpen, setIsDeleteCourseDialogOpen] = useState(false)
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false)
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false)
  const [isCategoriesListOpen, setIsCategoriesListOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<CourseResponseDTO | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCourses()
    fetchCategories()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await CourseAdminAPI.getAllCourses()
      setCourses(response)
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao carregar cursos", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await CourseCategoryAdminAPI.getAllCategories()
      setCategories(response)
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao carregar categorias", variant: "destructive" })
    }
  }

  const handleNewCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newCourse: CourseCreateDTO = {
      name: formData.get("title") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string || "",
      categoryIds: selectedCategories,
      level: formData.get("level") as string,
      duration: Number(formData.get("duration")),
      creatorId: localStorage.getItem("userId") || ""
    }

    try {
      await CourseAdminAPI.createCourse(newCourse)
      setIsNewCourseOpen(false)
      setSelectedCategories([])
      fetchCourses()
      toast({ title: "Curso criado", description: "O novo curso foi criado com sucesso." })
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao criar curso", variant: "destructive" })
    }
  }

  const handleEditCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedCourse) return

    const formData = new FormData(e.currentTarget)
    const updatedCourse: CourseCreateDTO = {
      name: formData.get("editTitle") as string,
      description: formData.get("editDescription") as string,
      imageUrl: formData.get("editImageUrl") as string || "",
      categoryIds: selectedCategories,
      level: formData.get("editLevel") as string,
      duration: Number(formData.get("editDuration")),
      creatorId: selectedCourse.creator.id
    }

    try {
      await CourseAdminAPI.updateCourse(selectedCourse.id, updatedCourse)
      setIsEditCourseOpen(false)
      setSelectedCategories([])
      fetchCourses()
      toast({ title: "Curso atualizado", description: "O curso foi atualizado com sucesso." })
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao atualizar curso", variant: "destructive" })
    }
  }

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return
    try {
      await CourseAdminAPI.deleteCourse(selectedCourse.id)
      setIsDeleteCourseDialogOpen(false)
      fetchCourses()
      toast({ title: "Curso removido", description: "O curso foi removido com sucesso." })
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao remover curso", variant: "destructive" })
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({ title: "Erro", description: "O nome da categoria é obrigatório", variant: "destructive" })
      return
    }

    try {
      const categoryDTO: CourseCategoryCreateDTO = {
        categoryName: newCategoryName
      }
      await CourseCategoryAdminAPI.createCategory(categoryDTO)
      setIsNewCategoryOpen(false)
      setNewCategoryName("")
      fetchCategories()
      toast({ title: "Categoria criada", description: "A nova categoria foi criada com sucesso." })
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao criar categoria", variant: "destructive" })
    }
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) return
    try {
      await CourseCategoryAdminAPI.deleteCategory(selectedCategoryId)
      setIsDeleteCategoryDialogOpen(false)
      setSelectedCategoryId(null)
      fetchCategories()
      toast({ title: "Categoria removida", description: "A categoria foi removida com sucesso." })
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao remover categoria", variant: "destructive" })
    }
  }

  const openEditDialog = (course: CourseResponseDTO) => {
    setSelectedCourse(course)
    setSelectedCategories(course.categories.length > 0 ? Array.from(course.categories).map(cat => cat.id) : [])
    setIsEditCourseOpen(true)
  }

  const openDeleteCourseDialog = (course: CourseResponseDTO) => {
    setSelectedCourse(course)
    setIsDeleteCourseDialogOpen(true)
  }

  const openDeleteCategoryDialog = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setIsDeleteCategoryDialogOpen(true)
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Cursos
            <span className="text-primary ml-2">{courses.length}</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os cursos da plataforma
          </p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={() => setIsNewCategoryOpen(true)}
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Tag className="w-5 h-5 mr-2" />
            Nova Categoria
          </Button>
          <Button 
            onClick={() => setIsCategoriesListOpen(true)}
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Listar Categorias
          </Button>
          <Button 
            onClick={() => setIsNewCourseOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <BookPlus className="w-5 h-5 mr-2" />
            Novo Curso
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar cursos..." 
          className="pl-10 py-6 text-lg" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Carregando cursos...</p>
        ) : filteredCourses.map(course => (
          <Card key={course.id} className="group hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap gap-2">
                  {course.categories.length > 0 ? (
                    Array.from(course.categories).map(cat => (
                      <Badge key={cat.id} variant="outline" className="bg-primary/10 text-primary">
                        {cat.categoryName}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      Sem categoria
                    </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-xl mb-2">{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-sm">Criador</span>
                    </div>
                    <p className="text-sm font-semibold">{course.creator.name || course.creator.id}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">Duração</span>
                    </div>
                    <p className="text-2xl font-semibold">{course.duration}h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => openEditDialog(course)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => openDeleteCourseDialog(course)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Course Dialog */}
      <Dialog open={isNewCourseOpen} onOpenChange={(open) => {
        setIsNewCourseOpen(open)
        if (!open) {
          setSelectedCategories([])
        }
      }}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Curso</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo curso abaixo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewCourse} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do curso</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" required className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Imagem do curso</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="URL da imagem"
                required={false}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categorias</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedCategories.length > 0
                        ? `${selectedCategories.length} selecionada(s)`
                        : "Selecione categorias"}
                      <span>▼</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full">
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {categories.map(cat => (
                        <div key={cat.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cat-${cat.id}`}
                            checked={selectedCategories.includes(cat.id)}
                            onCheckedChange={() => toggleCategory(cat.id)}
                          />
                          <label htmlFor={`cat-${cat.id}`} className="text-sm">
                            {cat.categoryName}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Nível</Label>
                <Select name="level">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermediário</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (em horas)</Label>
              <Input id="duration" name="duration" type="number" min="1" required />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600">
                Criar Curso
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditCourseOpen} onOpenChange={(open) => {
        setIsEditCourseOpen(open)
        if (!open) {
          setSelectedCategories([])
        }
      }}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
            <DialogDescription>
              Edite as informações do curso {selectedCourse?.name}.
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <form onSubmit={handleEditCourse} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editTitle">Título do curso</Label>
                <Input id="editTitle" name="editTitle" defaultValue={selectedCourse.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDescription">Descrição</Label>
                <Textarea 
                  id="editDescription" 
                  name="editDescription"
                  defaultValue={selectedCourse.description}
                  required 
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editImageUrl">Imagem do curso</Label>
                <Input
                  id="editImageUrl"
                  name="editImageUrl"
                  placeholder="URL da imagem"
                  defaultValue={selectedCourse.imageUrl}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categorias</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedCategories.length > 0
                          ? `${selectedCategories.length} selecionada(s)`
                          : "Selecione categorias"}
                        <span>▼</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full">
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {categories.map(cat => (
                          <div key={cat.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-cat-${cat.id}`}
                              checked={selectedCategories.includes(cat.id)}
                              onCheckedChange={() => toggleCategory(cat.id)}
                            />
                            <label htmlFor={`edit-cat-${cat.id}`} className="text-sm">
                              {cat.categoryName}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLevel">Nível</Label>
                  <Select name="editLevel" defaultValue={selectedCourse.level}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante</SelectItem>
                      <SelectItem value="intermediate">Intermediário</SelectItem>
                      <SelectItem value="advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDuration">Duração (em horas)</Label>
                <Input 
                  id="editDuration" 
                  name="editDuration" 
                  type="number" 
                  min="1" 
                  defaultValue={selectedCourse.duration} 
                  required 
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Course Confirmation Dialog */}
      <AlertDialog open={isDeleteCourseDialogOpen} onOpenChange={setIsDeleteCourseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Curso</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o curso {selectedCourse?.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCourse}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Category Confirmation Dialog */}
      <AlertDialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta categoria? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New Category Dialog */}
      <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
            <DialogDescription>
              Adicione uma nova categoria de curso
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Nome da Categoria</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex: Programação, Design, Marketing"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button"
              onClick={handleCreateCategory}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              Criar Categoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Categories List Dialog */}
      <Dialog open={isCategoriesListOpen} onOpenChange={setIsCategoriesListOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Categorias Existentes</DialogTitle>
            <DialogDescription>
              Lista de todas as categorias disponíveis
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {categories.length === 0 ? (
              <p className="text-center text-muted-foreground">Nenhuma categoria encontrada</p>
            ) : (
              categories.map(category => (
                <div 
                  key={category.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{category.categoryName}</p>
                    <p className="text-sm text-muted-foreground">
                      Criado por: {category.user?.name || category.user?.id}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteCategoryDialog(category.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar
                  </Button>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCategoriesListOpen(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminCourses