"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Building2, Users, Search, FileText, DollarSign, Cpu, Server, Heart,
  UserPlus, Bot, Shield, BookOpen, Target, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, XCircle, Clock, Calendar, Filter,
  Download, Send, ChevronRight, ExternalLink, Bell, RefreshCw, Settings,
  Eye, ThumbsUp, ThumbsDown, Star, MapPin, Zap, Globe, BarChart3,
  Activity, Layers, Database, Cloud, ChevronLeft, ArrowRight, MoreHorizontal,
  Gauge, Wifi, WifiOff, ToggleLeft, PauseCircle, Play, Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart,
  Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

// ─── TYPES ──────────────────────────────────────────────────────────────────

type Tab =
  | "overview" | "revenue" | "users" | "database" | "tokens"
  | "integrations" | "rankings" | "support" | "priorities" | "opportunities"
  | "resources" | "alerts" | "legal" | "agents" | "reviews" | "models";

// ─── COLORS ─────────────────────────────────────────────────────────────────

const BLUE = "#2563EB";
const GREEN = "#059669";
const RED = "#DC2626";
const ORANGE = "#D97706";
const PURPLE = "#7C3AED";
const CYAN = "#0284C7";
const NAVY = "#1E3A5F";

// ─── MOCK DATA ──────────────────────────────────────────────────────────────

