"use client";

import React, { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface RPPItem {
  numero: number;
  catmat: string;
  catserv?: string;
  pdm: string;
  descricao: string;
  fonteNome: string;
  fonteLink: string;
  embalagem: string;
  precoUnitario: number;
  quantidade: number;
}

export interface RPPData {
  // Identificação
  docNumero: string;
  processoReferencia: string;
  versao: string;
  data: string;
  // Ente
  enteNome: string;
  secretaria: string;
  departamento: string;
  // Objeto
  objetoDescricao: string;
  finalidade: string;
  tipoObjeto: "material" | "servico" | "misto";
  areaDemandante: string;
  // Itens
  itens: RPPItem[];
  // Metodologia
  metodologia: string;
  periodoReferencia: string;
  // Observação
  observacaoFinal: string;
  // Elaborador
  elaboradorNome: string;
  elaboradorSetor: string;
  // Rastreabilidade
  rastreabilidadeId: string;
  hashDocumento: string;
  dataGeracao: string;
  horaGeracao: string;
}

interface RPPDocumentProps {
  data: RPPData;
  isEditing?: boolean;
  onDataChange?: (data: RPPData) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function RPPDocument({ data: initialData, isEditing = false, onDataChange }: RPPDocumentProps) {
  const [data, setData] = useState<RPPData>(initialData);

  const updateData = (newData: RPPData) => {
    setData(newData);
    onDataChange?.(newData);
  };

  const handleFieldChange = (field: keyof RPPData, value: string) => {
    updateData({ ...data, [field]: value });
  };

  const handleItemChange = (index: number, field: keyof RPPItem, value: string | number) => {
    const newItens = [...data.itens];
    newItens[index] = { ...newItens[index], [field]: value } as RPPItem;
    updateData({ ...data, itens: newItens });
  };

  const handleRemoveItem = (index: number) => {
    const newItens = data.itens
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, numero: i + 1 }));
    updateData({ ...data, itens: newItens });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const valorTotal = data.itens.reduce((sum, item) => sum + item.precoUnitario * item.quantidade, 0);
  const precosUnitarios = data.itens.map((i) => i.precoUnitario);
  const menorPreco = Math.min(...precosUnitarios);
  const maiorPreco = Math.max(...precosUnitarios);
  const precoMedio = precosUnitarios.reduce((a, b) => a + b, 0) / precosUnitarios.length;

  const sortedPrecos = [...precosUnitarios].sort((a, b) => a - b);
  const mediana =
    sortedPrecos.length % 2 === 0
      ? (sortedPrecos[sortedPrecos.length / 2 - 1]! + sortedPrecos[sortedPrecos.length / 2]!) / 2
      : sortedPrecos[Math.floor(sortedPrecos.length / 2)]!;

  const desvio = Math.sqrt(
    precosUnitarios.reduce((sum, p) => sum + Math.pow(p - precoMedio, 2), 0) / precosUnitarios.length
  );
  const coefVariacao = precoMedio > 0 ? ((desvio / precoMedio) * 100).toFixed(1) : "0.0";

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = { material: "Material", servico: "Serviço", misto: "Material + Serviço" };
    return labels[tipo] || tipo;
  };

  return (
    <div className="bg-background text-foreground text-sm">
      {/* Cabeçalho */}
      <div className="border-b-2 border-foreground pb-3 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-base font-bold text-foreground">{data.enteNome}</h1>
            <p className="text-xs text-muted-foreground">{data.secretaria}</p>
            <p className="text-xs text-muted-foreground">{data.departamento}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <Image
              src="/images/brasao-lagoa-santa.png"
              alt="Brasão"
              width={64}
              height={64}
              className="object-contain grayscale"
            />
          </div>
        </div>
      </div>

      {/* Identificação */}
      <div className="bg-foreground text-background p-3 rounded-md mb-4">
        <h2 className="text-sm font-bold tracking-wide">RELATÓRIO DE PESQUISA DE PREÇOS</h2>
        <p className="text-xs opacity-80 italic">Levantamento referencial de valores para planejamento e instrução processual</p>
        <div className="mt-1">
          <span className="inline-block bg-background/20 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
            Documento informativo — sem validade legal
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3 pt-2 border-t border-background/20">
          <div className="text-center">
            <p className="text-[10px] uppercase opacity-70">Nº Relatório</p>
            <p className="text-xs font-bold">{data.docNumero}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase opacity-70">Processo / Ref.</p>
            <p className="text-xs font-bold">{data.processoReferencia}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase opacity-70">Versão</p>
            <p className="text-xs font-bold">{data.versao}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase opacity-70">Data</p>
            <p className="text-xs font-bold">{data.data}</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 border-l-4 border-l-amber-500 p-3 mb-4 text-[10px] text-amber-900 dark:text-amber-200">
        <strong>Natureza do documento:</strong> Este relatório tem caráter exclusivamente informativo e referencial. Não substitui a pesquisa de preços formal exigida pela IN SEGES/ME nº 65/2021. Pode ser utilizado como subsídio para elaboração do PCA, estimativa de compras futuras e instrução de processos no ATA360.
      </div>

      {/* Fundamentação */}
      <div className="bg-muted border-l-4 border-foreground p-3 mb-4 text-xs">
        <p className="font-bold text-foreground uppercase text-[10px] mb-2">Base Normativa de Referência</p>
        <p className="text-muted-foreground"><strong>Lei 14.133/2021:</strong> Art. 23 (estimativa do valor da contratação)</p>
        <p className="text-muted-foreground"><strong>IN SEGES/ME 65/2021:</strong> Arts. 5º a 7º (parâmetros de pesquisa)</p>
        <p className="text-muted-foreground"><strong>Decreto 10.947/2022:</strong> Art. 17 (metodologia)</p>
      </div>

      {/* Rastreabilidade */}
      <div className="flex justify-between items-start border border-border p-3 mb-4 text-[10px]">
        <div className="flex-1 text-muted-foreground leading-relaxed">
          <strong className="text-foreground">ID:</strong> {data.rastreabilidadeId}<br />
          <strong className="text-foreground">Hash:</strong> {data.hashDocumento}<br />
          <strong className="text-foreground">Gerado em:</strong> {data.dataGeracao} às {data.horaGeracao}<br />
          <strong className="text-foreground">Elaborado por:</strong> {data.elaboradorNome} — {data.elaboradorSetor}<br />
          <strong className="text-foreground">Fontes:</strong> PNCP | Compras.gov.br | Banco de Preços | Fornecedores
        </div>
        <div className="w-16 h-16 border border-dashed border-muted-foreground/30 flex items-center justify-center text-[8px] text-muted-foreground ml-3">
          [QR CODE]<br />Verificação
        </div>
      </div>

      {/* Seção 1: Objeto e Finalidade */}
      <Section numero={1} titulo="OBJETO E FINALIDADE" fundamento="Contextualização do levantamento">
        <Campo label="Descrição do Objeto" valor={data.objetoDescricao} isEditing={isEditing} onEdit={(v) => handleFieldChange("objetoDescricao", v)} multiline />
        <Campo label="Finalidade do Relatório" valor={data.finalidade} isEditing={isEditing} onEdit={(v) => handleFieldChange("finalidade", v)} multiline className="mt-3" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground mb-1">Tipo</p>
            <div className="flex flex-wrap gap-2">
              {(["material", "servico", "misto"] as const).map((t) => (
                <span
                  key={t}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded",
                    data.tipoObjeto === t ? "bg-foreground text-background font-bold" : "bg-muted text-muted-foreground"
                  )}
                >
                  {getTipoLabel(t)}
                </span>
              ))}
            </div>
          </div>
          <Campo label="Área Demandante" valor={data.areaDemandante} isEditing={isEditing} onEdit={(v) => handleFieldChange("areaDemandante", v)} />
        </div>
      </Section>

      {/* Seção 2: Itens Pesquisados */}
      <Section numero={2} titulo="ITENS PESQUISADOS" fundamento="Dados coletados de fontes oficiais — campos editáveis com borda tracejada">
        <div className="overflow-x-auto">
          <table className="w-full text-[9px] border-collapse">
            <thead>
              <tr className="bg-foreground text-background">
                <th className="p-1.5 text-center w-6">Nº</th>
                <th className="p-1.5 text-center">CATMAT/<br/>CATSERV</th>
                <th className="p-1.5 text-center">PDM</th>
                <th className="p-1.5 text-left">Descrição Resumida</th>
                <th className="p-1.5 text-left">Fonte / Link</th>
                <th className="p-1.5 text-center">Embal.</th>
                <th className="p-1.5 text-right">Preço Unit.</th>
                <th className="p-1.5 text-center">Qtd.</th>
                <th className="p-1.5 text-right">Subtotal</th>
                {isEditing && <th className="p-1.5 text-center w-8">Ação</th>}
              </tr>
            </thead>
            <tbody>
              {data.itens.map((item, index) => (
                <tr key={item.numero} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                  <td className="p-1.5 border-b border-border text-center font-bold">{item.numero}</td>
                  <td className="p-1.5 border-b border-border text-center font-mono text-[8px]">
                    {item.catmat}
                    {item.catserv && <><br />{item.catserv}</>}
                  </td>
                  <td className="p-1.5 border-b border-border text-center font-mono text-[8px]">{item.pdm}</td>
                  <td className="p-1.5 border-b border-border text-left max-w-[140px]">{item.descricao}</td>
                  <td className="p-1.5 border-b border-border text-left max-w-[120px]">
                    <span className="text-[8px] font-semibold">{item.fonteNome}</span>
                    <br />
                    <span className="text-[7px] text-blue-600 dark:text-blue-400 break-all">{item.fonteLink}</span>
                  </td>
                  <td className="p-1.5 border-b border-border text-center">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.embalagem}
                        onChange={(e) => handleItemChange(index, "embalagem", e.target.value)}
                        className="w-14 bg-blue-50 dark:bg-blue-950/30 border border-dashed border-blue-400 rounded p-0.5 text-[9px] text-center"
                      />
                    ) : (
                      <span className="bg-muted px-1 py-0.5 rounded text-[8px]">{item.embalagem}</span>
                    )}
                  </td>
                  <td className="p-1.5 border-b border-border text-right font-semibold">
                    {formatCurrency(item.precoUnitario)}
                  </td>
                  <td className="p-1.5 border-b border-border text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        value={item.quantidade}
                        onChange={(e) => handleItemChange(index, "quantidade", parseInt(e.target.value) || 0)}
                        className="w-12 bg-blue-50 dark:bg-blue-950/30 border border-dashed border-blue-400 rounded p-0.5 text-[9px] text-center"
                        min={0}
                      />
                    ) : (
                      <span className="font-bold">{item.quantidade}</span>
                    )}
                  </td>
                  <td className="p-1.5 border-b border-border text-right font-bold">
                    {formatCurrency(item.precoUnitario * item.quantidade)}
                  </td>
                  {isEditing && (
                    <td className="p-1.5 border-b border-border text-center">
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-destructive hover:text-destructive/80 text-[8px] uppercase font-bold"
                      >
                        Excluir
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              <tr className="bg-foreground text-background font-bold">
                <td colSpan={isEditing ? 6 : 5} className="p-2 text-right text-[10px] uppercase">
                  Valor Total Estimado
                </td>
                <td className="p-2 text-center text-[9px]">{data.itens.length} itens</td>
                <td className="p-2" />
                <td className="p-2 text-right text-xs">{formatCurrency(valorTotal)}</td>
                {isEditing && <td />}
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Seção 3: Resumo Estatístico */}
      <Section numero={3} titulo="RESUMO ESTATÍSTICO" fundamento="Síntese dos valores apurados">
        <div className="grid grid-cols-4 gap-2 mb-3">
          <StatCard label="Total de Itens" value={String(data.itens.length)} detail="pesquisados" />
          <StatCard label="Menor Preço Unit." value={formatCurrency(menorPreco)} detail={data.itens.find((i) => i.precoUnitario === menorPreco)?.descricao?.slice(0, 25) || ""} />
          <StatCard label="Maior Preço Unit." value={formatCurrency(maiorPreco)} detail={data.itens.find((i) => i.precoUnitario === maiorPreco)?.descricao?.slice(0, 25) || ""} />
          <StatCard label="Valor Total" value={formatCurrency(valorTotal)} detail="com quantidades solicitadas" highlight />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Campo label="Preço Médio Unitário" valor={formatCurrency(precoMedio)} />
          <Campo label="Mediana" valor={formatCurrency(mediana)} />
          <Campo label="Coeficiente de Variação" valor={`${coefVariacao}%`} />
        </div>
      </Section>

      {/* Seção 4: Origem dos Dados */}
      <Section numero={4} titulo="ORIGEM DOS DADOS E METODOLOGIA" fundamento="Fontes oficiais consultadas">
        <div className="bg-muted border border-border rounded p-3 mb-3">
          <p className="text-[10px] font-bold text-foreground mb-2 uppercase">Fontes Oficiais Utilizadas</p>
          <div className="space-y-1 text-[10px] text-muted-foreground">
            <OrigemItem label="PNCP" desc="Portal Nacional de Contratações Públicas (pncp.gov.br)" />
            <OrigemItem label="Compras.gov.br" desc="Sistema de Compras do Governo Federal" />
            <OrigemItem label="Banco de Preços" desc="Base de dados de preços praticados" />
            <OrigemItem label="CATMAT / CATSERV" desc="Catálogos oficiais de materiais e serviços" />
            <OrigemItem label="PDM" desc="Padrão Descritivo de Material do Governo Federal" />
          </div>
        </div>
        <Campo label="Metodologia Aplicada" valor={data.metodologia} isEditing={isEditing} onEdit={(v) => handleFieldChange("metodologia", v)} multiline />
        <Campo label="Período de Referência dos Preços" valor={data.periodoReferencia} isEditing={isEditing} onEdit={(v) => handleFieldChange("periodoReferencia", v)} className="mt-3" />
      </Section>

      {/* Seção 5: Observação Final */}
      <Section numero={5} titulo="OBSERVAÇÃO FINAL" fundamento="Considerações, ressalvas e recomendações do elaborador">
        <div className="bg-muted border border-border border-l-4 border-l-blue-500 p-3 mb-3">
          <p className="text-[10px] font-bold text-foreground mb-2 uppercase">Observações e Recomendações</p>
          {isEditing ? (
            <textarea
              value={data.observacaoFinal}
              onChange={(e) => handleFieldChange("observacaoFinal", e.target.value)}
              className="w-full bg-blue-50 dark:bg-blue-950/30 border border-dashed border-blue-400 rounded p-2 text-xs min-h-[80px] resize-y focus:outline-none"
            />
          ) : (
            <div className="text-xs text-muted-foreground leading-relaxed">{data.observacaoFinal}</div>
          )}
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-2 text-[10px] text-blue-800 dark:text-blue-200">
          <strong>Nota:</strong> Este relatório foi gerado com dados de fontes oficiais e serve como referência para planejamento. Para fins de instrução processual formal, recomenda-se a elaboração da Pesquisa de Preços (PP) conforme IN SEGES/ME nº 65/2021.
        </div>
      </Section>

      {/* Elaborador */}
      <div className="bg-muted border border-border p-3 mb-4">
        <p className="text-[10px] font-bold text-foreground uppercase mb-2">Responsável pela Elaboração</p>
        <div className="flex gap-4 text-[10px] text-muted-foreground">
          <span><strong>Nome:</strong> {data.elaboradorNome}</span>
          <span><strong>Setor:</strong> {data.elaboradorSetor}</span>
          <span><strong>Data:</strong> {data.data}</span>
        </div>
        <p className="text-[9px] text-muted-foreground/70 mt-2 italic">
          Este documento não requer assinatura formal. Destina-se a uso interno como subsídio para planejamento de contratações.
        </p>
      </div>

      {/* Selo ATA360 */}
      <div className="text-center pt-3 border-t border-border">
        <p className="text-[9px] text-muted-foreground">
          2026 Powered by <strong>ATA360</strong> - Sistema de Inteligência em Contratações Públicas
        </p>
      </div>
    </div>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────────────────────

function Section({ numero, titulo, fundamento, children }: { numero: number; titulo: string; fundamento: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="flex items-stretch mb-2">
        <div className="bg-foreground text-background w-7 min-h-[28px] flex items-center justify-center font-bold text-sm">{numero}</div>
        <div className="flex-1 border-b-2 border-foreground pl-2 flex flex-col justify-center">
          <p className="text-xs font-bold text-foreground uppercase">{titulo}</p>
          <p className="text-[9px] text-muted-foreground italic">{fundamento}</p>
        </div>
      </div>
      <div className="pl-9 border-l-2 border-border ml-3.5">{children}</div>
    </div>
  );
}

function Campo({ label, valor, className, isEditing, onEdit, multiline }: { label: string; valor: string; className?: string; isEditing?: boolean; onEdit?: (value: string) => void; multiline?: boolean }) {
  return (
    <div className={className}>
      <p className="text-[10px] font-bold text-muted-foreground mb-1">{label}</p>
      {isEditing && onEdit ? (
        multiline ? (
          <textarea value={valor} onChange={(e) => onEdit(e.target.value)} className="w-full bg-background border-2 border-blue-400 rounded p-2 text-xs min-h-[60px] resize-y focus:outline-none focus:border-blue-500" />
        ) : (
          <input type="text" value={valor} onChange={(e) => onEdit(e.target.value)} className="w-full bg-background border-2 border-blue-400 rounded p-2 text-xs focus:outline-none focus:border-blue-500" />
        )
      ) : (
        <div className="bg-muted border border-border rounded p-2 text-xs">{valor}</div>
      )}
    </div>
  );
}

function StatCard({ label, value, detail, highlight }: { label: string; value: string; detail: string; highlight?: boolean }) {
  return (
    <div className={cn("border border-border rounded p-2 text-center", highlight ? "bg-green-50 dark:bg-green-950/20 border-green-300" : "bg-muted")}>
      <p className="text-[8px] uppercase text-muted-foreground tracking-wide">{label}</p>
      <p className={cn("text-xs font-bold mt-1", highlight ? "text-green-700 dark:text-green-400" : "text-foreground")}>{value}</p>
      <p className="text-[8px] text-muted-foreground mt-0.5 truncate">{detail}</p>
    </div>
  );
}

function OrigemItem({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-green-600 font-bold shrink-0">&#10003;</span>
      <span><strong className="text-foreground">{label}</strong> — {desc}</span>
    </div>
  );
}
