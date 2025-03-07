import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllEhr } from "@/server/ehr";
import { assignEhrToUser } from "@/server/user/assign-ehr-to-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { EHRWithMappings } from "@repo/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function AssignEHR({ userId }: { userId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [EHRs, setEHRs] = useState<EHRWithMappings[]>([]); // Add state to store EHRs

  useEffect(() => {
    const fetchEHRs = async () => {
      const { data } = await getAllEhr();
      setEHRs(data); // Store fetched EHRs in state
    };

    fetchEHRs(); // Call the fetch function
  }, []);

  const form = useForm<{ ehrId: string }>({
    resolver: zodResolver(z.object({ ehrId: z.string() })),
  });

  const onSubmit = async (data: { ehrId: string }) => {
    const response = await assignEhrToUser(userId, data.ehrId);

    if (response.statusCode === 200) {
      toast.success(response.message);
      router.refresh();
      setOpen(false);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          Assign EHR
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="ehrId"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>Electronic Health Record</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EHRs.map((ehr) => (
                        <SelectItem key={ehr.id} value={ehr.id}>
                          {ehr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Assign"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
