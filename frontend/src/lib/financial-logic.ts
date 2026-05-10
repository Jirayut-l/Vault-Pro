import { Decimal } from "decimal.js";

export type JarType = "NEC" | "FFA" | "LTS" | "EDU" | "PLY" | "GIV";

export interface JarDistribution {
  name: JarType;
  label: string;
  percentage: number;
  color: string;
}

export const JAR_CONFIG: JarDistribution[] = [
  { name: "NEC", label: "Necessity", percentage: 0.55, color: "text-emerald-500" },
  { name: "FFA", label: "Financial Freedom", percentage: 0.10, color: "text-blue-500" },
  { name: "LTS", label: "Long-term Savings", percentage: 0.10, color: "text-violet-500" },
  { name: "EDU", label: "Education", percentage: 0.10, color: "text-amber-500" },
  { name: "PLY", label: "Play", percentage: 0.10, color: "text-pink-500" },
  { name: "GIV", label: "Give", percentage: 0.05, color: "text-slate-500" },
];

export function calculateDistribution(amount: string | number) {
  const dAmount = new Decimal(amount || 0);
  
  return JAR_CONFIG.map(jar => ({
    ...jar,
    value: dAmount.mul(jar.percentage).toFixed(2)
  }));
}