const activity24h = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}h`,
  pesquisas: Math.round(i >= 8 && i <= 17 ? 40 + Math.random() * 80 + (i >= 9 && i <= 11 || i >= 14 && i <= 16 ? 40 : 0) : 5 + Math.random() * 15),
  documentos: Math.round(i >= 8 && i <= 17 ? 15 + Math.random() * 40 + (i >= 9 && i <= 11 || i >= 14 && i <= 16 ? 20 : 0) : 2 + Math.random() * 8),
  isPeak: (i >= 9 && i <= 11) || (i >= 14 && i <= 16),
}));

const revenue12m = [
  { month: "Mar", basico: 12000, profissional: 18000, enterprise: 5900, meta: 42000, custo: 1200 },
  { month: "Abr", basico: 14000, profissional: 21000, enterprise: 5900, meta: 45000, custo: 1300 },
  { month: "Mai", basico: 16000, profissional: 24000, enterprise: 11800, meta: 50000, custo: 1400 },
  { month: "Jun", basico: 18000, profissional: 28000, enterprise: 11800, meta: 55000, custo: 1500 },
  { month: "Jul", basico: 20000, profissional: 32000, enterprise: 11800, meta: 60000, custo: 1600 },
  { month: "Ago", basico: 21000, profissional: 34000, enterprise: 11800, meta: 65000, custo: 1700 },
  { month: "Set", basico: 22000, profissional: 36000, enterprise: 17700, meta: 70000, custo: 1800 },
  { month: "Out", basico: 24000, profissional: 38000, enterprise: 17700, meta: 75000, custo: 1900 },
  { month: "Nov", basico: 26000, profissional: 40000, enterprise: 17700, meta: 80000, custo: 2000 },
  { month: "Dez", basico: 28000, profissional: 42000, enterprise: 17700, meta: 85000, custo: 2200 },
  { month: "Jan", basico: 30000, profissional: 44000, enterprise: 17700, meta: 90000, custo: 2500 },
  { month: "Fev", basico: 31400, profissional: 40200, enterprise: 17800, meta: 95000, custo: 2840 },
];

const revenueComposition = [
  { name: "Trial", value: 0, count: 8, pct: 17, color: "#9CA3AF" },
  { name: "Basico", value: 10680, count: 12, pct: 38, color: BLUE },
  { name: "Profissional", value: 40800, count: 17, pct: 34, color: GREEN },
  { name: "Enterprise", value: 11800, count: 2, pct: 11, color: PURPLE },
];

const orgData = [
  { orgao: "Prefeitura Lagoa Santa", plano: "Profissional", status: "green", membros: "6/8", score: 92, acesso: "Hoje", docs: 45, pesq: 312, pgto: "Em dia" },
  { orgao: "Camara Sete Lagoas", plano: "Basico", status: "green", membros: "3/3", score: 78, acesso: "Ontem", docs: 12, pesq: 89, pgto: "Em dia" },
  { orgao: "Hospital Contagem", plano: "Trial", status: "green", membros: "4/5", score: 85, acesso: "Ha 2d", docs: 28, pesq: 156, pgto: "Trial" },
  { orgao: "Pref. Pedro Leopoldo", plano: "Basico", status: "yellow", membros: "1/4", score: 22, acesso: "Ha 35d", docs: 0, pesq: 3, pgto: "Pendente" },
  { orgao: "3o Bat. Bombeiros", plano: "Trial", status: "green", membros: "2/2", score: 71, acesso: "Hoje", docs: 8, pesq: 34, pgto: "Trial" },
  { orgao: "MP Estadual MG", plano: "Enterprise", status: "green", membros: "10/12", score: 97, acesso: "Hoje", docs: 89, pesq: 567, pgto: "Em dia" },
  { orgao: "Consorcio Saude BH", plano: "Profissional", status: "green", membros: "5/6", score: 88, acesso: "Ha 3d", docs: 34, pesq: 198, pgto: "Em dia" },
  { orgao: "CRAS Vespasiano", plano: "Basico", status: "paused", membros: "0/2", score: 8, acesso: "Ha 45d", docs: 0, pesq: 0, pgto: "Atrasado" },
  { orgao: "Sec. Educ. Contagem", plano: "Profissional", status: "green", membros: "7/8", score: 91, acesso: "Hoje", docs: 52, pesq: 340, pgto: "Em dia" },
  { orgao: "Camara Ouro Preto", plano: "Trial", status: "green", membros: "2/3", score: 65, acesso: "Ha 5d", docs: 6, pesq: 28, pgto: "Trial" },
  { orgao: "Prefeitura Betim", plano: "Trial", status: "green", membros: "3/4", score: 73, acesso: "Ontem", docs: 15, pesq: 78, pgto: "Trial" },
  { orgao: "SAMU Sete Lagoas", plano: "Basico", status: "green", membros: "2/2", score: 69, acesso: "Ha 4d", docs: 9, pesq: 45, pgto: "Em dia" },
  { orgao: "IF Sudeste MG", plano: "Profissional", status: "green", membros: "5/6", score: 82, acesso: "Ha 1d", docs: 31, pesq: 210, pgto: "Em dia" },
  { orgao: "Prefeitura Mariana", plano: "Basico", status: "yellow", membros: "1/3", score: 34, acesso: "Ha 22d", docs: 2, pesq: 11, pgto: "Pendente" },
  { orgao: "Corpo Bombeiros BH", plano: "Trial", status: "green", membros: "3/4", score: 76, acesso: "Hoje", docs: 11, pesq: 56, pgto: "Trial" },
];

interface ApiEndpoint {
  name: string;
  status: string;
  lat: string;
  up: string;
  cost?: string;
}

interface ApiGroup {
  name: string;
  apis: ApiEndpoint[];
}

const apiGroups: ApiGroup[] = [
  { name: "PNCP", apis: [
    { name: "Contratacoes", status: "green", lat: "145ms", up: "99.9%" },
    { name: "ATAs", status: "green", lat: "180ms", up: "99.8%" },
    { name: "Contratos", status: "green", lat: "160ms", up: "99.7%" },
    { name: "PCA", status: "green", lat: "200ms", up: "99.5%" },
    { name: "Itens de ATA", status: "green", lat: "190ms", up: "99.6%" },
  ]},
  { name: "Compras.gov.br", apis: [
    { name: "ARP", status: "yellow", lat: "2.3s", up: "97.2%" },
    { name: "Fornecedores", status: "green", lat: "340ms", up: "99.1%" },
    { name: "CATMAT", status: "green", lat: "120ms", up: "99.9%" },
    { name: "CATSER", status: "green", lat: "125ms", up: "99.9%" },
  ]},
  { name: "CGU / Transparencia", apis: [
    { name: "CEIS", status: "green", lat: "95ms", up: "99.9%" },
    { name: "CNEP", status: "green", lat: "98ms", up: "99.9%" },
    { name: "CEPIM", status: "green", lat: "102ms", up: "99.8%" },
    { name: "Contratos", status: "green", lat: "210ms", up: "99.5%" },
    { name: "Licitacoes", status: "green", lat: "195ms", up: "99.6%" },
  ]},
  { name: "SERPRO", apis: [
    { name: "CNPJ", status: "green", lat: "180ms", up: "99.8%", cost: "R$ 0,04" },
    { name: "CPF", status: "green", lat: "160ms", up: "99.9%", cost: "R$ 0,04" },
    { name: "NF-e", status: "green", lat: "240ms", up: "99.5%", cost: "R$ 0,05" },
    { name: "Datavalid v4", status: "green", lat: "350ms", up: "99.2%", cost: "R$ 0,15" },
    { name: "CND", status: "green", lat: "220ms", up: "99.4%" },
  ]},
  { name: "TransfereGov", apis: [
    { name: "Transferencias especiais", status: "red", lat: "timeout", up: "94.1%" },
    { name: "Convenios", status: "yellow", lat: "1.8s", up: "96.5%" },
    { name: "Programas", status: "green", lat: "320ms", up: "98.8%" },
  ]},
  { name: "IBGE / BrasilAPI", apis: [
    { name: "Municipios IBGE", status: "green", lat: "95ms", up: "99.9%" },
    { name: "CNPJ Receita", status: "green", lat: "180ms", up: "99.5%" },
    { name: "ViaCEP", status: "green", lat: "60ms", up: "99.9%" },
  ]},
];

const tokensByAgent = [
  { name: "Design Law", tokens: 1100, pct: 26 },
  { name: "ACMA", tokens: 980, pct: 23 },
  { name: "Doc Builder", tokens: 820, pct: 19 },
  { name: "Compliance", tokens: 540, pct: 13 },
  { name: "Resource Hunter", tokens: 380, pct: 9 },
  { name: "Tutor 14.133", tokens: 220, pct: 5 },
  { name: "Outros", tokens: 160, pct: 4 },
];

const agentsData = [
  { name: "Design Law", version: "v2.4", status: "active", desc: "Documentos jurídicos com formatação profissional", interactions: 1240, precision: 98.2, tokensPerInt: 3400, costMonth: 48, positiveRate: 96 },
  { name: "ACMA", version: "v3.1", status: "active", desc: "Pesquisa preços, mercado, comparativos", interactions: 2890, precision: 97.8, tokensPerInt: 2100, costMonth: 69, positiveRate: 94 },
  { name: "Compliance Shield", version: "v1.8", status: "active", desc: "Verificação fornecedores e conformidade", interactions: 980, precision: 99.1, tokensPerInt: 4200, costMonth: 47, positiveRate: 97 },
  { name: "Resource Hunter", version: "v2.0", status: "active", desc: "Recursos federais subutilizados", interactions: 620, precision: 96.5, tokensPerInt: 3800, costMonth: 27, positiveRate: 91 },
  { name: "Doc Builder", version: "v2.6", status: "active", desc: "Processos completos com todos anexos", interactions: 1560, precision: 97.4, tokensPerInt: 5100, costMonth: 91, positiveRate: 95 },
  { name: "Tutor 14.133", version: "v1.5", status: "active", desc: "Lei 14.133 em linguagem acessível", interactions: 890, precision: 98.8, tokensPerInt: 1800, costMonth: 18, positiveRate: 98 },
  { name: "Report Generator", version: "v0.9", status: "beta", desc: "Relatórios gerenciais automáticos", interactions: 120, precision: 0, tokensPerInt: 4500, costMonth: 0, positiveRate: 0 },
  { name: "Alert Monitor", version: "v0.7", status: "beta", desc: "Monitoramento proativo de prazos", interactions: 340, precision: 0, tokensPerInt: 800, costMonth: 0, positiveRate: 0 },
];

const timelineEvents = [
  { time: "14:32", color: RED, cat: "API", title: "TransfereGov timeout", desc: "3 falhas em 10 min" },
  { time: "14:00", color: GREEN, cat: "Sync", title: "CATMAT sincronizado", desc: "12.400 registros" },
  { time: "13:45", color: ORANGE, cat: "Usuario", title: "Pref. Itajuba - 32d sem uso", desc: "Risco de churn" },
  { time: "11:30", color: GREEN, cat: "Infra", title: "Backup ClickHouse OK", desc: "2.4TB" },
  { time: "10:15", color: GREEN, cat: "Cadastro", title: "Novo: Camara Sabara", desc: "Pendente aprovacao" },
  { time: "09:00", color: GREEN, cat: "Sistema", title: "23 membros na 1a hora", desc: "+12% acima da media" },
];

const priorities = [
  { level: "red", title: "7 cadastros aguardam aprovação", desc: "Formulário site. Betim, Sabará, UPA Rib. Neves + 4.", action: "Ir para Suporte" },
  { level: "red", title: "VIO SERPRO - Contratar", desc: "Anti-fraude documentos. Pendente jan/2026. Todos docs saem sem QR Code.", action: "Acessar loja SERPRO" },
  { level: "red", title: "e-Frotas SERPRO - Contratar", desc: "Frota veicular fornecedores transporte. Requer autorização Denatran.", action: "Acessar loja SERPRO" },
  { level: "red", title: "TransfereGov fora do ar", desc: "94.1% uptime. Timeouts afetam aba Recursos.", action: "Ver Integrações" },
  { level: "yellow", title: "3 pagamentos atrasados", desc: "Pedro Leopoldo, Vespasiano, Mariana. Total: R$ 2.670", action: "Cobrar" },
  { level: "yellow", title: "3 trials expiram essa semana", desc: "Câmara Ouro Preto (3d), Bombeiros BH (5d), Betim (7d)", action: "Ver Oportunidades" },
  { level: "yellow", title: "Health score: 3 órgãos críticos", desc: "Pedro Leopoldo (22), Vespasiano (8), Mariana (34). Risco de churn.", action: "Ver Usuários" },
  { level: "green", title: "Release bimestral", desc: "Próxima: 15/fev. Changelog em andamento. 12 melhorias planejadas.", action: "Editar changelog" },
  { level: "green", title: "Report Generator em beta", desc: "5 órgãos piloto. 120 interações. Avaliar para produção.", action: "Ver Agentes" },
];

// ─── SPARKLINE COMPONENT ────────────────────────────────────────────────────

function Sparkline({ data, color = "currentColor", width = 48, height = 20 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");
  const fillPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width={width} height={height} className="shrink-0">
      <polyline points={fillPoints} fill={color} fillOpacity={0.08} stroke="none" />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── KPI CARD ───────────────────────────────────────────────────────────────

function KPI({ label, value, trend, trendLabel, sparkData, sparkColor, icon: Icon, sub, pulse }: {
  label: string; value: string; trend?: number; trendLabel?: string; sparkData?: number[];
  sparkColor?: string; icon?: React.ElementType; sub?: string; pulse?: boolean;
}) {
  return (
    <div className="bg-background border border-border/30 rounded-2xl p-3.5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">{label}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-lg font-bold text-foreground tabular-nums">{value}</p>
            {pulse && <span className="size-2 rounded-full bg-green-500 animate-pulse" />}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {Icon && <Icon className="size-4 text-muted-foreground/50" />}
          {sparkData && <Sparkline data={sparkData} color={sparkColor || "#111"} />}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        {trend !== undefined && (
          <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
            trend > 0 ? "bg-green-50 text-green-700" : trend < 0 ? "bg-red-50 text-red-700" : "bg-muted text-muted-foreground"
          )}>
            {trend > 0 ? "+" : ""}{trend}{trendLabel || "%"}
          </span>
        )}
        {sub && <p className="text-[10px] text-muted-foreground truncate">{sub}</p>}
      </div>
    </div>
  );
}

// ─── SECTION HELPERS ────────────────────────────────────────────────────────

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  return (
    <span className={cn("size-2 rounded-full shrink-0",
      status === "green" && "bg-green-500",
      status === "yellow" && "bg-amber-500",
      status === "red" && "bg-red-500",
      status === "paused" && "bg-muted-foreground/40",
    )} />
  );
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", score > 70 ? "bg-green-500" : score > 40 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${score}%` }} />
      </div>
      <span className={cn("text-[10px] font-semibold tabular-nums", score > 70 ? "text-green-700" : score > 40 ? "text-amber-600" : "text-red-600")}>{score}</span>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full",
      plan === "Enterprise" ? "bg-purple-100 text-purple-700" :
      plan === "Profissional" ? "bg-green-50 text-green-700" :
      plan === "Basico" ? "bg-blue-50 text-blue-700" :
      "bg-muted text-muted-foreground"
    )}>{plan}</span>
  );
}

// ─── CUSTOM TOOLTIP ─────────────────────────────────────────────────────────

