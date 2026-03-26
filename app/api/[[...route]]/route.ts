import { Hono } from "hono";
import { handle } from "hono/vercel";
import prisma from "@/src/lib/prisma";

const app = new Hono().basePath("/api");

// API Routes
app.get("/health", (c) => c.json({ status: "ok" }));

// --- Transactions ---
app.get("/transactions", async (c) => {
  const userId = c.req.query("userId");
  if (!userId) return c.json({ error: "userId is required" }, 400);
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
  return c.json(transactions);
});

app.post("/transactions", async (c) => {
  const body = await c.req.json();
  const { userId, amount, category, description, type, date, name } = body;
  const transaction = await prisma.transaction.create({
    data: { userId, amount, category, description, type, date: date ? new Date(date) : undefined, name: name || description || "Untitled" },
  });
  return c.json(transaction);
});

app.delete("/transactions/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.req.query("userId");
  await prisma.transaction.deleteMany({ where: { id, userId: userId as string } });
  return c.json({ success: true });
});

// --- Goals ---
app.get("/goals", async (c) => {
  const userId = c.req.query("userId");
  if (!userId) return c.json({ error: "userId is required" }, 400);
  const goals = await prisma.goal.findMany({
    where: { userId },
  });
  return c.json(goals);
});

app.post("/goals", async (c) => {
  const body = await c.req.json();
  const { userId, title, description, target, current, deadline, color } = body;
  const goal = await prisma.goal.create({
    data: { userId, title, description, target, current, deadline: deadline ? new Date(deadline) : undefined, color },
  });
  return c.json(goal);
});

app.patch("/goals/:id", async (c) => {
  const id = c.req.param("id");
  const { current } = await c.req.json();
  const goal = await prisma.goal.update({
    where: { id },
    data: { current },
  });
  return c.json(goal);
});

app.delete("/goals/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.req.query("userId");
  await prisma.goal.deleteMany({ where: { id, userId: userId as string } });
  return c.json({ success: true });
});

// --- Bills ---
app.get("/bills", async (c) => {
  const userId = c.req.query("userId");
  if (!userId) return c.json({ error: "userId is required" }, 400);
  const bills = await prisma.bill.findMany({
    where: { userId },
  });
  return c.json(bills);
});

app.post("/bills", async (c) => {
  const body = await c.req.json();
  const { userId, name, amount, dueDate, category } = body;
  const bill = await prisma.bill.create({
    data: { userId, name, amount, dueDate: new Date(dueDate), category, isPaid: false },
  });
  return c.json(bill);
});

app.post("/bills/:id/pay", async (c) => {
  const id = c.req.param("id");
  const bill = await prisma.bill.update({
    where: { id },
    data: { isPaid: true },
  });
  return c.json(bill);
});

app.delete("/bills/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.req.query("userId");
  await prisma.bill.deleteMany({ where: { id, userId: userId as string } });
  return c.json({ success: true });
});

// --- Budgets ---
app.get("/budgets", async (c) => {
  const userId = c.req.query("userId");
  if (!userId) return c.json({ error: "userId is required" }, 400);
  const budgets = await prisma.budget.findMany({
    where: { userId },
  });
  return c.json(budgets);
});

app.post("/budgets", async (c) => {
  const body = await c.req.json();
  const { userId, category, limit, period } = body;
  const budget = await prisma.budget.create({
    data: { userId, category, limit, period, spent: 0 },
  });
  return c.json(budget);
});

app.delete("/budgets/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.req.query("userId");
  await prisma.budget.deleteMany({ where: { id, userId: userId as string } });
  return c.json({ success: true });
});

// --- Diagnostics ---
app.get("/diagnostics/supabase", async (c) => {
  const url = prisma ? "Configured" : "Not Configured"; // Just a check
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl) return c.json({ status: "error", message: "NEXT_PUBLIC_SUPABASE_URL is not set" });
    
    const start = Date.now();
    // Test both health and a key-required endpoint
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, { 
      headers: { 'apikey': supabaseKey || "" },
      signal: AbortSignal.timeout(5000) 
    });
    const duration = Date.now() - start;
    
    return c.json({
      status: res.ok ? "ok" : "error",
      httpStatus: res.status,
      duration: `${duration}ms`,
      url: `${supabaseUrl.substring(0, 15)}...`
    });
  } catch (err: any) {
    return c.json({
      status: "failed",
      error: err.message,
      message: "Server could not reach Supabase. This suggests the URL is wrong or Supabase is blocking this server."
    }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const PUT = handle(app);
