"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { loginSchema, type LoginData } from "@/lib/validation/auth";
import { loggInn } from "@/lib/actions/auth";
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

export function LoginForm({
  retur,
  admin = false,
}: {
  retur?: string;
  admin?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { epost: "", passord: "" },
  });

  function onSubmit(values: LoginData) {
    startTransition(async () => {
      const res = await loggInn(values, retur);
      if (res.ok) {
        toast.success("Velkommen!");
        router.push(res.redirect);
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
          name="epost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-post</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passord"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Passord</FormLabel>
                <Link
                  href="/glemt-passord"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Glemt passord?
                </Link>
              </div>
              <FormControl>
                <Input type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Logger inn..." : "Logg inn"}
        </Button>

        {!admin ? (
          <p className="text-center text-sm text-muted-foreground">
            Har du ikke konto?{" "}
            <Link href="/registrer" className="font-medium text-foreground hover:underline">
              Registrer deg
            </Link>
          </p>
        ) : null}
      </form>
    </Form>
  );
}
