import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { ClassroomMentorAPI } from "@/api/mentor/controllers/ClassroomMentorAPI";
import { ClassroomResponseDTO } from "@/api/dtos/classroomDtos";
import { CourseMentorAPI } from "@/api/mentor/controllers/CourseMentorAPI";
import { CourseResponseDTO } from "@/api/dtos/courseDtos";
import { PracticeResponseDTO } from "@/api/dtos/practiceDtos";

interface SimuladoForm {
  title: string;
  totalQuestions: string;
  duration: string;
  date: string;
  class: string;
  courses: string[];
  numberOfAllowedAttempts: string;
}

interface EditSimuladoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  simulado: PracticeResponseDTO | null;
  onSubmit: (form: SimuladoForm) => void;
}

export function EditSimuladoDialog({
  open,
  onOpenChange,
  simulado,
  onSubmit,
}: EditSimuladoDialogProps) {
  const [classrooms, setClassrooms] = useState<ClassroomResponseDTO[]>([]);
  const [courses, setCourses] = useState<CourseResponseDTO[]>([]);
  const [loading, setLoading] = useState({
    classrooms: false,
    courses: false,
  });
  const [minDate, setMinDate] = useState("");
  const [form, setForm] = useState<SimuladoForm>({
    title: "",
    totalQuestions: "",
    duration: "",
    date: "",
    class: "",
    courses: [],
    numberOfAllowedAttempts: "1",
  });

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (simulado && open) {
      setForm({
        title: simulado.title,
        totalQuestions: simulado.numberOfQuestions.toString(),
        duration: simulado.duracao.toString(),
        date: new Date(simulado.maximumDate).toISOString().split("T")[0],
        class: simulado.classroom.id,
        courses: simulado.courses.map((course) => course.id),
        numberOfAllowedAttempts: simulado.numberOfAllowedAttempts?.toString() || "1",
      });
    }
  }, [simulado, open]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          setLoading((prev) => ({ ...prev, classrooms: true, courses: true }));

          const classroomsResponse = await ClassroomMentorAPI.getAllClassrooms();
          setClassrooms(classroomsResponse);

          const coursesResponse = await CourseMentorAPI.getAllCoursesByMentor();
          setCourses(coursesResponse);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          setClassrooms([]);
          setCourses([]);
        } finally {
          setLoading((prev) => ({ ...prev, classrooms: false, courses: false }));
        }
      };
      fetchData();
    }
  }, [open]);

  const handleCourseToggle = (courseId: string) => {
    const newCourses = form.courses.includes(courseId)
      ? form.courses.filter((id) => id !== courseId)
      : [...form.courses, courseId];
    setForm({ ...form, courses: newCourses });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Editar Simulado</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Título do Simulado
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Simulado ENEM 2024"
              className="bg-white/5 border-slate-800 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalQuestions" className="text-white">
                Total de Questões
              </Label>
              <Input
                id="totalQuestions"
                type="number"
                min="1"
                value={form.totalQuestions}
                onChange={(e) =>
                  setForm({ ...form, totalQuestions: e.target.value })
                }
                placeholder="Ex: 90"
                className="bg-white/5 border-slate-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">
                Duração (minutos)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="Ex: 300"
                className="bg-white/5 border-slate-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attempts" className="text-white">
                Número de Tentativas Permitidas
              </Label>
              <Input
                id="attempts"
                type="number"
                min="1"
                value={form.numberOfAllowedAttempts}
                onChange={(e) =>
                  setForm({ ...form, numberOfAllowedAttempts: e.target.value })
                }
                placeholder="Ex: 3"
                className="bg-white/5 border-slate-800 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-white">
              Data Final do Simulado
            </Label>
            <Input
              id="date"
              type="date"
              min={minDate}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="bg-white/5 border-slate-800 text-white"
            />
            <p className="text-sm text-slate-400">
              O simulado ficará disponível até esta data
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class" className="text-white">
              Turma
            </Label>
            <Select
              value={form.class}
              onValueChange={(value) => setForm({ ...form, class: value })}
              disabled={loading.classrooms}
            >
              <SelectTrigger className="bg-white/5 border-slate-800 text-white">
                <SelectValue
                  placeholder={
                    loading.classrooms
                      ? "Carregando turmas..."
                      : "Selecione uma turma"
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800">
                {classrooms.length > 0 ? (
                  classrooms.map((classroom) => (
                    <SelectItem
                      key={classroom.id}
                      value={classroom.id}
                      className="text-white hover:bg-slate-800"
                    >
                      {classroom.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem
                    value="no-classrooms"
                    disabled
                    className="text-slate-400"
                  >
                    Nenhuma turma encontrada
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Matérias</Label>
            <div className="grid grid-cols-2 gap-2">
              {loading.courses ? (
                <p className="text-slate-400">Carregando matérias...</p>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`course-${course.id}`}
                      checked={form.courses.includes(course.id)}
                      onCheckedChange={() => handleCourseToggle(course.id)}
                      className="border-slate-700 data-[state=checked]:bg-purple-600"
                    />
                    <Label
                      htmlFor={`course-${course.id}`}
                      className="text-white"
                    >
                      {course.name}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">Nenhuma matéria encontrada</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white border-none"
            disabled={
              loading.classrooms ||
              loading.courses ||
              !form.date ||
              !form.duration ||
              !form.title ||
              !form.totalQuestions ||
              !form.class ||
              !form.numberOfAllowedAttempts
            }
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}