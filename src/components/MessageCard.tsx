import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { APIResponse } from "@/types/APIResponse";

const MessageCard = ({
  message,
  onMessageDelete,
  ...rest
}: {
  message: any;
  onMessageDelete: (messageId: string) => void;
}) => {
  const { toast } = useToast();
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        "/api/delete-message/" + message?._id
      );
      toast({
        title: "Success",
        description: response.data.message,
      });
      onMessageDelete && onMessageDelete(message._id);
    } catch (err) {
      console.log("Error while deleting the message", err);
      const axiosError = err as AxiosError<APIResponse>;
      toast({
        title: "Delete message failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full" {...rest}>
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="w-5 h-5"></X>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your message and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardDescription>{message.createdAt}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
