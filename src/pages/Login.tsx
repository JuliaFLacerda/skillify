import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AuthenticationAPI } from "@/api/AuthenticationAPI";
import { AuthenticationRequest } from "@/api/dtos/authDtos";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

interface LoginProps {
  onLoginSuccess?: (token: string, role: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const authRequest: AuthenticationRequest = {
        email: values.email,
        password: values.password,
      };

      const response = await AuthenticationAPI.login(authRequest);
      
      // Store authentication data
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.userRole);
      localStorage.setItem("userId", response.userId);

      // Call the success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(response.token, response.userRole);
      }

      // Redirect based on role
      switch (response.userRole.toUpperCase()) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "MENTOR":
          navigate("/mentor/dashboard");
          break;
        case "ESTUDANTE":
          navigate("/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Ocorreu um erro desconhecido";

      toast({
        title: "Erro no Login",
        description: errorMessage.includes("401") || errorMessage.includes("Unauthorized")
          ? "Email ou senha inválidos"
          : errorMessage.includes("Network")
          ? "Não foi possível conectar ao servidor"
          : `Erro: ${errorMessage}`,
        variant: "destructive",
        duration: 5000,
      });

      console.error("Login error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-[400px] bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-8">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">Bem-vindo de volta!</h1>
          <p className="text-slate-300">
            Digite suas credenciais para acessar sua conta
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm">
          <a href="/registro" className="text-purple-400 hover:text-purple-300 hover:underline">
            Não tem uma conta? Cadastre-se
          </a>
        </div>
      </div>
    </div>
  );
}