interface TooltipPayloadItem {
  value: number;
  name: string;
  color: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-foreground text-background rounded-lg px-3 py-2 text-[11px] shadow-lg">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: TooltipPayloadItem, i: number) => (
        <p key={i} className="flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-semibold">{typeof p.value === "number" && p.value > 999 ? `${(p.value / 1000).toFixed(1)}K` : p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export function DashboardSuperADMPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Visao Geral" },
    { id: "revenue", label: "Receitas / Metas" },
    { id: "users", label: "Usuarios" },
    { id: "database", label: "Banco de Dados" },
    { id: "tokens", label: "Consumo Tokens" },
    { id: "integrations", label: "Integracoes" },
    { id: "rankings", label: "Rankings" },
    { id: "support", label: "Suporte" },
    { id: "priorities", label: "Prioridades" },
    { id: "opportunities", label: "Oportunidades" },
    { id: "resources", label: "Recursos" },
    { id: "alerts", label: "Alertas / Analytics" },
    { id: "legal", label: "Biblioteca Legal" },
    { id: "agents", label: "Agentes Master" },
    { id: "reviews", label: "Avaliacoes" },
    { id: "models", label: "Modelos IA" },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <div className="border-b border-border/30 px-5 pt-4 pb-0 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-foreground">SuperADM</h1>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary text-white tracking-wide">MASTER</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Dados em tempo real</span>
              <span className="font-mono font-semibold text-foreground tabular-nums">{clock}</span>
            </div>
            <Button variant="outline" className="h-7 rounded-full text-[11px] bg-transparent border-border/50 hover:bg-muted gap-1.5 px-3">
              <Download className="size-3" />
              Exportar
            </Button>
            <div className="relative">
              <Bell className="size-4 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-red-500 text-[8px] text-white flex items-center justify-center font-bold">4</span>
            </div>
          </div>
        </div>

        {/* ─── TABS ─────────────────────────────────────────────── */}
        <div className="relative">
          <div className="flex gap-0 overflow-x-auto no-scrollbar" style={{ maskImage: "linear-gradient(to right, black 95%, transparent)" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 py-2.5 text-[11px] font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer shrink-0",
                  activeTab === tab.id
                    ? "border-[#1E3A5F] text-foreground font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CONTENT ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1200px] mx-auto p-5 space-y-6">

          {/* ═══════════════════════════════════════════════════════
              ABA 1: VISAO GERAL
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                <KPI label="Orgaos ativos" value="47" trend={8} icon={Building2} sparkData={[30,33,35,38,40,42,44,47]} sparkColor={BLUE} />
                <KPI label="Membros online" value="23" pulse icon={Users} sparkData={[15,22,28,18,23,19,26,23]} sparkColor={GREEN} />
                <KPI label="Pesquisas (hoje)" value="156" trend={12} sub="vs ontem" icon={Search} sparkData={[120,130,125,140,135,148,150,156]} sparkColor={BLUE} />
                <KPI label="Documentos (mes)" value="892" trend={15} icon={FileText} sparkData={[600,650,700,720,780,810,850,892]} sparkColor={GREEN} />
                <KPI label="MRR" value="R$ 89.400" trend={6} icon={DollarSign} sparkData={[62,68,72,76,80,83,86,89.4]} sparkColor={GREEN} />
                <KPI label="Custo IA (mes)" value="R$ 2.840" trend={5} sub="Margem: R$ 86.560" icon={Cpu} sparkData={[2.1,2.2,2.3,2.4,2.5,2.6,2.7,2.84]} sparkColor={ORANGE} />
                <KPI label="APIs online" value="72/76" icon={Server} sub="3 lentas, 1 fora" sparkData={[74,75,74,76,75,73,72,72]} sparkColor={BLUE} />
                <KPI label="NPS" value="72" trend={4} trendLabel=" pts" icon={Heart} sparkData={[60,62,65,66,68,69,71,72]} sparkColor={GREEN} />
              </div>

              {/* Activity Chart + Health */}
              <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-4">
                <Section title="Atividade ao vivo" subtitle="Ultimas 24 horas">
                  <div className="bg-background border border-border/30 rounded-2xl p-4">
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={activity24h} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={BLUE} stopOpacity={0.15} />
                            <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={GREEN} stopOpacity={0.15} />
                            <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval={2} />
                        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="pesquisas" stroke={BLUE} strokeWidth={1.5} fill="url(#gradBlue)" name="Pesquisas" />
                        <Area type="monotone" dataKey="documentos" stroke={GREEN} strokeWidth={1.5} fill="url(#gradGreen)" name="Documentos" />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="size-2 rounded-full" style={{ background: BLUE }} />Pesquisas</span>
                      <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="size-2 rounded-full" style={{ background: GREEN }} />Documentos</span>
                      <span className="text-[10px] text-muted-foreground ml-auto">Pico: 09-11h e 14-16h</span>
                    </div>
                  </div>
                </Section>

                <Section title="Saude do sistema">
                  <div className="space-y-2">
                    {[
                      { icon: Server, label: "APIs", value: "72/76 operacionais", segments: [72, 3, 1], colors: [GREEN, ORANGE, RED] },
                      { icon: AlertTriangle, label: "Tickets", value: "12 abertos", sub: "7 pendentes cadastro", dot: "yellow" },
                      { icon: DollarSign, label: "Pagamento", value: "3 atrasados (R$ 4.200)", dot: "red" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3 bg-background border border-border/30 rounded-2xl p-3">
                        <item.icon className="size-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-foreground">{item.label}</p>
                          <p className="text-[10px] text-muted-foreground">{item.value}</p>
                        </div>
                        {item.segments && (
                          <div className="flex w-20 h-1.5 rounded-full overflow-hidden">
                            {item.segments.map((s, i) => (
                              <div key={i} style={{ width: `${(s / 76) * 100}%`, backgroundColor: item.colors![i] }} />
                            ))}
                          </div>
                        )}
                        {item.dot && <StatusDot status={item.dot} />}
                      </div>
                    ))}
                    {[
                      { label: "ClickHouse", used: 2.4, total: 5, unit: "TB" },
                      { label: "Supabase", used: 1.8, total: 8, unit: "GB" },
                      { label: "Workers", used: 847, total: 10000, unit: "K req" },
                    ].map((db) => {
                      const pct = (db.used / db.total) * 100;
                      return (
                        <div key={db.label} className="flex items-center gap-3 bg-background border border-border/30 rounded-2xl p-3">
                          <Database className="size-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-foreground">{db.label}</p>
                            <p className="text-[10px] text-muted-foreground">{db.used}{db.unit} / {db.total}{db.unit} ({pct.toFixed(1)}%)</p>
                          </div>
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full", pct < 60 ? "bg-green-500" : pct < 80 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              </div>

              {/* Timeline + Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Section title="Linha do tempo" subtitle="Hoje">
                  <div className="bg-background border border-border/30 rounded-2xl p-4">
                    <div className="space-y-0">
                      {timelineEvents.map((ev, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="size-2.5 rounded-full border-2 shrink-0 mt-1" style={{ borderColor: ev.color, backgroundColor: ev.color }} />
                            {i < timelineEvents.length - 1 && <div className="w-px flex-1 bg-border/50 my-1" />}
                          </div>
                          <div className="pb-3 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-muted-foreground tabular-nums">{ev.time}</span>
                              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{ev.cat}</span>
                            </div>
                            <p className="text-[11px] font-medium text-foreground mt-0.5">{ev.title}</p>
                            <p className="text-[10px] text-muted-foreground">{ev.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Section>

                <Section title="Acoes pendentes">
                  <div className="space-y-2">
                    {[
                      { level: "red", title: "7 cadastros aguardando aprovacao", action: "Ir para Suporte" },
                      { level: "red", title: "3 pagamentos atrasados (R$ 4.200)", action: "Ir para Receitas" },
                      { level: "yellow", title: "3 trials expiram essa semana", action: "Ir para Oportunidades" },
                      { level: "yellow", title: "VIO e e-Frotas SERPRO pendentes", action: "Ir para Prioridades" },
                    ].map((a, i) => (
                      <div key={i} className={cn("flex items-center gap-3 p-3 rounded-2xl border",
                        a.level === "red" ? "border-red-200/50 bg-red-50/30" : "border-amber-200/50 bg-amber-50/30"
                      )}>
                        <div className={cn("size-2 rounded-full shrink-0", a.level === "red" ? "bg-red-500" : "bg-amber-500")} />
                        <p className="text-[11px] font-medium text-foreground flex-1">{a.title}</p>
                        <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer whitespace-nowrap">{a.action} <ChevronRight className="size-3 inline" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">4 urgentes</span>
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">6 atencao</span>
                  </div>
                </Section>
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 2: RECEITAS / METAS
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "revenue" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                <KPI label="MRR" value="R$ 89.400" trend={6} sub="Meta: R$ 100K (89.4%)" icon={DollarSign} sparkData={[62,68,72,76,80,83,86,89.4]} sparkColor={GREEN} />
                <KPI label="ARR projetado" value="R$ 1.072.800" icon={TrendingUp} />
                <KPI label="Churn" value="2.1%" trend={-0.5} trendLabel="%" sub="Meta < 3%" icon={TrendingDown} sparkData={[3.2,3.0,2.8,2.6,2.4,2.3,2.2,2.1]} sparkColor={GREEN} />
                <KPI label="Ticket médio" value="R$ 1.902" trend={3} sub="/órgão/mês" sparkData={[1700,1750,1780,1800,1830,1860,1880,1902]} sparkColor={BLUE} />
                <KPI label="LTV" value="R$ 34.200" sub="LTV/CAC: 12.2x" icon={Target} />
                <KPI label="CAC" value="R$ 2.800" trend={-12} sparkData={[3500,3300,3200,3100,3000,2900,2850,2800]} sparkColor={GREEN} />
                <KPI label="Margem bruta" value="96.8%" sparkData={[94,95,95.5,96,96.2,96.5,96.7,96.8]} sparkColor={GREEN} />
                <KPI label="Runway" value="18.4 meses" icon={Clock} sub="Com caixa atual" />
              </div>

              <Section title="Evolucao financeira" subtitle="12 meses">
                <div className="bg-background border border-border/30 rounded-2xl p-4">
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={revenue12m} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}K`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="basico" stackId="a" fill={BLUE} name="Basico" radius={[0,0,0,0]} />
                      <Bar dataKey="profissional" stackId="a" fill={GREEN} name="Profissional" radius={[0,0,0,0]} />
                      <Bar dataKey="enterprise" stackId="a" fill={PURPLE} name="Enterprise" radius={[2,2,0,0]} />
                      <Line type="monotone" dataKey="meta" stroke={RED} strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Meta" />
                      <Line type="monotone" dataKey="custo" stroke={ORANGE} strokeWidth={1.5} dot={false} name="Custos" />
                    </ComposedChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {[{ c: BLUE, l: "Basico" }, { c: GREEN, l: "Profissional" }, { c: PURPLE, l: "Enterprise" }, { c: RED, l: "Meta" }, { c: ORANGE, l: "Custos" }].map(i => (
                      <span key={i.l} className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="size-2 rounded-full" style={{ background: i.c }} />{i.l}</span>
                    ))}
                  </div>
                </div>
              </Section>

              <div className="bg-background border border-border/30 rounded-2xl p-3">
                <p className="text-[10px] font-medium text-foreground mb-1">Insight automatico</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Se manter o crescimento de 6%/mes, MRR atinge R$ 100K em 45 dias (meta Q1). Custo operacional cresce 5%/mes vs receita 6%/mes. Breakeven operacional atingido em set/2025.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Section title="Composicao da receita">
                  <div className="bg-background border border-border/30 rounded-2xl p-4 flex items-center gap-6">
                    <div className="w-36 h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={revenueComposition} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" stroke="none">
                            {revenueComposition.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2">
                      {revenueComposition.map(r => (
                        <div key={r.name} className="flex items-center gap-2">
                          <span className="size-2.5 rounded-full shrink-0" style={{ background: r.color }} />
                          <span className="text-[11px] text-foreground flex-1">{r.name}</span>
                          <span className="text-[10px] text-muted-foreground">{r.count} orgaos</span>
                          <span className="text-[10px] font-semibold text-foreground tabular-nums">{r.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Section>

                <Section title="Metas">
                  <div className="bg-background border border-border/30 rounded-2xl p-4 space-y-3">
                    {[
                      { meta: "Q1 2026", target: "R$ 300K", current: "R$ 267K", pct: 89, days: 53, ok: true },
                      { meta: "S1 2026", target: "R$ 700K", current: "R$ 267K", pct: 38, days: 144, ok: true },
                      { meta: "2026", target: "R$ 1.5M", current: "R$ 267K", pct: 18, days: 328, ok: false },
                    ].map(m => (
                      <div key={m.meta}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium text-foreground">{m.meta}</span>
                          <span className="text-[10px] text-muted-foreground">{m.current} / {m.target}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-foreground" style={{ width: `${m.pct}%` }} />
                          </div>
                          <span className="text-[10px] tabular-nums text-foreground font-semibold">{m.pct}%</span>
                          <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full", m.ok ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-600")}>{m.ok ? "No ritmo" : "Ajustar"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>

              <Section title="Pipeline de conversao">
                <div className="bg-background border border-border/30 rounded-2xl p-4">
                  <div className="flex items-center gap-1">
                    {[
                      { label: "Formulario", value: 45, pct: "100%" },
                      { label: "Aprovados", value: 38, pct: "84%" },
                      { label: "Trial ativo", value: 8, pct: "17.7%" },
                      { label: "Pagante", value: 5, pct: "11.1%" },
                      { label: "Upsell", value: 2, pct: "4.4%" },
                    ].map((step, i, arr) => (
                      <React.Fragment key={step.label}>
                        <div className="flex-1 text-center">
                          <p className="text-lg font-bold text-foreground tabular-nums">{step.value}</p>
                          <p className="text-[10px] text-muted-foreground">{step.label}</p>
                          <p className="text-[10px] font-semibold text-foreground mt-0.5">{step.pct}</p>
                        </div>
                        {i < arr.length - 1 && <ChevronRight className="size-4 text-muted-foreground/30 shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </Section>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 3: USUARIOS
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "users" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                <KPI label="Orgaos" value="47" trend={8} icon={Building2} sparkData={[30,33,35,38,40,42,44,47]} sparkColor={BLUE} />
                <KPI label="Membros" value="312" trend={12} sub="Media: 6.6/orgao" icon={Users} sparkData={[220,240,260,270,280,290,300,312]} sparkColor={GREEN} />
                <KPI label="Online agora" value="23" pulse icon={Activity} />
                <KPI label="DAU / MAU" value="67%" sub="Stickiness excelente (>40%)" sparkData={[55,58,60,62,63,65,66,67]} sparkColor={GREEN} />
                <KPI label="Inativos +30d" value="6 orgaos" sub="12.8%" icon={AlertTriangle} />
                <KPI label="Engajamento" value="4.2 pesq/membro/dia" sparkData={[3.2,3.5,3.6,3.8,3.9,4.0,4.1,4.2]} sparkColor={BLUE} />
              </div>

              {/* Org table */}
              <Section title="Orgaos cadastrados" subtitle="15 orgaos, ordenados por health score">
                <div className="bg-background border border-border/30 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-muted/50">
                          {["Orgao", "Plano", "", "Membros", "Score", "Acesso", "Docs", "Pesq.", "Pgto"].map(h => (
                            <th key={h} className="text-[10px] uppercase text-muted-foreground font-medium px-3 py-2.5 tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orgData.sort((a, b) => b.score - a.score).map((org) => (
                          <tr key={org.orgao} className="border-t border-border/20 hover:bg-muted/30 transition-colors">
                            <td className="px-3 py-2.5 text-[11px] font-medium text-foreground max-w-[180px] truncate">{org.orgao}</td>
                            <td className="px-3 py-2.5"><PlanBadge plan={org.plano} /></td>
                            <td className="px-3 py-2.5"><StatusDot status={org.status} /></td>
                            <td className="px-3 py-2.5 text-[11px] text-foreground tabular-nums">{org.membros}</td>
                            <td className="px-3 py-2.5"><ScoreBar score={org.score} /></td>
                            <td className="px-3 py-2.5 text-[10px] text-muted-foreground">{org.acesso}</td>
                            <td className="px-3 py-2.5 text-[11px] text-foreground tabular-nums">{org.docs}</td>
                            <td className="px-3 py-2.5 text-[11px] text-foreground tabular-nums">{org.pesq}</td>
                            <td className="px-3 py-2.5">
                              <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full",
                                org.pgto === "Em dia" ? "bg-green-50 text-green-700" :
                                org.pgto === "Trial" ? "bg-muted text-muted-foreground" :
                                org.pgto === "Pendente" ? "bg-amber-50 text-amber-600" :
                                "bg-red-50 text-red-700"
                              )}>{org.pgto}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Section>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 4: BANCO DE DADOS
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "database" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {[
                  { name: "ClickHouse", sub: "Analitico", color: BLUE, storage: "2.4TB / 5TB (48%)", pct: 48, rows: "847M registros", ingest: "12.400 reg/h", queries: "2.340/h", latency: "P50: 45ms | P95: 320ms | P99: 890ms", uptime: "99.97%", proj: "Atinge 80% em 4.2 meses. Planejar expansao Q3." },
                  { name: "Supabase", sub: "Transacional", color: GREEN, storage: "1.8GB / 8GB (22.5%)", pct: 22.5, rows: "42 tabelas | 2.1M rows", ingest: "312 auth users", queries: "23/100 conexoes", latency: "Realtime: 18 subs | RLS: 156 policies", uptime: "99.98%", proj: "Storage confortavel. Monitorar conexoes (pico: 67)." },
                  { name: "Cloudflare", sub: "Edge/CDN", color: ORANGE, storage: "4.2GB / 10GB R2 (42%)", pct: 42, rows: "847K / 10M req (8.5%)", ingest: "KV: 124K reads/dia", queries: "Cache hit: 94.2%", latency: "WAF blocks: 342 | Rate limit: 56", uptime: "99.99%", proj: "Workers com folga. R2 atinge 70% em 6 meses." },
                ].map(db => (
                  <div key={db.name} className="bg-background border border-border/30 rounded-2xl overflow-hidden">
                    <div className="h-1" style={{ backgroundColor: db.color }} />
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">{db.name}</p>
                        <p className="text-[10px] text-muted-foreground">{db.sub}</p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-muted-foreground">Storage</span>
                            <span className="text-foreground font-semibold">{db.storage}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full", db.pct < 60 ? "bg-green-500" : db.pct < 80 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${db.pct}%` }} />
                          </div>
                        </div>
                        {[db.rows, db.ingest, db.queries, db.latency].map((v, i) => (
                          <div key={i} className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">{v}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-muted-foreground">Uptime:</span>
                          <span className="font-semibold text-green-700">{db.uptime}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border/20">
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{db.proj}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 5: CONSUMO TOKENS
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "tokens" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                <KPI label="Tokens (mes)" value="4.2M" trend={-3} icon={Cpu} sparkData={[4.5,4.6,4.4,4.3,4.5,4.4,4.3,4.2]} sparkColor={BLUE} />
                <KPI label="Custo IA (mes)" value="R$ 2.840" trend={5} sparkData={[2.1,2.2,2.3,2.4,2.5,2.6,2.7,2.84]} sparkColor={ORANGE} />
                <KPI label="Custo/orgao" value="R$ 60,42" sparkData={[55,56,57,58,59,60,60,60.4]} sparkColor={BLUE} />
                <KPI label="Custo/documento" value="R$ 0,32" sub="Meta < R$ 0,50" sparkData={[0.45,0.42,0.40,0.38,0.36,0.34,0.33,0.32]} sparkColor={GREEN} />
                <KPI label="Custo/pesquisa" value="R$ 0,08" sub="Meta < R$ 0,15" sparkData={[0.12,0.11,0.10,0.10,0.09,0.09,0.08,0.08]} sparkColor={GREEN} />
                <KPI label="Margem token" value="96.8%" sparkData={[94,94.5,95,95.5,96,96.3,96.5,96.8]} sparkColor={GREEN} />
                <KPI label="Modelo dominante" value="Modelo A: 68%" sub="B: 24% | C: 8%" />
                <KPI label="Tokens/membro/dia" value="1.340" sparkData={[1200,1250,1280,1290,1300,1310,1330,1340]} sparkColor={BLUE} />
              </div>

              <Section title="Tokens por agente" subtitle="Mes atual">
                <div className="bg-background border border-border/30 rounded-2xl p-4 space-y-2">
                  {tokensByAgent.map(a => (
                    <div key={a.name} className="flex items-center gap-3">
                      <span className="text-[11px] text-foreground w-28 truncate">{a.name}</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-foreground rounded-full" style={{ width: `${a.pct}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular-nums w-14 text-right">{a.tokens}K</span>
                      <span className="text-[10px] font-semibold text-foreground tabular-nums w-8 text-right">{a.pct}%</span>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 6: INTEGRACOES
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "integrations" && (
            <>
              <div className="bg-background border border-border/30 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex flex-1 h-2 rounded-full overflow-hidden">
                    <div style={{ width: `${(72/76)*100}%`, backgroundColor: GREEN }} />
                    <div style={{ width: `${(3/76)*100}%`, backgroundColor: ORANGE }} />
                    <div style={{ width: `${(1/76)*100}%`, backgroundColor: RED }} />
                  </div>
                </div>
                <p className="text-[11px] text-foreground"><span className="font-semibold">76 APIs monitoradas</span> — 72 operacionais, 3 lentas, 1 fora</p>
              </div>

              <div className="space-y-4">
                {apiGroups.map(group => (
                  <Section key={group.name} title={group.name}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                      {group.apis.map(api => (
                        <div key={api.name} className="bg-background border border-border/30 rounded-2xl p-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <StatusDot status={api.status} />
                            <span className="text-[11px] font-medium text-foreground truncate">{api.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={cn("text-[10px] font-semibold tabular-nums", api.status === "red" ? "text-red-600" : api.status === "yellow" ? "text-amber-600" : "text-foreground")}>{api.lat}</span>
                            <span className="text-[10px] text-muted-foreground tabular-nums">{api.up}</span>
                            {api.cost && <span className="text-[9px] text-muted-foreground">{api.cost}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                ))}
              </div>

              <Section title="Pendentes SERPRO">
                <div className="grid grid-cols-2 gap-2">
                  {[{ name: "VIO QR Code", desc: "Anti-fraude documentos" }, { name: "e-Frotas", desc: "Frota veicular fornecedores" }].map(p => (
                    <div key={p.name} className="bg-background border-2 border-dashed border-red-200/50 rounded-2xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <PauseCircle className="size-3.5 text-muted-foreground" />
                        <span className="text-[11px] font-medium text-foreground">{p.name}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 7: RANKINGS
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "rankings" && (
            <>
              <div className="flex items-center gap-2 mb-2">
                {["7d", "30d", "90d", "12m"].map(p => (
                  <button key={p} className={cn("text-[10px] px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
                    p === "30d" ? "bg-foreground text-background border-foreground" : "border-border/50 text-foreground hover:bg-muted"
                  )}>{p}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Section title="Top artefatos gerados">
                  <div className="bg-background border border-border/30 rounded-2xl p-4 space-y-2">
                    {[
                      { name: "Pesquisa de Precos", qty: 342, pct: 38, trend: 12 },
                      { name: "ETP", qty: 198, pct: 22, trend: 8 },
                      { name: "TR", qty: 167, pct: 19, trend: 15 },
                      { name: "DFD", qty: 89, pct: 10, trend: 5 },
                      { name: "Justificativa", qty: 45, pct: 5, trend: 22 },
                      { name: "Mapa de Riscos", qty: 28, pct: 3, trend: 18 },
                    ].map((a, i) => (
                      <div key={a.name} className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-4 tabular-nums">{i + 1}</span>
                        <span className="text-[11px] text-foreground flex-1 truncate">{a.name}</span>
                        <span className="text-[10px] text-muted-foreground tabular-nums">{a.qty}</span>
                        <span className="text-[10px] font-semibold text-green-700 tabular-nums">+{a.trend}%</span>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Top orgaos (atividade)">
                  <div className="bg-background border border-border/30 rounded-2xl p-4 space-y-2">
                    {orgData.sort((a, b) => b.pesq - a.pesq).slice(0, 6).map((org, i) => (
                      <div key={org.orgao} className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-4 tabular-nums">{i + 1}</span>
                        <span className="text-[11px] text-foreground flex-1 truncate">{org.orgao}</span>
                        <span className="text-[10px] text-muted-foreground tabular-nums">{org.pesq} pesq.</span>
                        <ScoreBar score={org.score} />
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Top assistentes">
                  <div className="bg-background border border-border/30 rounded-2xl p-4 space-y-2">
                    {agentsData.filter(a => a.status === "active").sort((a, b) => b.interactions - a.interactions).map((a, i) => (
                      <div key={a.name} className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-4 tabular-nums">{i + 1}</span>
                        <span className="text-[11px] text-foreground flex-1 truncate">{a.name}</span>
                        <span className="text-[10px] text-muted-foreground tabular-nums">{a.interactions}</span>
                        <span className="text-[10px] font-semibold text-green-700 tabular-nums">{a.precision}%</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 8: SUPORTE
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "support" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                <KPI label="Cadastros pendentes" value="7" pulse icon={UserPlus} sub="Formulario site" />
                <KPI label="Tickets abertos" value="12" sparkData={[18,15,14,12,13,11,12,12]} sparkColor={BLUE} />
                <KPI label="Convites enviados" value="23" sub="Taxa acesso: 78%" />
                <KPI label="Tempo médio resolução" value="4.2h" trend={-15} sub="Meta < 6h" sparkData={[6.5,6.0,5.5,5.2,5.0,4.8,4.5,4.2]} sparkColor={GREEN} />
                <KPI label="CSAT" value="94%" sub="Meta > 90%" sparkData={[88,89,90,91,92,93,93,94]} sparkColor={GREEN} />
                <KPI label="SLA cumprido" value="97.3%" sub="Meta > 95%" sparkData={[94,95,96,96,97,97,97,97.3]} sparkColor={GREEN} />
              </div>

              <Section title="Solicitacoes de cadastro" subtitle="Formulario ata360.com.br/cadastro">
                <div className="bg-amber-50/30 border border-amber-200/30 border-l-4 border-l-amber-500 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-amber-50/50">
                          {["Data", "Orgao", "Responsavel", "UF", "Status", ""].map(h => (
                            <th key={h} className="text-[10px] uppercase text-muted-foreground font-medium px-3 py-2.5 tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { date: "04/fev", org: "Prefeitura Betim", resp: "Maria Silva", uf: "MG", status: "Pendente" },
                          { date: "03/fev", org: "Camara Sabara", resp: "Joao Santos", uf: "MG", status: "Pendente" },
                          { date: "03/fev", org: "UPA Rib. Neves", resp: "Ana Costa", uf: "MG", status: "Pendente" },
                          { date: "02/fev", org: "SAAE Santa Luzia", resp: "Carlos Souza", uf: "MG", status: "Aprovado" },
                          { date: "01/fev", org: "IF Sudeste MG", resp: "Prof. Roberto", uf: "MG", status: "Aprovado" },
                          { date: "31/jan", org: "Empresa XYZ Ltda", resp: "Pedro Alves", uf: "MG", status: "Recusado" },
                          { date: "30/jan", org: "Consorcio Jequitinhonha", resp: "Dra. Fernanda", uf: "MG", status: "Pendente" },
                        ].map((c, i) => (
                          <tr key={i} className="border-t border-amber-200/20 hover:bg-amber-50/30 transition-colors">
                            <td className="px-3 py-2.5 text-[10px] text-muted-foreground">{c.date}</td>
                            <td className="px-3 py-2.5 text-[11px] font-medium text-foreground">{c.org}</td>
                            <td className="px-3 py-2.5 text-[11px] text-foreground">{c.resp}</td>
                            <td className="px-3 py-2.5 text-[10px] text-muted-foreground">{c.uf}</td>
                            <td className="px-3 py-2.5">
                              <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full",
                                c.status === "Pendente" ? "bg-amber-100 text-amber-700" :
                                c.status === "Aprovado" ? "bg-green-50 text-green-700" :
                                "bg-red-50 text-red-700"
                              )}>{c.status}</span>
                            </td>
                            <td className="px-3 py-2.5">
                              {c.status === "Pendente" && (
                                <div className="flex items-center gap-1.5">
                                  <button className="text-[9px] px-2 py-1 rounded-full bg-green-600 text-white hover:bg-green-700 cursor-pointer">Aprovar</button>
                                  <button className="text-[9px] px-2 py-1 rounded-full bg-muted text-foreground hover:bg-muted/80 cursor-pointer">Recusar</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Section>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 9: PRIORIDADES
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "priorities" && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">4 urgentes</span>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">4 atencao</span>
                <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">2 planejadas</span>
              </div>
              <div className="space-y-2">
                {priorities.map((p, i) => (
                  <div key={i} className={cn("flex items-start gap-3 p-3 rounded-2xl border border-l-4",
                    p.level === "red" ? "border-l-red-500 border-border/30 bg-red-50/20" :
                    p.level === "yellow" ? "border-l-amber-500 border-border/30 bg-amber-50/20" :
                    "border-l-green-500 border-border/30"
                  )}>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-foreground">{p.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{p.desc}</p>
                    </div>
                    <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer whitespace-nowrap shrink-0">{p.action} <ChevronRight className="size-3 inline" /></button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 10: OPORTUNIDADES
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "opportunities" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                <KPI label="Municipios MG sem ATA360" value="806/853" sub="5.5% penetracao" sparkData={[847,845,842,838,830,820,812,806]} sparkColor={GREEN} />
                <KPI label="Orgaos potenciais Brasil" value="30.000+" icon={Globe} />
                <KPI label="Taxa conversao trial" value="62%" sub="Benchmark SaaS: 25%" sparkData={[45,48,50,52,55,58,60,62]} sparkColor={GREEN} />
                <KPI label="Upsell potencial" value="R$ 12.400/mes" sub="8 orgaos Basico" icon={TrendingUp} />
                <KPI label="Tempo trial->pagante" value="18 dias" sparkData={[28,26,24,22,21,20,19,18]} sparkColor={GREEN} />
                <KPI label="Revenue expansion" value="+R$ 3.200/mes" sub="Upsells Q4" sparkData={[800,1200,1600,2000,2400,2600,2800,3200]} sparkColor={GREEN} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Section title="Pipeline conversao">
                  <div className="bg-background border border-border/30 rounded-2xl p-4 space-y-3">
                    {[
                      { label: "Leads no site", value: 45, pct: 100, color: "#E5E7EB" },
                      { label: "Formulario preenchido", value: 38, pct: 84, color: BLUE },
                      { label: "Trial ativo", value: 8, pct: 17.7, color: CYAN },
                      { label: "Pagante", value: 5, pct: 11.1, color: GREEN },
                      { label: "Upsell", value: 2, pct: 4.4, color: PURPLE },
                    ].map(s => (
                      <div key={s.label}>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-foreground font-medium">{s.label}</span>
                          <span className="text-muted-foreground tabular-nums">{s.value} ({s.pct}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Insights estrategicos">
                  <div className="space-y-2">
                    {[
                      "Camaras municipais: apenas 6 clientes de 853 camaras em MG. Se atingir 5%: +R$ 38K/mes",
                      "Triangulo Mineiro: 0 clientes, 66 municipios, cluster alto de PIB. Prioridade para prospeccao.",
                      "Saúde: hospitais e UPAs convertem 2x mais rápido que prefeituras. Focar.",
                      "8 clientes Basico usam > 30 docs/mes — perfil Profissional. Upsell: +R$ 12.4K/mes",
                    ].map((insight, i) => (
                      <div key={i} className="bg-background border border-border/30 rounded-2xl p-3 flex items-start gap-2.5">
                        <Target className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-[10px] text-foreground leading-relaxed">{insight}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 11: RECURSOS
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "resources" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                <KPI label="Recursos mapeados" value="R$ 4.2B" sparkData={[2.8,3.0,3.2,3.4,3.6,3.8,4.0,4.2]} sparkColor={BLUE} />
                <KPI label="Subutilizados" value="R$ 280M" sub="6.7% do total" icon={AlertTriangle} />
                <KPI label="Emendas em aberto" value="1.247" sub="R$ 890M" />
                <KPI label="Convenios vencendo 90d" value="34" sub="R$ 12M em risco" icon={Clock} />
                <KPI label="Alertas enviados" value="156" sub="Taxa de acao: 34%" />
                <KPI label="Economia gerada" value="R$ 2.3M" sub="Clientes que agiram nos alertas" icon={TrendingUp} sparkData={[0.8,1.0,1.2,1.4,1.6,1.8,2.0,2.3]} sparkColor={GREEN} />
              </div>

              <Section title="Insights automaticos">
                <div className="space-y-2">
                  {[
                    "R$ 280M em recursos subutilizados. Se 10% dos clientes agir, economia de R$ 4.6M",
                    "34 convenios vencem em 90 dias. 12 sao de clientes ATA360 — alertas ja enviados.",
                  ].map((ins, i) => (
                    <div key={i} className="bg-background border border-border/30 rounded-2xl p-3 flex items-start gap-2.5">
                      <Zap className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-foreground leading-relaxed">{ins}</p>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 12: ALERTAS / ANALYTICS
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "alerts" && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">3 criticos</span>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">8 atencao</span>
                <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">24 info</span>
                <span className="text-[10px] text-muted-foreground ml-2">Total: 35 (hoje)</span>
              </div>

              <Section title="Timeline de alertas" subtitle="Hoje">
                <div className="bg-background border border-border/30 rounded-2xl p-4">
                  <div className="space-y-0">
                    {[
                      { time: "14:32", color: RED, cat: "API", title: "TransfereGov timeout", desc: "3 falhas em 10 min" },
                      { time: "14:15", color: RED, cat: "Seguranca", title: "WAF: 342 blocks", desc: "Pico incomum" },
                      { time: "13:45", color: ORANGE, cat: "Usuario", title: "Pref. Itajuba — 32d sem acesso", desc: "Risco de churn" },
                      { time: "13:20", color: ORANGE, cat: "Pagamento", title: "CRAS Vespasiano — 45d atraso", desc: "Cobrar" },
                      { time: "12:00", color: ORANGE, cat: "Trial", title: "Camara Ouro Preto expira em 3d", desc: "Contatar" },
                      { time: "11:30", color: GREEN, cat: "Infra", title: "Backup ClickHouse OK (2.4TB)", desc: "" },
                      { time: "10:15", color: ORANGE, cat: "Cadastro", title: "Novo: Camara Sabara", desc: "Aguarda aprovacao" },
                      { time: "09:00", color: GREEN, cat: "Sistema", title: "23 membros na 1a hora", desc: "+12% acima da media" },
                      { time: "08:00", color: GREEN, cat: "Sync", title: "CATMAT sincronizado", desc: "12.400 registros" },
                    ].map((ev, i, arr) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="size-2.5 rounded-full border-2 shrink-0 mt-1" style={{ borderColor: ev.color, backgroundColor: ev.color }} />
                          {i < arr.length - 1 && <div className="w-px flex-1 bg-border/50 my-1" />}
                        </div>
                        <div className="pb-3 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-muted-foreground tabular-nums">{ev.time}</span>
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{ev.cat}</span>
                          </div>
                          <p className="text-[11px] font-medium text-foreground mt-0.5">{ev.title}</p>
                          {ev.desc && <p className="text-[10px] text-muted-foreground">{ev.desc}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>

              {/* Analytics section */}
              <div className="border-t border-border/30 pt-5 mt-2">
                <p className="text-[11px] font-semibold text-foreground mb-4 uppercase tracking-wider">Analytics — ata360.com.br</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <KPI label="Visitantes unicos (mes)" value="2.340" trend={18} sparkData={[1200,1400,1500,1700,1800,1900,2100,2340]} sparkColor={BLUE} />
                  <KPI label="Sessoes (mes)" value="4.120" trend={22} sparkData={[2000,2500,2800,3000,3200,3500,3800,4120]} sparkColor={BLUE} />
                  <KPI label="Bounce rate" value="34%" sub="Meta < 40%" sparkData={[45,42,40,38,37,36,35,34]} sparkColor={GREEN} />
                  <KPI label="Tempo médio sessão" value="8:42" trend={22} sparkData={[5,5.5,6,6.5,7,7.5,8,8.7]} sparkColor={GREEN} />
                  <KPI label="Paginas/sessao" value="4.8" sparkData={[3.5,3.8,4.0,4.2,4.3,4.5,4.6,4.8]} sparkColor={BLUE} />
                  <KPI label="Conversao formulario" value="4.2%" sparkData={[2.5,2.8,3.0,3.2,3.5,3.7,4.0,4.2]} sparkColor={GREEN} />
                  <KPI label="Posicao media Google" value="12.4" sub="Meta < 10" sparkData={[22,20,18,16,15,14,13,12.4]} sparkColor={BLUE} />
                  <KPI label="Impressoes Search" value="18.700" trend={45} sparkData={[8000,9500,11000,12500,14000,15500,17000,18700]} sparkColor={GREEN} />
                </div>
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 13: BIBLIOTECA LEGAL
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "legal" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
                <KPI label="Normativos indexados" value="4.872" sparkData={[3500,3800,4000,4200,4400,4600,4750,4872]} sparkColor={BLUE} />
                <KPI label="Jurisprudencia" value="12.340" sub="acordaos" icon={BookOpen} />
                <KPI label="Sumulas ativas" value="248" icon={Shield} />
                <KPI label="Cobertura Lei 14.133" value="100%" sub="Todos artigos" />
                <KPI label="Idade media base" value="3.2 dias" sub="Meta < 7d" sparkData={[5,4.5,4,3.8,3.6,3.4,3.3,3.2]} sparkColor={GREEN} />
              </div>

              <Section title="Status das fontes">
                <div className="bg-background border border-border/30 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-muted/50">
                          {["Fonte", "Tipo", "Docs", "Ultima sync", "Freq.", "Status"].map(h => (
                            <th key={h} className="text-[10px] uppercase text-muted-foreground font-medium px-3 py-2.5 tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { fonte: "Lei 14.133/2021", tipo: "Federal", docs: "194 art.", sync: "Hoje", freq: "Diaria", ok: true },
                          { fonte: "TCU Acordaos", tipo: "Jurisp.", docs: "8.420", sync: "Ha 2d", freq: "Semanal", ok: true },
                          { fonte: "TCU Sumulas", tipo: "Jurisp.", docs: "312", sync: "Ha 5d", freq: "Quinzenal", ok: true },
                          { fonte: "TCE-MG Orientacoes", tipo: "Estadual", docs: "1.240", sync: "Ha 3d", freq: "Semanal", ok: true },
                          { fonte: "AGU Pareceres", tipo: "Parecer", docs: "186", sync: "Ha 12d", freq: "Quinzenal", ok: false },
                          { fonte: "Forum Nac. Contrat.", tipo: "Enunciado", docs: "89", sync: "Ha 12d", freq: "Mensal", ok: false },
                          { fonte: "DOU / Imprensa Nac.", tipo: "Publ.", docs: "890", sync: "Hoje", freq: "Diaria", ok: true },
                          { fonte: "LexML", tipo: "Geral", docs: "2.340", sync: "Ha 1d", freq: "Diaria", ok: true },
                        ].map(f => (
                          <tr key={f.fonte} className="border-t border-border/20 hover:bg-muted/30 transition-colors">
                            <td className="px-3 py-2.5 text-[11px] font-medium text-foreground">{f.fonte}</td>
                            <td className="px-3 py-2.5 text-[10px] text-muted-foreground">{f.tipo}</td>
                            <td className="px-3 py-2.5 text-[11px] text-foreground tabular-nums">{f.docs}</td>
                            <td className="px-3 py-2.5 text-[10px] text-muted-foreground">{f.sync}</td>
                            <td className="px-3 py-2.5 text-[10px] text-muted-foreground">{f.freq}</td>
                            <td className="px-3 py-2.5">
                              <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full", f.ok ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-600")}>{f.ok ? "OK" : "Atrasado"}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Section>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 14: AGENTES MASTER
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "agents" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                <KPI label="Agentes ativos" value="6 + 2 beta" icon={Bot} />
                <KPI label="Interacoes (mes)" value="8.200" trend={18} sparkData={[5000,5500,6000,6500,7000,7500,7800,8200]} sparkColor={BLUE} />
                <KPI label="Precisao media" value="97.8%" sparkData={[96,96.5,97,97,97.2,97.5,97.6,97.8]} sparkColor={GREEN} />
                <KPI label="Custo total agentes" value="R$ 300/mes" sub="Margem: 99.7%" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {agentsData.map(agent => (
                  <div key={agent.name} className="bg-background border border-border/30 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[12px] font-semibold text-foreground">{agent.name}</span>
                      <span className="text-[9px] text-muted-foreground">{agent.version}</span>
                      <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full ml-auto",
                        agent.status === "active" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                      )}>{agent.status === "active" ? "Ativo" : "Beta"}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-3">{agent.desc}</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-[9px] text-muted-foreground">Interacoes/mes</p>
                        <p className="text-[13px] font-bold text-foreground tabular-nums">{agent.interactions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground">Precisao</p>
                        <p className="text-[13px] font-bold text-foreground tabular-nums">{agent.precision ? `${agent.precision}%` : "—"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground">Tokens/int.</p>
                        <p className="text-[13px] font-bold text-foreground tabular-nums">{agent.tokensPerInt.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground">Custo/mes</p>
                        <p className="text-[13px] font-bold text-foreground tabular-nums">R$ {agent.costMonth}</p>
                      </div>
                    </div>
                    {agent.positiveRate > 0 && (
                      <div>
                        <div className="flex justify-between text-[9px] mb-1">
                          <span className="text-muted-foreground">Feedback positivo</span>
                          <span className="text-foreground font-semibold">{agent.positiveRate}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden flex">
                          <div className="h-full bg-green-500" style={{ width: `${agent.positiveRate}%` }} />
                          <div className="h-full bg-red-400" style={{ width: `${100 - agent.positiveRate}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 15: AVALIACOES
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "reviews" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                <KPI label="Satisfacao geral" value="4.6/5.0" sparkData={[4.0,4.1,4.2,4.3,4.4,4.5,4.5,4.6]} sparkColor={GREEN} />
                <KPI label="NPS" value="72" sub="Excelente (meta > 50)" sparkData={[60,62,65,66,68,69,71,72]} sparkColor={GREEN} />
                <KPI label="Respostas positivas" value="89%" sub="Meta > 85%" sparkData={[82,83,84,85,86,87,88,89]} sparkColor={GREEN} />
                <KPI label="Respostas negativas" value="4.2%" sub="Meta < 5% — gera ticket" sparkData={[7,6.5,6,5.5,5,4.8,4.5,4.2]} sparkColor={RED} />
                <KPI label="Fornecedores avaliados" value="2.340" sub="Nota media: 3.8/5.0" />
                <KPI label="Sugestoes abertas" value="34" sub="8 implementadas este mes" />
              </div>

              <Section title="Comentarios recentes">
                <div className="space-y-2">
                  {[
                    { stars: 5, text: "Gerei o TR em 3 minutos, antes levava 2 dias", org: "Pref. Lagoa Santa" },
                    { stars: 5, text: "O assistente encontrou R$ 200K parados que nao sabiamos", org: "MP-MG" },
                    { stars: 4, text: "Bom mas faltou imprimir direto", org: "Camara Sete Lagoas" },
                    { stars: 3, text: "Travou ao buscar CNPJ novo", org: "Hospital Contagem" },
                  ].map((c, i) => (
                    <div key={i} className="bg-background border border-border/30 rounded-2xl p-3 flex items-start gap-3">
                      <div className="flex gap-0.5 shrink-0">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className={cn("size-3", s < c.stars ? "text-foreground fill-foreground" : "text-border")} />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-foreground">"{c.text}"</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">— {c.org}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Sugestoes da comunidade">
                <div className="bg-background border border-border/30 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/50">
                        {["Sugestao", "Origem", "Votos", "Status"].map(h => (
                          <th key={h} className="text-[10px] uppercase text-muted-foreground font-medium px-3 py-2.5 tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { text: "Exportar PDF direto do chat", origin: "Fale Conosco", votes: 23, status: "Planejado" },
                        { text: "App mobile", origin: "NPS", votes: 18, status: "Avaliando" },
                        { text: "Integrar WhatsApp", origin: "Tickets", votes: 15, status: "Avaliando" },
                        { text: "Comparar preços entre regiões", origin: "Chat", votes: 12, status: "Implementado" },
                      ].map(s => (
                        <tr key={s.text} className="border-t border-border/20 hover:bg-muted/30 transition-colors">
                          <td className="px-3 py-2.5 text-[11px] text-foreground">{s.text}</td>
                          <td className="px-3 py-2.5 text-[10px] text-muted-foreground">{s.origin}</td>
                          <td className="px-3 py-2.5 text-[11px] font-semibold text-foreground tabular-nums">{s.votes}</td>
                          <td className="px-3 py-2.5">
                            <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full",
                              s.status === "Implementado" ? "bg-green-50 text-green-700" :
                              s.status === "Planejado" ? "bg-blue-50 text-blue-700" :
                              "bg-amber-50 text-amber-600"
                            )}>{s.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ABA 16: MODELOS IA
             ═══════════════════════════════════════════════════════ */}
          {activeTab === "models" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                <KPI label="Modelos disponiveis" value="7" sub="3 ativos, 2 standby, 1 beta, 1 inativo" icon={Layers} />
                <KPI label="Requests (hoje)" value="1.240" sparkData={[980,1050,1100,1120,1150,1180,1200,1240]} sparkColor={BLUE} pulse />
                <KPI label="Custo IA (hoje)" value="R$ 94,20" sparkData={[85,88,90,91,92,93,93,94.2]} sparkColor={ORANGE} sub="Projecao mes: R$ 2.826" />
                <KPI label="Cache hit rate" value="23%" sparkData={[15,17,18,19,20,21,22,23]} sparkColor={GREEN} sub="Economia: R$ 870/mes" />
                <KPI label="Latência média" value="1.2s" sub="P50: 0.8s | P95: 3.2s" sparkData={[1.5,1.4,1.4,1.3,1.3,1.2,1.2,1.2]} sparkColor={BLUE} />
                <KPI label="Erro rate" value="0.3%" sub="Meta < 1%" sparkData={[0.8,0.7,0.6,0.5,0.5,0.4,0.3,0.3]} sparkColor={GREEN} />
              </div>

              <Section title="Inventário de modelos">
                <div className="bg-background border border-border/30 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-muted/50">
                          {["Modelo", "Camada", "Status", "Req/dia", "Latência", "Custo/mês"].map(h => (
                            <th key={h} className="text-[10px] uppercase text-muted-foreground font-medium px-3 py-2.5 tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { model: "Modelo A (rápido)", layer: "Camada 1", status: "active", req: "992 (80%)", lat: "180ms", cost: "R$ 8" },
                          { model: "Modelo B (padrão)", layer: "Camada 2", status: "active", req: "186 (15%)", lat: "820ms", cost: "R$ 45" },
                          { model: "Modelo C (expert)", layer: "Camada 3", status: "active", req: "62 (5%)", lat: "1.8s", cost: "R$ 247" },
                          { model: "Modelo D (embed)", layer: "Embeddings", status: "active", req: "2.400", lat: "95ms", cost: "R$ 12" },
                          { model: "Modelo E (backup)", layer: "Standby", status: "standby", req: "0", lat: "—", cost: "R$ 0" },
                          { model: "Modelo F (backup)", layer: "Standby", status: "standby", req: "0", lat: "—", cost: "R$ 0" },
                          { model: "Modelo G (teste)", layer: "Beta", status: "beta", req: "24", lat: "650ms", cost: "R$ 2" },
                        ].map(m => (
                          <tr key={m.model} className="border-t border-border/20 hover:bg-muted/30 transition-colors">
                            <td className="px-3 py-2.5 text-[11px] font-medium text-foreground">{m.model}</td>
                            <td className="px-3 py-2.5 text-[10px] text-muted-foreground">{m.layer}</td>
                            <td className="px-3 py-2.5">
                              <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full",
                                m.status === "active" ? "bg-green-50 text-green-700" :
                                m.status === "standby" ? "bg-amber-50 text-amber-600" :
                                "bg-blue-50 text-blue-700"
                              )}>{m.status === "active" ? "Ativo" : m.status === "standby" ? "Standby" : "Beta"}</span>
                            </td>
                            <td className="px-3 py-2.5 text-[11px] text-foreground tabular-nums">{m.req}</td>
                            <td className="px-3 py-2.5 text-[11px] text-foreground tabular-nums">{m.lat}</td>
                            <td className="px-3 py-2.5 text-[11px] font-semibold text-foreground tabular-nums">{m.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Section>

              <Section title="Arquitetura 3 camadas">
                <div className="bg-background border border-border/30 rounded-2xl p-4 space-y-3">
                  {[
                    { label: "Cache Semantico", desc: "Qdrant, TTL variavel. Se distance < 0.05, resposta imediata. Custo: R$ 0", pct: "23%", color: "#9CA3AF" },
                    { label: "Camada 1: Triagem (Modelo A)", desc: "Classifica intent, extrai parametros, roteia. 80% das requests. < 200ms", pct: "61.6%", color: BLUE },
                    { label: "Camada 2: Síntese (Modelo B)", desc: "Sintetiza resultados, gera docs básicos, análise preços. 15%", pct: "11.6%", color: GREEN },
                    { label: "Camada 3: Expert (Modelo C)", desc: "Docs jurídicos complexos, detecção fraude, pareceres. 2-5%", pct: "3.8%", color: PURPLE },
                  ].map((layer, i, arr) => (
                    <div key={layer.label}>
                      <div className="flex items-center gap-3">
                        <div className="size-3 rounded-full shrink-0" style={{ background: layer.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold text-foreground">{layer.label}</p>
                            <span className="text-[10px] font-semibold text-foreground tabular-nums">{layer.pct}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{layer.desc}</p>
                        </div>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-3 flex justify-center"><div className="w-px h-4 bg-border/50" /></div>
                          <span className="text-[9px] text-muted-foreground/50">miss / escalar</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Distribuicao por camada" subtitle="Custo mensal">
                <div className="bg-background border border-border/30 rounded-2xl p-4">
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={[
                            { name: "Cache", value: 23, color: "#9CA3AF" },
                            { name: "Camada 1", value: 61.6, color: BLUE },
                            { name: "Camada 2", value: 11.6, color: GREEN },
                            { name: "Camada 3", value: 3.8, color: PURPLE },
                          ]} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" stroke="none">
                            {[{ color: "#9CA3AF" }, { color: BLUE }, { color: GREEN }, { color: PURPLE }].map((e, i) => <Cell key={i} fill={e.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[
                        { label: "Cache", pct: "23%", cost: "R$ 0", color: "#9CA3AF" },
                        { label: "Camada 1 (Modelo A)", pct: "61.6%", cost: "R$ 8/mes", color: BLUE },
                        { label: "Camada 2 (Modelo B)", pct: "11.6%", cost: "R$ 45/mes", color: GREEN },
                        { label: "Camada 3 (Modelo C)", pct: "3.8%", cost: "R$ 247/mes", color: PURPLE },
                      ].map(l => (
                        <div key={l.label} className="flex items-center gap-2">
                          <span className="size-2.5 rounded-full shrink-0" style={{ background: l.color }} />
                          <span className="text-[11px] text-foreground flex-1">{l.label}</span>
                          <span className="text-[10px] text-muted-foreground">{l.pct}</span>
                          <span className="text-[10px] font-semibold text-foreground tabular-nums">{l.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-center text-lg font-bold text-foreground mt-3 tabular-nums">R$ 300/mes total</p>
                </div>
              </Section>

              <Section title="Comparativo de cenarios">
                <div className="bg-background border border-border/30 rounded-2xl p-4 space-y-2">
                  {[
                    { label: "Tudo Modelo C (sem roteamento)", cost: "R$ 4.960", vs: "+1.553%", bad: true },
                    { label: "Tudo Modelo B (sem roteamento)", cost: "R$ 580", vs: "+93%", bad: true },
                    { label: "3 Camadas (atual)", cost: "R$ 300", vs: "baseline", bad: false },
                    { label: "3 Camadas + cache otimizado (30%)", cost: "R$ 245", vs: "-18%", bad: false },
                  ].map(s => (
                    <div key={s.label} className={cn("flex items-center gap-3 p-2.5 rounded-full", s.vs === "baseline" ? "bg-muted" : "")}>
                      <span className="text-[11px] text-foreground flex-1">{s.label}</span>
                      <span className="text-[11px] font-bold text-foreground tabular-nums">{s.cost}</span>
                      <span className={cn("text-[10px] font-semibold tabular-nums", s.bad ? "text-red-600" : s.vs === "baseline" ? "text-foreground" : "text-green-700")}>{s.vs}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
