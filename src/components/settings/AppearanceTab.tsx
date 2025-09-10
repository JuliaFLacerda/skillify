
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Sun, Palette } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface AppearanceTabProps {
  theme: string | undefined
  onThemeChange: (theme: string) => void
  themeColor?: string
  onThemeColorChange: (color: string) => void
  themeStyle?: string
  onThemeStyleChange: (style: string) => void
}

const themeColors = [
  { name: "Roxo", value: "purple", class: "bg-[#6366f1]" },
  { name: "Azul", value: "blue", class: "bg-[#0ea5e9]" },
  { name: "Verde", value: "green", class: "bg-[#22c55e]" },
  { name: "Rosa", value: "pink", class: "bg-[#ec4899]" },
  { name: "Laranja", value: "orange", class: "bg-[#f97316]" },
]

const themeStyles = [
  { name: "Padrão", value: "default" },
  { name: "Minimalista", value: "minimal" },
  { name: "Glassmorphism", value: "glass" },
]

export function AppearanceTab({ 
  theme, 
  onThemeChange,
  themeColor = "purple",
  onThemeColorChange,
  themeStyle = "default",
  onThemeStyleChange,
}: AppearanceTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tema e Aparência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Tema da Interface</Label>
                <p className="text-sm text-muted-foreground">
                  Escolha entre tema claro ou escuro
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Alternar tema</span>
              </Button>
            </div>

            <div className="space-y-4">
              <Label>Cor de Destaque</Label>
              <div className="grid grid-cols-5 gap-4">
                {themeColors.map((color) => (
                  <button
                    key={color.value}
                    className={cn(
                      "h-8 w-full rounded-md border-2 border-muted transition-all hover:scale-105",
                      color.class,
                      themeColor === color.value && "border-primary"
                    )}
                    onClick={() => onThemeColorChange(color.value)}
                    role="radio"
                    aria-label={`Tema cor ${color.name}`}
                    aria-checked={themeColor === color.value}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Estilo Visual</Label>
              <RadioGroup 
                value={themeStyle} 
                onValueChange={onThemeStyleChange}
                className="grid grid-cols-3 gap-4"
              >
                {themeStyles.map((style) => (
                  <div key={style.value}>
                    <RadioGroupItem
                      value={style.value}
                      id={style.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={style.value}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Palette className="mb-2 h-6 w-6" />
                      <p className="text-sm font-medium">{style.name}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências de Visualização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Formato de Data</Label>
              <p className="text-sm text-muted-foreground">
                Escolha como as datas serão exibidas
              </p>
            </div>
            <Select defaultValue="dd/MM/yyyy">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Formato de data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Fuso Horário</Label>
              <p className="text-sm text-muted-foreground">
                Defina seu fuso horário
              </p>
            </div>
            <Select defaultValue="America/Sao_Paulo">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Fuso horário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Sao_Paulo">
                  São Paulo (GMT-3)
                </SelectItem>
                <SelectItem value="America/New_York">
                  New York (GMT-4)
                </SelectItem>
                <SelectItem value="Europe/London">
                  London (GMT+1)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
