import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useNavigate, useSearchParams } from "react-router-dom"
import { RegisterRequest } from "@/api/dtos/authDtos"
import { AuthenticationAPI } from "@/api/AuthenticationAPI"
import { useEffect, useState } from "react"

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
})

const tokenSchema = z.object({
  token: z.string().min(1, "O token é obrigatório"),
})

export default function Register() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [classId, setClassId] = useState(searchParams.get('classId') || '')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const tokenForm = useForm<z.infer<typeof tokenSchema>>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      token: "",
    },
  })

  useEffect(() => {
    if (classId) {
      const validateClassId = async () => {
        try {
          const isValid = await AuthenticationAPI.validateToken(classId)
          if (!isValid) {
            toast({
              title: "Token inválido",
              description: "O token fornecido na URL é inválido. Insira um token válido.",
              variant: "destructive",
            })
            setClassId('')
            navigate("/register")
          }
        } catch (error) {
          toast({
            title: "Erro na validação",
            description: "Não foi possível validar o token. Tente novamente.",
            variant: "destructive",
          })
          setClassId('')
          navigate("/register")
        }
      }
      validateClassId()
    }
  }, [classId, navigate, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!classId) return

    try {
      const registerRequest: RegisterRequest = {
        name: values.name,
        email: values.email,
        password: values.password,
        tel: "",
        biography: "",
        emailNotifications: false,
        pushNotifications: false,
        weeklyReport: false,
        studyReminder: false,
        role: "ESTUDANTE"
      }

      const response = await AuthenticationAPI.registerWithClassroom(registerRequest, classId)
      localStorage.setItem('token', response.token)

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você foi cadastrado e adicionado à turma. Redirecionando para o login...",
      })
      navigate("/login")
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível realizar o cadastro ou entrar na turma. Verifique seus dados.",
        variant: "destructive",
      })
    }
  }

  async function onTokenSubmit(values: z.infer<typeof tokenSchema>) {
    try {
      const isValid = await AuthenticationAPI.validateToken(values.token)
      if (isValid) {
        setClassId(values.token)
        toast({
          title: "Token válido",
          description: "Token verificado com sucesso. Preencha os dados de cadastro.",
        })
      } else {
        toast({
          title: "Token inválido",
          description: "O token inserido não é válido. Verifique e tente novamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro na validação",
        description: "Não foi possível validar o token. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  if (!classId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-8 max-w-md w-full">
          <Form {...tokenForm}>
            <form onSubmit={tokenForm.handleSubmit(onTokenSubmit)} className="space-y-6">
              <FormField
                control={tokenForm.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-center block">
                      Insira o token fornecido pelo mentor:
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Token da turma" 
                        {...field}
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={tokenForm.formState.isSubmitting}
              >
                {tokenForm.formState.isSubmitting ? "Validando..." : "Continuar"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-[400px] bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-8">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">Crie sua conta</h1>
          <p className="text-slate-300">
            Preencha seus dados para entrar na turma
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Nome completo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="João Silva" 
                      {...field} 
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="seuemail@exemplo.com" 
                      {...field}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Senha</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="******" 
                      {...field}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Confirme sua senha</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="******" 
                      {...field}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm">
          <a href="/login" className="text-purple-400 hover:text-purple-300 hover:underline">
            Já tem uma conta? Faça login
          </a>
        </div>
      </div>
    </div>
  )
}