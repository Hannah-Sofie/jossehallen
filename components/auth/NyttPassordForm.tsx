"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { nyttPassordSchema, type NyttPassordData } from "@/lib/validation/auth";
import { settNyttPassord } from "@/lib/actions/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NyttPassordForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<NyttPassordData>({
    resolver: zodResolver(nyttPassordSchema),
    defaultValues: { passord: "", passordBekreft: "" },
  });

  function onSubmit(values: NyttPassordData) {
    startTransition(async () => {
      const res = await settNyttPassord(values);
      if (res.ok) {
        toast.success("Passordet er oppdatert. Du kan logge inn.");
        router.push("/login");
        router.refresh();
      } else {
        toast.error(res.feil);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="passord"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nytt passord</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passordBekreft"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gjenta nytt passord</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Lagrer..." : "Lagre nytt passord"}
        </Button>
      </form>
    </Form>
  );
}
