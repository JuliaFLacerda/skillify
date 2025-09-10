
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, FileText, Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, Link } from "react-router-dom";

// Mock data for demonstration
const courseLessons = [
  {
    id: "module1",
    title: "Fundamentos",
    lessons: [
      { id: "l1", title: "Introdução ao curso", duration: "15:30", completed: true, type: "video" },
      { id: "l2", title: "Conceitos básicos", duration: "22:45", completed: true, type: "video" },
      { id: "l3", title: "Exercícios práticos", duration: "30:00", completed: false, type: "exercise" },
    ]
  },
  {
    id: "module2",
    title: "Técnicas Intermediárias",
    lessons: [
      { id: "l4", title: "Estratégias avançadas", duration: "28:15", completed: false, type: "video" },
      { id: "l5", title: "Estudo de caso", duration: "40:10", completed: false, type: "document" },
      { id: "l6", title: "Exercícios de fixação", duration: "25:00", completed: false, type: "exercise" },
    ]
  },
  {
    id: "module3",
    title: "Avançado",
    lessons: [
      { id: "l7", title: "Tópicos avançados", duration: "35:20", completed: false, type: "video" },
      { id: "l8", title: "Projeto prático", duration: "01:15:00", completed: false, type: "project" },
      { id: "l9", title: "Avaliação final", duration: "45:00", completed: false, type: "quiz" },
    ]
  }
];

// Helper to get icon based on content type
const getLessonIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Play className="w-4 h-4" />;
    case "document":
      return <FileText className="w-4 h-4" />;
    case "exercise":
    case "quiz":
      return <BookOpen className="w-4 h-4" />;
    case "project":
      return <FileText className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

export default function ViewAllLessons() {
  const { id } = useParams<{ id: string }>();
  const [activeModule, setActiveModule] = useState("module1");
  
  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/cursos">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" /> Voltar aos cursos
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mt-2">Todas as Aulas</h1>
          <p className="text-muted-foreground">
            Curso: {id ? `#${id}` : "Curso não especificado"}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button>
            <BookOpen className="mr-2 h-4 w-4" />
            Material complementar
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeModule} onValueChange={setActiveModule} className="w-full">
        <TabsList className="mb-4 flex w-full overflow-x-auto">
          {courseLessons.map((module) => (
            <TabsTrigger 
              key={module.id} 
              value={module.id}
              className="flex-1"
            >
              {module.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {courseLessons.map((module) => (
          <TabsContent key={module.id} value={module.id} className="space-y-4">
            <div className="grid gap-4">
              {module.lessons.map((lesson) => (
                <Card key={lesson.id} className={`${lesson.completed ? 'border-green-200 dark:border-green-900' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {lesson.completed && 
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                            Concluído
                          </Badge>
                        }
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-md bg-primary/10">
                            {getLessonIcon(lesson.type)}
                          </div>
                          <div>
                            <h3 className="font-medium">{lesson.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {lesson.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        {lesson.completed ? "Revisar" : "Iniciar"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={() => {
            const currentIndex = courseLessons.findIndex(m => m.id === activeModule);
            if (currentIndex > 0) {
              setActiveModule(courseLessons[currentIndex - 1].id);
            }
          }}
          disabled={activeModule === courseLessons[0].id}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Módulo anterior
        </Button>
        
        <Button 
          onClick={() => {
            const currentIndex = courseLessons.findIndex(m => m.id === activeModule);
            if (currentIndex < courseLessons.length - 1) {
              setActiveModule(courseLessons[currentIndex + 1].id);
            }
          }}
          disabled={activeModule === courseLessons[courseLessons.length - 1].id}
        >
          Próximo módulo
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
