"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  FileText,
  Printer,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  PlusCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface RPPFonte {
  id: string;
  tipo: "pncp" | "fornecedor" | "catalogo" | "outro";
  nome: string;
  referencia: string;
  link: string;
  data: string;
  precoUnitario: number;
  valido: boolean;
}

export interface RPPItem {
  id: string;
  pdm: string;
  catmat: string;
  catserv: string;
  descricao: string;
  embalagem: string;
  unidade: string;
  quantidade: number;
  fontes: RPPFonte[];
}

export interface RPPData {
  titulo: string;
  objetivo: string;
  observacoes: string;
  enteNome: string;
  departamento: string;
  responsavel: string;
  data: string;
  itens: RPPItem[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function calcStats(fontes: RPPFonte[]) {
  const validos = fontes.filter((f) => f.valido).map((f) => f.precoUnitario);
  if (validos.length === 0) return { media: 0, mediana: 0, menor: 0, maior: 0, cv: 0 };

  const sorted = [...validos].sort((a, b) => a - b);
  const soma = sorted.reduce((a, b) => a + b, 0);
  const media = soma / sorted.length;
  const mediana =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1]! + sorted[sorted.length / 2]!) / 2
      : sorted[Math.floor(sorted.length / 2)]!;
  const menor = sorted[0]!;
  const maior = sorted[sorted.length - 1]!;
  const variancia = sorted.reduce((acc, v) => acc + (v - media) ** 2, 0) / sorted.length;
  const desvio = Math.sqrt(variancia);
  const cv = media > 0 ? (desvio / media) * 100 : 0;

  return { media, mediana, menor, maior, cv };
}

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

async function computeHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── Fonte Type Labels ──────────────────────────────────────────────────────────

const FONTE_TIPO_LABELS: Record<RPPFonte["tipo"], string> = {
  pncp: "PNCP / Compras.gov",
  fornecedor: "Fornecedor",
  catalogo: "Catálogo / Site",
  outro: "Outra Fonte",
};

// ─── Sub-Component: Fonte Row ───────────────────────────────────────────────────

function FonteRow({
  fonte,
  onUpdate,
  onRemove,
}: {
  fonte: RPPFonte;
  onUpdate: (updated: RPPFonte) => void;
  onRemove: () => void;
}) {
  return (
    <TableRow className={cn(!fonte.valido && "opacity-50")}>
      <TableCell>
        <Select
          value={fonte.tipo}
          onValueChange={(v) => onUpdate({ ...fonte, tipo: v as RPPFonte["tipo"] })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FONTE_TIPO_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          value={fonte.nome}
          onChange={(e) => onUpdate({ ...fonte, nome: e.target.value })}
          placeholder="Nome do fornecedor/órgão"
          className="h-8 text-xs"
        />
      </TableCell>
      <TableCell>
        <Input
          value={fonte.referencia}
          onChange={(e) => onUpdate({ ...fonte, referencia: e.target.value })}
          placeholder="Ref/ID"
          className="h-8 text-xs"
        />
      </TableCell>
      <TableCell>
        <Input
          value={fonte.link}
          onChange={(e) => onUpdate({ ...fonte, link: e.target.value })}
          placeholder="https://..."
          className="h-8 text-xs"
        />
      </TableCell>
      <TableCell>
        <Input
          type="date"
          value={fonte.data}
          onChange={(e) => onUpdate({ ...fonte, data: e.target.value })}
          className="h-8 text-xs"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={fonte.precoUnitario || ""}
          onChange={(e) =>
            onUpdate({ ...fonte, precoUnitario: parseFloat(e.target.value) || 0 })
          }
          placeholder="0,00"
          className="h-8 text-xs text-right"
        />
      </TableCell>
      <TableCell className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdate({ ...fonte, valido: !fonte.valido })}
          className={cn(
            "h-7 text-xs rounded-full px-3",
            fonte.valido
              ? "text-green-600 hover:text-green-700"
              : "text-red-500 hover:text-red-600"
          )}
        >
          {fonte.valido ? "Válido" : "Excluído"}
        </Button>
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="size-7 hover:bg-destructive/10 text-destructive/60 hover:text-destructive"
        >
          <Trash2 size={14} />
        </Button>
      </TableCell>
    </TableRow>
  );
}

// ─── Sub-Component: Item Card ───────────────────────────────────────────────────

