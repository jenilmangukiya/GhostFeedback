"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/models/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { APIResponse } from "@/types/APIResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages((preMessages) => {
      return preMessages.filter((item) => {
        return item._id !== messageId;
      });
    });
  };

  const { data: session } = useSession();

  const { register, watch, handleSubmit, control, setValue } = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const result = await axios.get<APIResponse>("/api/accept-messages");
      if (result.data.success) {
        setValue("acceptMessages", result.data.isAcceptingMessages);
      }
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      toast({
        title: "Accept Messages failed",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsLoading(true);

      try {
        const result = await axios.get<APIResponse>("/api/get-messages");
        if (result.data.success) {
          setMessages(result.data.messages);
          if (refresh) {
            toast({
              title: "Refreshed messages",
              description: "Showing latest messages",
            });
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError<APIResponse>;
        toast({
          title: "Signed up failed",
          description:
            axiosError.response?.data.message ||
            "Failed to fetch message settings",
          variant: "destructive",
        });
      } finally {
        setIsSwitchLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session?.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [fetchAcceptMessage, fetchMessages, session]);

  const handleSwitchChange = async () => {
    try {
      setValue("acceptMessages", !acceptMessages);
      const result = await axios.post<APIResponse>("/api/accept-messages", {
        acceptMessage: !acceptMessages,
      });
      toast({
        title: result.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      toast({
        title: "Signed up failed",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    }
  };
  if (!session || !session?.user) return <></>;

  const { username } = session.user;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
