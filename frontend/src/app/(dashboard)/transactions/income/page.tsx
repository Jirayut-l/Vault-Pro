"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import api from "@/lib/api";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { calculateDistribution } from "@/lib/financial-logic";
import { AxiosError } from "axios";

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  category: z.string().optional(),
  note: z.string().optional(),
});

export default function IncomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      category: "Salary",
      note: "",
    },
  });

  const amount = useWatch({
    control: form.control,
    name: "amount",
  });
  
  const distributions = calculateDistribution(amount || "");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const res = await api.post("/transactions/income", {
        amount: values.amount,
        category: values.category,
        note: values.note,
      });

      if (res.data.success) {
        toast.success("Income distributed successfully!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      toast.error(axiosError.response?.data?.error || "Failed to add income");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-500">Add Income</CardTitle>
          <CardDescription className="text-slate-400">
            Record new income. It will be automatically distributed into your 6 Jars.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (฿)</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} className="bg-slate-950 border-slate-800 text-lg h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-950 p-4 border border-slate-800">
                {distributions.map((item) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">{item.name}</span>
                    <span className={`text-sm font-mono ${item.color}`}>฿{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Salary, Bonus, etc." {...field} className="bg-slate-950 border-slate-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional note" {...field} className="bg-slate-950 border-slate-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading ? "Processing..." : "Confirm & Distribute"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