function ItemCard({
  item,
  index,
  onUpdate,
  onRemove,
}: {
  item: RPPItem;
  index: number;
  onUpdate: (updated: RPPItem) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const stats = useMemo(() => calcStats(item.fontes), [item.fontes]);
  const validCount = item.fontes.filter((f) => f.valido).length;
  const precoRef = stats.mediana;
  const precoTotal = precoRef * item.quantidade;

  const addFonte = () => {
    const newFonte: RPPFonte = {
      id: generateId(),
      tipo: "pncp",
      nome: "",
      referencia: "",
      link: "",
      data: getTodayISO(),
      precoUnitario: 0,
      valido: true,
    };
    onUpdate({ ...item, fontes: [...item.fontes, newFonte] });
  };

  const updateFonte = (fonteId: string, updated: RPPFonte) => {
    onUpdate({
      ...item,
      fontes: item.fontes.map((f) => (f.id === fonteId ? updated : f)),
    });
  };

  const removeFonte = (fonteId: string) => {
    onUpdate({ ...item, fontes: item.fontes.filter((f) => f.id !== fonteId) });
  };

  return (
    <div className="border border-border/40 rounded-xl mb-4 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-8 rounded-full bg-foreground text-background text-sm font-bold">
            {index + 1}
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">
              {item.descricao || "Novo Item"}
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {item.pdm && (
                <Badge variant="outline" className="text-[10px] h-5">
                  PDM {item.pdm}
                </Badge>
              )}
              {item.catmat && (
                <Badge variant="outline" className="text-[10px] h-5">
                  CATMAT {item.catmat}
                </Badge>
              )}
              {item.catserv && (
                <Badge variant="outline" className="text-[10px] h-5">
                  CATSERV {item.catserv}
                </Badge>
              )}
              {item.embalagem && (
                <Badge variant="secondary" className="text-[10px] h-5">
                  {item.embalagem}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {validCount} fonte{validCount !== 1 ? "s" : ""} | Ref: R$ {formatCurrency(precoRef)} | Total: R$ {formatCurrency(precoTotal)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="size-8 hover:bg-destructive/10 text-destructive/60 hover:text-destructive"
          >
            <Trash2 size={14} />
          </Button>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Item fields */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Descritivo Resumido
              </label>
              <Input
                value={item.descricao}
                onChange={(e) => onUpdate({ ...item, descricao: e.target.value })}
                placeholder="Descrição do material/serviço"
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                PDM
              </label>
              <Input
                value={item.pdm}
                onChange={(e) => onUpdate({ ...item, pdm: e.target.value })}
                placeholder="000000"
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                CATMAT
              </label>
              <Input
                value={item.catmat}
                onChange={(e) => onUpdate({ ...item, catmat: e.target.value })}
                placeholder="000000"
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                CATSERV
              </label>
              <Input
                value={item.catserv}
                onChange={(e) => onUpdate({ ...item, catserv: e.target.value })}
                placeholder="000000"
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Embalagem
              </label>
              <Input
                value={item.embalagem}
                onChange={(e) => onUpdate({ ...item, embalagem: e.target.value })}
                placeholder="Cx c/ 100, Frasco 500ml"
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Unidade
              </label>
              <Input
                value={item.unidade}
                onChange={(e) => onUpdate({ ...item, unidade: e.target.value })}
                placeholder="UN"
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Qtde
              </label>
              <Input
                type="number"
                min="1"
                value={item.quantidade || ""}
                onChange={(e) =>
                  onUpdate({ ...item, quantidade: parseInt(e.target.value) || 1 })
                }
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* Fontes table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Fontes / Preços Coletados
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={addFonte}
                className="h-7 text-xs gap-1 rounded-full"
              >
                <PlusCircle size={12} />
                Adicionar Fonte
              </Button>
            </div>
            {item.fontes.length > 0 ? (
              <div className="border border-border/40 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20">
                      <TableHead className="text-[10px] w-[130px]">Tipo</TableHead>
                      <TableHead className="text-[10px]">Fornecedor/Fonte</TableHead>
                      <TableHead className="text-[10px] w-[100px]">Referência</TableHead>
                      <TableHead className="text-[10px] w-[140px]">Link Fonte</TableHead>
                      <TableHead className="text-[10px] w-[110px]">Data</TableHead>
                      <TableHead className="text-[10px] w-[110px] text-right">Preço Unit.</TableHead>
                      <TableHead className="text-[10px] w-[80px] text-center">Status</TableHead>
                      <TableHead className="text-[10px] w-[40px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.fontes.map((fonte) => (
                      <FonteRow
                        key={fonte.id}
                        fonte={fonte}
                        onUpdate={(updated) => updateFonte(fonte.id, updated)}
                        onRemove={() => removeFonte(fonte.id)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-6 border border-dashed border-border/40 rounded-lg">
                Nenhuma fonte adicionada. Clique em &quot;Adicionar Fonte&quot; para inserir cotações.
              </div>
            )}
          </div>

          {/* Stats summary */}
          {validCount > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { label: "Menor", value: stats.menor },
                { label: "Média", value: stats.media },
                { label: "Mediana", value: stats.mediana, highlight: true },
                { label: "Maior", value: stats.maior },
                { label: "C.V.", value: stats.cv, suffix: "%", alert: stats.cv > 25 },
                { label: "Preço Ref.", value: precoRef, highlight: true },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={cn(
                    "rounded-lg border p-2.5 text-center",
                    stat.highlight
                      ? "border-primary/30 bg-primary/5"
                      : stat.alert
                        ? "border-destructive/30 bg-destructive/5"
                        : "border-border/40"
                  )}
                >
                  <div className="text-[10px] text-muted-foreground uppercase">{stat.label}</div>
                  <div
                    className={cn(
                      "text-sm font-bold mt-0.5",
                      stat.highlight
                        ? "text-primary"
                        : stat.alert
                          ? "text-destructive"
                          : "text-foreground"
                    )}
                  >
                    {stat.suffix
                      ? `${stat.value.toFixed(1)}${stat.suffix}`
                      : `R$ ${formatCurrency(stat.value)}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PDF Generation ─────────────────────────────────────────────────────────────
// HTML gerado inline (não usa template externo) — necessário para interpolação
// dinâmica dos dados e geração PDF client-side via window.print().
// RPP é documento auxiliar informal — NÃO faz parte da trilha de contratação.

function generateReportHTML(data: RPPData): string {
  const now = new Date();
  const dataGeracao = now.toLocaleDateString("pt-BR");
  const horaGeracao = now.toLocaleTimeString("pt-BR");
  const docNumero = `RPP-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${generateId().toUpperCase()}`;

  let totalGeral = 0;
  let totalFontes = 0;

  const itensHTML = data.itens
    .map((item, idx) => {
      const stats = calcStats(item.fontes);
      const precoRef = stats.mediana;
      const precoTotal = precoRef * item.quantidade;
      totalGeral += precoTotal;
      const validCount = item.fontes.filter((f) => f.valido).length;
      totalFontes += item.fontes.length;

      const fontesRows = item.fontes
        .map(
          (f, fi) => `
          <tr>
            <td class="numero">${fi + 1}</td>
            <td>${f.link ? `<a href="${escapeHtml(f.link)}" target="_blank" style="color: var(--azul-primario); text-decoration: none; border-bottom: 1pt dotted var(--azul-primario);">${escapeHtml(f.nome || FONTE_TIPO_LABELS[f.tipo])}</a>` : escapeHtml(f.nome || FONTE_TIPO_LABELS[f.tipo])}</td>
            <td>${escapeHtml(f.referencia || "—")}</td>
            <td>${f.data ? new Date(f.data + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</td>
            <td class="valor ${!f.valido ? "preco-excluido" : ""}">R$ ${formatCurrency(f.precoUnitario)}</td>
            <td style="text-align:center" class="${f.valido ? "status-valido" : "status-excluido"}">${f.valido ? "Valido" : "Excluido"}</td>
          </tr>`
        )
        .join("");

      return `
        <div class="item-card">
          <div class="item-card-header">
            <div style="display:flex;align-items:center;">
              <div class="item-numero">${idx + 1}</div>
              <div class="item-descricao">${item.descricao || "Item sem descrição"}</div>
            </div>
            <div class="item-catmat">${[item.catmat ? `CATMAT ${item.catmat}` : "", item.catserv ? `CATSERV ${item.catserv}` : "", item.pdm ? `PDM ${item.pdm}` : ""].filter(Boolean).join(" | ") || "—"}</div>
          </div>
          <div class="item-card-body">
            <div class="item-meta">
              <span><strong>Unidade:</strong> ${item.unidade || "UN"}</span>
              <span><strong>Embalagem:</strong> ${escapeHtml(item.embalagem || "—")}</span>
              <span><strong>Quantidade:</strong> ${item.quantidade}</span>
              <span><strong>Fontes válidas:</strong> ${validCount} de ${item.fontes.length}</span>
            </div>
            <table class="fontes-tabela">
              <thead>
                <tr>
                  <th style="width:30pt">N</th>
                  <th>Fonte / Fornecedor</th>
                  <th>Referencia</th>
                  <th>Data</th>
                  <th style="text-align:right">Preco Unit. (R$)</th>
                  <th style="text-align:center;width:60pt">Status</th>
                </tr>
              </thead>
              <tbody>${fontesRows}</tbody>
            </table>
            <div class="item-resumo">
              <div class="stat"><div class="stat-label">Menor</div><div class="stat-valor">R$ ${formatCurrency(stats.menor)}</div></div>
              <div class="stat"><div class="stat-label">Media</div><div class="stat-valor">R$ ${formatCurrency(stats.media)}</div></div>
              <div class="stat"><div class="stat-label">Mediana</div><div class="stat-valor destaque">R$ ${formatCurrency(stats.mediana)}</div></div>
              <div class="stat"><div class="stat-label">Maior</div><div class="stat-valor">R$ ${formatCurrency(stats.maior)}</div></div>
              <div class="stat"><div class="stat-label">Coef. Variacao</div><div class="stat-valor ${stats.cv > 25 ? "alerta" : ""}">${stats.cv.toFixed(1)}%</div></div>
              <div class="stat"><div class="stat-label">Preco Ref.</div><div class="stat-valor destaque"><span class="preco-destaque">R$ ${formatCurrency(precoRef)}</span></div></div>
            </div>
          </div>
        </div>`;
    })
    .join("");

  const consolidadoRows = data.itens
    .map((item, idx) => {
      const stats = calcStats(item.fontes);
      const precoRef = stats.mediana;
      const precoTotal = precoRef * item.quantidade;
      return `
        <tr>
          <td class="numero">${idx + 1}</td>
          <td>${escapeHtml(item.pdm || "—")}</td>
          <td>${escapeHtml([item.catmat, item.catserv].filter(Boolean).join(" / ") || "—")}</td>
          <td>${escapeHtml(item.descricao || "—")}</td>
          <td>${escapeHtml(item.embalagem || "—")}</td>
          <td class="numero">${item.quantidade}</td>
          <td class="valor"><span class="preco-destaque">R$ ${formatCurrency(precoRef)}</span></td>
          <td class="valor"><strong>R$ ${formatCurrency(precoTotal)}</strong></td>
        </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Relatorio de Pesquisa de Preco - RPP</title>
    <style>
        @page { size: A4; margin: 22mm 22mm 28mm 22mm; @bottom-center { content: "Pagina " counter(page) " de " counter(pages); font-family: 'Palatino Linotype', serif; font-size: 9pt; color: #666; } }
        @page :first { margin-top: 18mm; }
        :root { --azul-primario: #1e3a5f; --azul-secundario: #2c5282; --azul-claro: #e8f0f8; --vermelho: #c53030; --verde: #276749; --amarelo: #d69e2e; --cinza-escuro: #2d3748; --cinza-medio: #4a5568; --cinza-claro: #f7fafc; --cinza-linha: #e2e8f0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif; font-size: 10.5pt; line-height: 1.65; color: var(--cinza-escuro); text-align: justify; }
        .header { display: flex; justify-content: space-between; padding-bottom: 14pt; border-bottom: 2.5pt solid var(--azul-primario); margin-bottom: 16pt; }
        .header-left { flex: 1; padding-right: 20pt; }
        .header-left .ente { font-size: 15pt; font-weight: bold; color: var(--azul-primario); margin-bottom: 4pt; }
        .header-left .subordinacao { font-size: 9.5pt; color: var(--cinza-medio); line-height: 1.5; }
        .logo-placeholder { width: 85pt; height: 85pt; border: 1.5pt dashed #cbd5e0; display: flex; align-items: center; justify-content: center; font-size: 9pt; color: #a0aec0; background: #f8fafc; }
        .doc-id-box { background: linear-gradient(135deg, var(--azul-primario), var(--azul-secundario)); color: white; padding: 14pt 18pt; margin-bottom: 16pt; border-radius: 4pt; }
        .doc-id-box .titulo { font-size: 17pt; font-weight: bold; margin-bottom: 4pt; }
        .doc-id-box .subtitulo { font-size: 10pt; opacity: 0.85; font-style: italic; }
        .doc-id-box .auxiliar-badge { display: inline-block; background: rgba(255,255,255,0.2); border: 1pt solid rgba(255,255,255,0.4); padding: 2pt 10pt; border-radius: 12pt; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.5pt; margin-top: 6pt; }
        .doc-numeros { display: flex; justify-content: space-between; margin-top: 12pt; padding-top: 12pt; border-top: 1pt solid rgba(255,255,255,0.3); }
        .doc-numeros .item { text-align: center; }
        .doc-numeros .label { font-size: 8pt; text-transform: uppercase; opacity: 0.8; }
        .doc-numeros .valor { font-size: 12pt; font-weight: bold; margin-top: 2pt; }
        .nota-informativa { background: #fffbeb; border: 1pt solid #f6e05e; border-left: 4pt solid var(--amarelo); padding: 10pt 14pt; margin-bottom: 16pt; border-radius: 4pt; font-size: 9pt; color: #744210; line-height: 1.5; }
        .nota-informativa strong { color: #92400e; }
        .rastreabilidade { display: flex; justify-content: space-between; background: white; border: 1pt solid var(--cinza-linha); padding: 12pt; margin-bottom: 18pt; }
        .rastreabilidade-info { flex: 1; font-size: 8.5pt; color: var(--cinza-medio); line-height: 1.6; }
        .rastreabilidade-info strong { color: var(--cinza-escuro); }
        .qr-area { width: 72pt; height: 72pt; border: 1pt dashed var(--cinza-linha); display: flex; align-items: center; justify-content: center; font-size: 7pt; color: var(--cinza-medio); text-align: center; margin-left: 16pt; }
        .secao { margin-bottom: 24pt; page-break-inside: avoid; }
        .secao-header { display: flex; align-items: stretch; margin-bottom: 12pt; }
        .secao-numero { background: var(--azul-primario); color: white; width: 30pt; min-height: 38pt; display: flex; align-items: center; justify-content: center; font-size: 14pt; font-weight: bold; }
        .secao-titulo-area { flex: 1; background: var(--azul-claro); padding: 8pt 12pt; }
        .secao-titulo { font-size: 11pt; font-weight: bold; color: var(--azul-primario); }
        .secao-fundamento { font-size: 8pt; color: var(--cinza-medio); margin-top: 2pt; }
        .secao-conteudo { padding: 0 4pt; }
        .campo { margin-bottom: 12pt; }
        .campo-label { font-size: 9pt; font-weight: bold; color: var(--azul-primario); margin-bottom: 4pt; text-transform: uppercase; }
        .campo-valor { font-size: 10.5pt; color: var(--cinza-escuro); line-height: 1.6; }
        .tabela { width: 100%; border-collapse: collapse; margin: 12pt 0; font-size: 9pt; }
        .tabela th { background: var(--azul-primario); color: white; padding: 8pt 10pt; text-align: left; font-size: 8.5pt; text-transform: uppercase; }
        .tabela td { padding: 8pt 10pt; border-bottom: 1pt solid var(--cinza-linha); }
        .tabela tr:nth-child(even) { background: var(--cinza-claro); }
        .tabela .numero { text-align: center; width: 40pt; }
        .tabela .valor { text-align: right; white-space: nowrap; }
        .item-card { border: 1pt solid var(--cinza-linha); border-radius: 4pt; margin-bottom: 16pt; page-break-inside: avoid; }
        .item-card-header { background: var(--azul-claro); padding: 10pt 14pt; border-bottom: 1pt solid var(--cinza-linha); display: flex; justify-content: space-between; align-items: center; }
        .item-card-header .item-numero { background: var(--azul-primario); color: white; width: 24pt; height: 24pt; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10pt; font-weight: bold; margin-right: 10pt; }
        .item-card-header .item-descricao { flex: 1; font-size: 10pt; font-weight: bold; color: var(--azul-primario); }
        .item-card-header .item-catmat { font-size: 8pt; color: var(--cinza-medio); background: white; padding: 2pt 8pt; border-radius: 10pt; border: 1pt solid var(--cinza-linha); }
        .item-card-body { padding: 12pt 14pt; }
        .item-meta { display: flex; gap: 20pt; margin-bottom: 10pt; font-size: 9pt; color: var(--cinza-medio); }
        .item-meta strong { color: var(--cinza-escuro); }
        .fontes-tabela { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin: 8pt 0; }
        .fontes-tabela th { background: var(--cinza-claro); color: var(--cinza-escuro); padding: 6pt 8pt; text-align: left; font-size: 8pt; text-transform: uppercase; border-bottom: 1.5pt solid var(--cinza-linha); }
        .fontes-tabela td { padding: 6pt 8pt; border-bottom: 1pt solid var(--cinza-linha); }
        .fontes-tabela tr:nth-child(even) { background: #fafbfc; }
        .item-resumo { display: flex; justify-content: space-between; background: var(--cinza-claro); border: 1pt solid var(--cinza-linha); border-radius: 4pt; padding: 10pt 14pt; margin-top: 10pt; }
        .item-resumo .stat { text-align: center; }
        .item-resumo .stat-label { font-size: 7.5pt; text-transform: uppercase; color: var(--cinza-medio); margin-bottom: 2pt; }
        .item-resumo .stat-valor { font-size: 11pt; font-weight: bold; color: var(--cinza-escuro); }
        .item-resumo .stat-valor.destaque { color: var(--verde); }
        .item-resumo .stat-valor.alerta { color: var(--vermelho); }
        .consolidado-total { background: linear-gradient(135deg, var(--azul-primario), var(--azul-secundario)); color: white; padding: 14pt 18pt; border-radius: 4pt; display: flex; justify-content: space-between; align-items: center; margin-top: 14pt; }
        .consolidado-total .total-label { font-size: 11pt; font-weight: bold; }
        .consolidado-total .total-valor { font-size: 18pt; font-weight: bold; }
        .preco-destaque { background: var(--verde); color: white; padding: 2pt 6pt; border-radius: 2pt; font-weight: bold; }
        .preco-excluido { text-decoration: line-through; color: var(--vermelho); }
        .status-valido { color: var(--verde); font-weight: bold; }
        .status-excluido { color: var(--vermelho); font-weight: bold; }
        .observacoes-box { border: 1.5pt solid var(--cinza-linha); border-radius: 4pt; padding: 16pt; margin: 16pt 0; min-height: 80pt; }
        .observacoes-box .obs-conteudo { font-size: 10pt; color: var(--cinza-escuro); line-height: 1.7; white-space: pre-wrap; }
        .disclaimer { background: var(--cinza-claro); border: 1pt solid var(--cinza-linha); border-radius: 4pt; padding: 14pt 16pt; margin: 24pt 0 16pt 0; text-align: center; }
        .disclaimer p { font-size: 8.5pt; color: var(--cinza-medio); line-height: 1.5; margin-bottom: 4pt; }
        .disclaimer p strong { color: var(--cinza-escuro); }
        .disclaimer .legal-ref { font-size: 7.5pt; color: #a0aec0; font-style: italic; margin-top: 4pt; }
        .selo-area { text-align: center; margin-top: 30pt; padding-top: 20pt; border-top: 1pt solid var(--cinza-linha); }
        .selo-texto { font-size: 8pt; color: var(--cinza-medio); }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <div class="ente">${escapeHtml(data.enteNome || "Ente Público")}</div>
            <div class="subordinacao">${escapeHtml(data.departamento || "")}</div>
        </div>
        <div class="header-right">
            <div class="logo-placeholder">BRASAO</div>
        </div>
    </div>
    <div class="doc-id-box">
        <div class="titulo">RELATORIO DE PESQUISA DE PRECO</div>
        <div class="subtitulo">${escapeHtml(data.titulo || "Pesquisa de preços para planejamento")}</div>
        <div class="auxiliar-badge">Documento Auxiliar — Sem Validade Legal</div>
        <div class="doc-numeros">
            <div class="item"><div class="label">N Relatorio</div><div class="valor">${docNumero}</div></div>
            <div class="item"><div class="label">Departamento</div><div class="valor">${escapeHtml(data.departamento || "—")}</div></div>
            <div class="item"><div class="label">Responsavel</div><div class="valor">${escapeHtml(data.responsavel || "—")}</div></div>
            <div class="item"><div class="label">Data</div><div class="valor">${dataGeracao}</div></div>
        </div>
    </div>
    <div class="nota-informativa">
        <strong>Nota:</strong> Este relatorio tem carater exclusivamente informativo e auxiliar. Nao substitui a Pesquisa de Precos formal prevista na IN SEGES/ME n 65/2021. Pode ser utilizado como subsidio para elaboracao do PCA, estimativas de compras futuras e geracao automatica de documentos pelo ATA360.
    </div>
    <div class="rastreabilidade">
        <div class="rastreabilidade-info">
            <strong>ID:</strong> ${docNumero}<br>
            <strong>Hash SHA-256:</strong> <span id="hash-placeholder">calculando...</span><br>
            <strong>Gerado em:</strong> ${dataGeracao} as ${horaGeracao}<br>
            <strong>Itens pesquisados:</strong> ${data.itens.length}<br>
            <strong>Fontes consultadas:</strong> ${totalFontes}
        </div>
        <div class="qr-area">[QR CODE]<br>Verificacao</div>
    </div>
    <div class="secao">
        <div class="secao-header">
            <div class="secao-numero">1</div>
            <div class="secao-titulo-area">
                <div class="secao-titulo">Objetivo da Pesquisa</div>
                <div class="secao-fundamento">Documento auxiliar para planejamento</div>
            </div>
        </div>
        <div class="secao-conteudo">
            <div class="campo">
                <div class="campo-label">Descricao do Objetivo</div>
                <div class="campo-valor">${escapeHtml(data.objetivo || "Levantamento de preços de referência para planejamento de contratações.")}</div>
            </div>
        </div>
    </div>
    <div class="secao">
        <div class="secao-header">
            <div class="secao-numero">2</div>
            <div class="secao-titulo-area">
                <div class="secao-titulo">Itens Pesquisados</div>
                <div class="secao-fundamento">Detalhamento por item com fontes e precos coletados</div>
            </div>
        </div>
        <div class="secao-conteudo">
            ${itensHTML}
        </div>
    </div>
    <div class="secao">
        <div class="secao-header">
            <div class="secao-numero">3</div>
            <div class="secao-titulo-area">
                <div class="secao-titulo">Resumo Consolidado</div>
                <div class="secao-fundamento">Sintese dos precos de referencia apurados</div>
            </div>
        </div>
        <div class="secao-conteudo">
            <table class="tabela">
                <thead>
                    <tr>
                        <th class="numero">Item</th>
                        <th>PDM</th>
                        <th>CATMAT/CATSERV</th>
                        <th>Descritivo Resumido</th>
                        <th>Embalagem</th>
                        <th class="numero">Qtde</th>
                        <th class="valor">Preco Unit. Ref.</th>
                        <th class="valor">Preco Total</th>
                    </tr>
                </thead>
                <tbody>${consolidadoRows}</tbody>
            </table>
            <div class="consolidado-total">
                <div class="total-label">VALOR TOTAL ESTIMADO</div>
                <div class="total-valor">R$ ${formatCurrency(totalGeral)}</div>
            </div>
        </div>
    </div>
    <div class="secao">
        <div class="secao-header">
            <div class="secao-numero">4</div>
            <div class="secao-titulo-area">
                <div class="secao-titulo">Observacoes</div>
                <div class="secao-fundamento">Notas, justificativas e consideracoes adicionais</div>
            </div>
        </div>
        <div class="secao-conteudo">
            <div class="observacoes-box">
                <div class="obs-conteudo">${escapeHtml(data.observacoes || "Sem observações adicionais.")}</div>
            </div>
        </div>
    </div>
    <div class="secao">
        <div class="secao-header">
            <div class="secao-numero">5</div>
            <div class="secao-titulo-area">
                <div class="secao-titulo">Instrucoes de Uso deste Documento</div>
                <div class="secao-fundamento">Orientacoes sobre finalidade e limitacoes</div>
            </div>
        </div>
        <div class="secao-conteudo">
            <div class="alerta alerta-atencao">
                <strong>IMPORTANTE:</strong> Este Relatorio de Pesquisa de Preco e um documento <strong>auxiliar e informativo</strong>. Ele <strong>NAO substitui</strong> a Pesquisa de Precos formal prevista na IN SEGES/ME n 65/2021 e <strong>NAO possui validade legal</strong> para fins de instrucao processual obrigatoria.
            </div>
            <div class="campo">
                <div class="campo-label">Finalidades permitidas</div>
                <div class="campo-valor">
                    <strong>I.</strong> Subsidiar a elaboracao do PCA (Plano de Contratacoes Anual);<br>
                    <strong>II.</strong> Estimar valores para planejamento de compras futuras;<br>
                    <strong>III.</strong> Servir como anexo auxiliar para o ATA360 na geracao automatica de documentos do processo;<br>
                    <strong>IV.</strong> Apoiar a tomada de decisao interna sobre contratacoes;<br>
                    <strong>V.</strong> Fornecer referencia de precos para analise preliminar.
                </div>
            </div>
            <div class="campo">
                <div class="campo-label">Limitacoes</div>
                <div class="campo-valor">
                    <strong>I.</strong> Nao substitui a Pesquisa de Precos formal (IN SEGES/ME 65/2021, Arts. 5 a 7);<br>
                    <strong>II.</strong> Nao possui validade legal para instrucao de processo licitatorio;<br>
                    <strong>III.</strong> Nao dispensa a coleta formal de propostas junto a fornecedores;<br>
                    <strong>IV.</strong> Os precos aqui constantes sao meramente referenciais e podem sofrer variacao.
                </div>
            </div>
        </div>
    </div>
    <div class="disclaimer">
        <p><strong>AVISO:</strong> Este Relatorio de Pesquisa de Preco tem carater exclusivamente informativo e auxiliar.</p>
        <p>Nao possui validade legal e nao substitui a Pesquisa de Precos formal exigida pela legislacao vigente.</p>
        <p>Pode ser utilizado como subsidio para: PCA (Plano de Contratacoes Anual), estimativas de compras futuras, e geracao automatica de documentos processuais.</p>
        <p class="legal-ref">Referencia: Lei 14.133/2021, Art. 23 | IN SEGES/ME 65/2021 | Decreto 10.947/2022</p>
    </div>
    <div class="selo-area">
        <div class="selo-texto">&copy; 2026 Powered by ATA360 - Sistema de Inteligencia em Contratacoes Publicas</div>
    </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function handlePrintPDF(data: RPPData) {
  const html = generateReportHTML(data);

  // Calculate hash
  const hash = await computeHash(html);
  const finalHTML = html.replace("calculando...</span>", `${hash}</span>`);

  // Open print window
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Por favor, permita popups para gerar o PDF.");
    return;
  }
  printWindow.document.write(finalHTML);
  printWindow.document.close();
  // Wait for rendering then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

// ─── Main Component ─────────────────────────────────────────────────────────────

interface PriceResearchReportProps {
  importedItems?: RPPItem[];
  onBack?: () => void;
}

export function PriceResearchReport({ importedItems, onBack }: PriceResearchReportProps) {
  const [data, setData] = useState<RPPData>(() => ({
    titulo: "",
    objetivo: "",
    observacoes: "",
    enteNome: "",
    departamento: "",
    responsavel: "",
    data: getTodayISO(),
    itens: importedItems || [],
  }));

  const [showPreview, setShowPreview] = useState(false);

  // Load items from sessionStorage (from price-research-page)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("rpp-items");
      if (stored) {
        const items = JSON.parse(stored) as RPPItem[];
        if (items.length > 0) {
          setData((prev) => ({ ...prev, itens: [...prev.itens, ...items] }));
          sessionStorage.removeItem("rpp-items");
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const updateField = useCallback(
    <K extends keyof RPPData>(field: K, value: RPPData[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const addItem = useCallback(() => {
    const newItem: RPPItem = {
      id: generateId(),
      pdm: "",
      catmat: "",
      catserv: "",
      descricao: "",
      embalagem: "",
      unidade: "UN",
      quantidade: 1,
      fontes: [],
    };
    setData((prev) => ({ ...prev, itens: [...prev.itens, newItem] }));
  }, []);

  const updateItem = useCallback((itemId: string, updated: RPPItem) => {
    setData((prev) => ({
      ...prev,
      itens: prev.itens.map((i) => (i.id === itemId ? updated : i)),
    }));
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setData((prev) => ({
      ...prev,
      itens: prev.itens.filter((i) => i.id !== itemId),
    }));
  }, []);

  // Consolidated totals
  const totalGeral = useMemo(() => {
    return data.itens.reduce((sum, item) => {
      const stats = calcStats(item.fontes);
      return sum + stats.mediana * item.quantidade;
    }, 0);
  }, [data.itens]);

  const totalItens = data.itens.length;
  const totalFontes = data.itens.reduce((sum, item) => sum + item.fontes.length, 0);

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-border/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="size-9 rounded-full hover:bg-muted"
                >
                  <ArrowLeft size={18} />
                </Button>
              )}
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText size={20} />
                Relatório de Pesquisa de Preço
              </h1>
              <Badge variant="outline" className="text-xs">
                Documento Auxiliar
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 h-9 rounded-full"
                    disabled={totalItens === 0}
                  >
                    <Eye size={14} />
                    Pré-visualizar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Pré-visualização do Relatório</DialogTitle>
                  </DialogHeader>
                  <PreviewFrame data={data} />
                </DialogContent>
              </Dialog>
              <Button
                className="gap-2 h-9 rounded-full bg-foreground text-background hover:bg-foreground/90"
                onClick={() => handlePrintPDF(data)}
                disabled={totalItens === 0}
              >
                <Printer size={14} />
                Gerar PDF
              </Button>
            </div>
          </div>

          {/* Summary bar */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{totalItens}</strong> ite{totalItens !== 1 ? "ns" : "m"}
            </span>
            <span>
              <strong className="text-foreground">{totalFontes}</strong> fonte{totalFontes !== 1 ? "s" : ""}
            </span>
            <span>
              Total estimado: <strong className="text-foreground">R$ {formatCurrency(totalGeral)}</strong>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-6">
          {/* Metadata */}
          <div className="border border-border/40 rounded-xl p-4 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Dados do Relatório</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Título do Relatório
                </label>
                <Input
                  value={data.titulo}
                  onChange={(e) => updateField("titulo", e.target.value)}
                  placeholder="Ex: Pesquisa de preços para equipamentos hospitalares"
                  className="h-9"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Nome do Ente / Órgão
                </label>
                <Input
                  value={data.enteNome}
                  onChange={(e) => updateField("enteNome", e.target.value)}
                  placeholder="Prefeitura Municipal / Secretaria..."
                  className="h-9"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Departamento
                </label>
                <Input
                  value={data.departamento}
                  onChange={(e) => updateField("departamento", e.target.value)}
                  placeholder="Departamento de Compras"
                  className="h-9"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Responsável
                </label>
                <Input
                  value={data.responsavel}
                  onChange={(e) => updateField("responsavel", e.target.value)}
                  placeholder="Nome do responsável pela pesquisa"
                  className="h-9"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Objetivo da Pesquisa
              </label>
              <Textarea
                value={data.objetivo}
                onChange={(e) => updateField("objetivo", e.target.value)}
                placeholder="Descreva o objetivo desta pesquisa de preço..."
                className="min-h-[60px] text-sm"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Itens da Pesquisa</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={addItem}
                className="h-8 gap-1.5 rounded-full text-xs"
              >
                <Plus size={14} />
                Adicionar Item
              </Button>
            </div>

            {data.itens.length > 0 ? (
              data.itens.map((item, idx) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  index={idx}
                  onUpdate={(updated) => updateItem(item.id, updated)}
                  onRemove={() => removeItem(item.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-border/40 rounded-xl">
                <FileText size={32} className="mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  Nenhum item adicionado. Adicione itens manualmente ou importe da pesquisa de preços.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="gap-1.5 rounded-full"
                >
                  <Plus size={14} />
                  Adicionar Primeiro Item
                </Button>
              </div>
            )}
          </div>

          {/* Consolidated total */}
          {totalItens > 0 && (
            <div className="bg-foreground text-background rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm font-bold">VALOR TOTAL ESTIMADO</span>
              <span className="text-xl font-bold">R$ {formatCurrency(totalGeral)}</span>
            </div>
          )}

          {/* Observations */}
          <div className="border border-border/40 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-foreground mb-2">Observações</h2>
            <Textarea
              value={data.observacoes}
              onChange={(e) => updateField("observacoes", e.target.value)}
              placeholder="Notas, justificativas e considerações adicionais..."
              className="min-h-[80px] text-sm"
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

// ─── Preview Frame ──────────────────────────────────────────────────────────────

function PreviewFrame({ data }: { data: RPPData }) {
  const html = generateReportHTML(data);
  return (
    <iframe
      srcDoc={html}
      className="w-full h-[70vh] border border-border rounded-lg"
      title="Preview do Relatório"
    />
  );
}
