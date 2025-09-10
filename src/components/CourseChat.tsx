import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send } from "lucide-react";
import { MessageMentorAPI } from "@/api/mentor/controllers/MessageMentorAPI";
import { MessageResponseDTO } from "@/api/dtos/messageDtos";

interface CourseChatMentorProps {
  studentId: string;
  onSendMessage: (content: string) => void;
}

interface ChatMessage {
  id: string;
  user: { name: string; avatar?: string };
  content: string;
}

export function CourseChat({ studentId, onSendMessage }: CourseChatMentorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const mentorId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        // Fetch both sent and received messages
        const receivedMessages = await MessageMentorAPI.getReceivedMessages();
        const sentMessages = await MessageMentorAPI.getSentMessages();
        // Combine and filter messages related to the specific student
        const allMessages = [...receivedMessages, ...sentMessages].filter(
          (msg) => msg.remetente.id === studentId || msg.destinatario.id === studentId
        );

        const chatMessages: ChatMessage[] = allMessages.map((msg: MessageResponseDTO) => ({
          id: Date.now().toString(), // Use real ID if available
          user: {
            name: msg.remetente.id === mentorId ? "Você" : msg.remetente.name,
            avatar: undefined,
          },
          content: msg.content
        }));

        // Sort messages by timestamp to ensure chronological order

        setMessages(chatMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId && mentorId) {
      fetchMessages();
    }
  }, [studentId, mentorId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !mentorId) return;

    const optimisticMessage: ChatMessage = {
      id: Date.now().toString(),
      user: { name: "Você", avatar: undefined },
      content: newMessage,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
      await onSendMessage(newMessage);
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chat com Aluno
        </h3>
      </div>
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="text-center text-muted-foreground">Carregando mensagens...</div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={message.user.avatar} />
                  <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.user.name}</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}