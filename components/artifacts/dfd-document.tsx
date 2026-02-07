"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";

// Tipo para os dados do DFD
export interface DFDData {
  // Identificacao
  docNumero: string;
  processoNumero: string;
  versao: string;
  data: string;
  // Ente
  enteNome: string;
  secretaria: string;
  departamento: string;
  // Demandante
  unidadeRequisitante: string;
  responsavelNome: string;
  responsavelCargo: string;
  responsavelMatricula: string;
  responsavelEmail: string;
  // Objeto
  objetoDescricao: string;
  natureza: "material" | "servico" | "engenharia" | "tic" | "saude";
  enquadramento: "comum" | "especial" | "exclusivo_meepp";
  // Justificativa
  necessidade: string;
  interessePublico: string;
  consequenciasNaoContratacao: string;
  // Itens
  itens: Array<{
    item: number;
    descricao: string;
    catmat?: string;
    unidade: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  }>;
  valorTotalEstimado: number;
  fonteEstimativa: string;
  metodologiaCalculo: string;
  // Prazo e Planejamento
  prazoDesejado: string;
  prioridade: "critico" | "alto" | "medio" | "baixo";
  vinculacaoPCA: string;
  fonteRecursos: string;
  dotacaoOrcamentaria: string;
  // Assinaturas
  elaboracaoNome: string;
  elaboracaoCargo: string;
  elaboracaoMatricula: string;
  validacaoNome: string;
  validacaoCargo: string;
  validacaoMatricula: string;
}

interface DFDDocumentProps {
  data: DFDData;
  isEditing?: boolean;
  onDataChange?: (data: DFDData) => void;
}

export function DFDDocument({ data: initialData, isEditing = false, onDataChange }: DFDDocumentProps) {
  const [data, setData] = useState<DFDData>(initialData);

  const handleFieldChange = (field: keyof DFDData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onDataChange?.(newData);
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItens = [...data.itens];
    newItens[index] = { ...newItens[index], [field]: value };
    
    // Recalcular valor total do item
    if (field === "quantidade" || field === "valorUnitario") {
      newItens[index].valorTotal = newItens[index].quantidade * newItens[index].valorUnitario;
    }
    
    // Recalcular valor total estimado
    const newValorTotal = newItens.reduce((sum, item) => sum + item.valorTotal, 0);
    
    const newData = { ...data, itens: newItens, valorTotalEstimado: newValorTotal };
    setData(newData);
    onDataChange?.(newData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getNaturezaLabel = (natureza: string) => {
    const labels: Record<string, string> = {
      material: "Material",
      servico: "Servico",
      engenharia: "Engenharia",
      tic: "TIC",
      saude: "Saude",
    };
    return labels[natureza] || natureza;
  };

  const getEnquadramentoLabel = (enquadramento: string) => {
    const labels: Record<string, string> = {
      comum: "Comum",
      especial: "Especial",
      exclusivo_meepp: "Exclusivo ME/EPP (LC 123/2006)",
    };
    return labels[enquadramento] || enquadramento;
  };

  const getPrioridadeLabel = (prioridade: string) => {
    const labels: Record<string, string> = {
      critico: "Critico",
      alto: "Alto",
      medio: "Medio",
      baixo: "Baixo",
    };
    return labels[prioridade] || prioridade;
  };

  return (
    <div className="bg-background text-foreground text-sm">
      {/* Cabecalho */}
      <div className="border-b-2 border-foreground pb-3 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-base font-bold text-foreground">{data.enteNome}</h1>
            <p className="text-xs text-muted-foreground">{data.secretaria}</p>
            <p className="text-xs text-muted-foreground">{data.departamento}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <img 
              src="/images/brasao-lagoa-santa.png" 
              alt="Brasao Prefeitura de Lagoa Santa" 
              className="w-16 h-16 object-contain grayscale"
            />
          </div>
        </div>
      </div>

      {/* Identificacao do Documento */}
      <div className="bg-foreground text-background p-3 rounded-md mb-4">
        <h2 className="text-sm font-bold tracking-wide">DOCUMENTO DE FORMALIZACAO DA DEMANDA</h2>
        <p className="text-xs opacity-80 italic">Fase preparatoria da contratacao publica</p>
        <div className="grid grid-cols-4 gap-2 mt-3 pt-2 border-t border-background/20">
          <div className="text-center">
            <p className="text-[10px] uppercase opacity-70">N Documento</p>
            <p className="text-xs font-bold">{data.docNumero}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase opacity-70">Processo</p>
            <p className="text-xs font-bold">{data.processoNumero}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase opacity-70">Versao</p>
            <p className="text-xs font-bold">{data.versao}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase opacity-70">Data</p>
            <p className="text-xs font-bold">{data.data}</p>
          </div>
        </div>
      </div>

      {/* Fundamentacao Legal */}
      <div className="bg-muted border-l-4 border-foreground p-3 mb-4 text-xs">
        <p className="font-bold text-foreground uppercase text-[10px] mb-2">Fundamentacao Legal</p>
        <p className="text-muted-foreground">
          <strong>Lei 14.133/2021:</strong> Art. 5 (Principios) | Art. 11 (Objetivos) | Art. 18, I (Fase Preparatoria) | Art. 72 (Contratacao)
        </p>
        <p className="text-muted-foreground">
          <strong>Decreto 10.947/2022:</strong> Art. 7 (DFD obrigatorio para contratacoes)
        </p>
        <p className="text-muted-foreground">
          <strong>IN SEGES/ME 58/2022:</strong> Art. 5 (Conteudo do DFD)
        </p>
      </div>

      {/* Secao 1 - Identificacao da Demanda */}
      <Section numero={1} titulo="IDENTIFICACAO DA DEMANDA" fundamento="Art. 7, I a III, Decreto 10.947/2022">
        <div className="grid grid-cols-2 gap-3">
          <Campo 
            label="Unidade Requisitante" 
            valor={data.unidadeRequisitante} 
            isEditing={isEditing}
            onEdit={(v) => handleFieldChange("unidadeRequisitante", v)}
          />
          <Campo 
            label="Responsavel pela Demanda" 
            valor={data.responsavelNome} 
            isEditing={isEditing}
            onEdit={(v) => handleFieldChange("responsavelNome", v)}
          />
          <Campo 
            label="Cargo/Funcao" 
            valor={data.responsavelCargo} 
            isEditing={isEditing}
            onEdit={(v) => handleFieldChange("responsavelCargo", v)}
          />
          <Campo 
            label="Matricula" 
            valor={data.responsavelMatricula} 
            isEditing={isEditing}
            onEdit={(v) => handleFieldChange("responsavelMatricula", v)}
          />
          <Campo 
            label="Contato" 
            valor={data.responsavelEmail} 
            className="col-span-2" 
            isEditing={isEditing}
            onEdit={(v) => handleFieldChange("responsavelEmail", v)}
          />
        </div>
      </Section>

      {/* Secao 2 - Objeto da Contratacao */}
      <Section numero={2} titulo="OBJETO DA CONTRATACAO" fundamento="Art. 6, XXIII, Lei 14.133/2021">
        <Campo 
          label="Descricao do Objeto" 
          valor={data.objetoDescricao}
          isEditing={isEditing}
          onEdit={(v) => handleFieldChange("objetoDescricao", v)}
          multiline
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground mb-1">Natureza</p>
            <div className="flex flex-wrap gap-2">
              {["material", "servico", "engenharia", "tic", "saude"].map((n) => (
                <span
                  key={n}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded",
                    data.natureza === n
                      ? "bg-foreground text-background font-bold"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {getNaturezaLabel(n)}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground mb-1">Enquadramento</p>
            <div className="flex flex-wrap gap-2">
              {["comum", "especial", "exclusivo_meepp"].map((e) => (
                <span
                  key={e}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded",
                    data.enquadramento === e
                      ? "bg-foreground text-background font-bold"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {getEnquadramentoLabel(e)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Secao 3 - Justificativa da Necessidade */}
      <Section numero={3} titulo="JUSTIFICATIVA DA NECESSIDADE" fundamento="Art. 18, I, Lei 14.133/2021">
        <div className="bg-muted/50 border-l-2 border-muted-foreground p-2 mb-3 text-[10px] text-muted-foreground italic">
          <strong>Nota TCU - Acordao 2.622/2015-P:</strong> A justificativa deve demonstrar a real necessidade, separando claramente o problema (necessidade) da solucao proposta (objeto).
        </div>
        <Campo 
          label="Necessidade (o problema a ser resolvido)" 
          valor={data.necessidade}
          isEditing={isEditing}
          onEdit={(v) => handleFieldChange("necessidade", v)}
          multiline
        />
        <Campo 
          label="Interesse Publico (por que resolver)" 
          valor={data.interessePublico} 
          className="mt-3"
          isEditing={isEditing}
          onEdit={(v) => handleFieldChange("interessePublico", v)}
          multiline
        />
        <Campo 
          label="Consequencias da Nao Contratacao" 
          valor={data.consequenciasNaoContratacao} 
          className="mt-3"
          isEditing={isEditing}
          onEdit={(v) => handleFieldChange("consequenciasNaoContratacao", v)}
          multiline
        />
      </Section>

      {/* Secao 4 - Quantitativos e Estimativa de Valor */}
      <Section numero={4} titulo="QUANTITATIVOS E ESTIMATIVA DE VALOR" fundamento="Art. 18, II e III, Lei 14.133/2021">
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="bg-foreground text-background">
                <th className="p-2 text-left">ITEM</th>
                <th className="p-2 text-left">DESCRICAO</th>
                <th className="p-2 text-center">CATMAT</th>
                <th className="p-2 text-center">UND</th>
                <th className="p-2 text-center">QTDE</th>
                <th className="p-2 text-right">VALOR UNIT.</th>
                <th className="p-2 text-right">VALOR TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.itens.map((item, index) => (
                <tr key={item.item} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                  <td className="p-2 border-b border-border">{item.item}</td>
                  <td className="p-2 border-b border-border">{item.descricao}</td>
                  <td className="p-2 border-b border-border text-center">{item.catmat || "-"}</td>
                  <td className="p-2 border-b border-border text-center">{item.unidade}</td>
                  <td className="p-2 border-b border-border text-center">{item.quantidade}</td>
                  <td className="p-2 border-b border-border text-right">{formatCurrency(item.valorUnitario)}</td>
                  <td className="p-2 border-b border-border text-right">{formatCurrency(item.valorTotal)}</td>
                </tr>
              ))}
              <tr className="bg-foreground text-background font-bold">
                <td colSpan={6} className="p-2 text-right">VALOR TOTAL ESTIMADO</td>
                <td className="p-2 text-right">{formatCurrency(data.valorTotalEstimado)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Campo 
            label="Fonte da Estimativa" 
            valor={data.fonteEstimativa}
            isEditing={isEditing}
            onEdit={(v) => handleFieldChange("fonteEstimativa", v)}
          />
          <Campo 
            label="Metodologia de Calculo" 
            valor={data.metodologiaCalculo}
            isEditing={isEditing}
            onEdit={(v) => handleFieldChange("metodologiaCalculo", v)}
          />
        </div>
      </Section>

      {/* Secao 5 - Prazo e Vinculacao ao Planejamento */}
      <Section numero={5} titulo="PRAZO E VINCULACAO AO PLANEJAMENTO" fundamento="Art. 18, VII, Lei 14.133/2021">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground mb-1">Prazo Desejado</p>
            <div className="flex flex-wrap gap-2">
              {["Imediato", "15 dias", "30 dias", "60 dias", "90 dias"].map((p) => (
                <span
                  key={p}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded",
                    data.prazoDesejado === p
                      ? "bg-foreground text-background font-bold"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground mb-1">Grau de Prioridade</p>
            <div className="flex flex-wrap gap-2">
              {["critico", "alto", "medio", "baixo"].map((p) => (
                <span
                  key={p}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded",
                    data.prioridade === p
                      ? "bg-foreground text-background font-bold"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {getPrioridadeLabel(p)}
                </span>
              ))}
            </div>
          </div>
          <Campo 
            label="Vinculacao ao PCA" 
            valor={data.vinculacaoPCA}
            isEditing={isEditing}
            onEdit={(v) => handleFieldChange("vinculacaoPCA", v)}
          />
          <Campo 
            label="Fonte de Recursos" 
            valor={data.fonteRecursos}
            isEditing={isEditing}
            onEdit={(v) => handleFieldChange("fonteRecursos", v)}
          />
          <Campo 
            label="Dotação Orçamentária" 
            valor={data.dotacaoOrcamentaria} 
            className="col-span-2"
            isEditing={isEditing}
            onEdit={(v) => handleFieldChange("dotacaoOrcamentaria", v)}
          />
        </div>
      </Section>

      {/* Checklist de Conformidade */}
      <div className="bg-muted border border-border rounded-md p-3 mb-4">
        <p className="font-bold text-foreground text-xs mb-3 pb-2 border-b border-border">
          Checklist de Conformidade do DFD
        </p>
        <div className="space-y-1.5 text-[10px]">
          <ChecklistItem ok text="Unidade requisitante e responsavel identificados (Art. 7, I, Dec. 10.947/2022)" />
          <ChecklistItem ok text="Objeto descrito de forma clara e objetiva (Art. 6, XXIII, Lei 14.133/2021)" />
          <ChecklistItem ok text="Justificativa da necessidade fundamentada (Art. 18, I, Lei 14.133/2021)" />
          <ChecklistItem ok text="Quantitativos estimados com metodologia (Art. 18, II, Lei 14.133/2021)" />
          <ChecklistItem ok text="Valor estimado com base em pesquisa (Art. 18, III, Lei 14.133/2021)" />
          <ChecklistItem ok text="Vinculacao ao PCA verificada (Art. 18, VII, Lei 14.133/2021)" />
          <ChecklistItem ok text="Dotacao orcamentaria indicada (Art. 72, VI, Lei 14.133/2021)" />
          <ChecklistItem pendente text="Aguardando assinatura digital ICP-Brasil" />
        </div>
      </div>

      {/* Declaracoes */}
      <div className="bg-muted border border-border p-3 mb-4 text-[10px]">
        <p className="font-bold text-foreground mb-2">Declaracoes e Termo de Aceite</p>
        <p className="text-muted-foreground mb-2">O(s) signatario(s), na qualidade de agente(s) publico(s), DECLARA(M) que:</p>
        <div className="space-y-1 text-muted-foreground">
          <p><strong>I.</strong> As informacoes prestadas sao verdadeiras e refletem a real necessidade da Administracao;</p>
          <p><strong>II.</strong> Este documento foi elaborado em observancia aos principios da legalidade, impessoalidade, moralidade e eficiencia;</p>
          <p><strong>III.</strong> Nao possuo conflito de interesses nem vinculo com potenciais fornecedores;</p>
          <p><strong>IV.</strong> Tenho ciencia dos deveres funcionais e das responsabilidades inerentes a minha atuacao;</p>
          <p><strong>V.</strong> Este documento foi elaborado com auxilio de ferramenta tecnologica, cabendo ao signatario a validacao do conteudo;</p>
          <p><strong>VI.</strong> Aceito as condicoes declaradas e autorizo o prosseguimento do processo.</p>
        </div>
        <p className="text-muted-foreground/70 mt-2 italic">Base legal: CF/88, Art. 37 | Lei 14.133/2021 | Dec. 10.947/2022 | Lei 12.813/2013</p>
      </div>

      {/* Assinaturas */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border border-border p-3 text-center">
          <p className="text-[10px] font-bold text-foreground uppercase mb-6">ELABORACAO</p>
          <div className="border-t border-foreground pt-2 mx-4">
            <p className="text-xs">{data.elaboracaoNome}</p>
            <p className="text-[10px] text-muted-foreground">{data.elaboracaoCargo} | Mat. {data.elaboracaoMatricula}</p>
            <p className="text-[10px] text-muted-foreground">Assinatura ICP-Brasil</p>
          </div>
        </div>
        <div className="border border-border p-3 text-center">
          <p className="text-[10px] font-bold text-foreground uppercase mb-6">VALIDACAO / AUTORIDADE</p>
          <div className="border-t border-foreground pt-2 mx-4">
            <p className="text-xs">{data.validacaoNome}</p>
            <p className="text-[10px] text-muted-foreground">{data.validacaoCargo} | Mat. {data.validacaoMatricula}</p>
            <p className="text-[10px] text-muted-foreground">Assinatura ICP-Brasil</p>
          </div>
        </div>
      </div>

      {/* Controle de Versoes */}
      <div className="text-[9px] text-muted-foreground border-t border-border pt-2 mb-4">
        <p className="font-bold text-foreground mb-1">Controle de Versoes</p>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pr-2">Versao</th>
              <th className="pr-2">Data</th>
              <th className="pr-2">Autor</th>
              <th>Modificacoes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.versao}</td>
              <td>{data.data}</td>
              <td>{data.elaboracaoNome}</td>
              <td>Versao inicial do documento</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Trilha da Contratacao */}
      <div className="bg-foreground text-background p-3 rounded-md mb-4">
        <p className="text-[10px] font-bold text-center uppercase tracking-wider mb-3">
          TRILHA DA CONTRATACAO PUBLICA
        </p>
        <div className="flex justify-between items-center text-[8px]">
          <TrilhaEtapa codigo="PCA" concluida />
          <TrilhaEtapa codigo="DFD" atual />
          <TrilhaEtapa codigo="ETP" />
          <TrilhaEtapa codigo="PP" />
          <TrilhaEtapa codigo="TR" />
          <TrilhaEtapa codigo="MR" />
          <TrilhaEtapa codigo="LIC" />
          <TrilhaEtapa codigo="CTR" />
          <TrilhaEtapa codigo="EXE" />
          <TrilhaEtapa codigo="AVA" />
        </div>
      </div>

      {/* Selo ATA360 */}
      <div className="text-center pt-3 border-t border-border">
        <p className="text-[9px] text-muted-foreground">
          2026 Powered by <strong>ATA360</strong> - Sistema de Inteligencia em Contratacoes Publicas
        </p>
      </div>
    </div>
  );
}

// Componentes auxiliares
function Section({
  numero,
  titulo,
  fundamento,
  children,
}: {
  numero: number;
  titulo: string;
  fundamento: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-stretch mb-2">
        <div className="bg-foreground text-background w-7 min-h-[28px] flex items-center justify-center font-bold text-sm">
          {numero}
        </div>
        <div className="flex-1 border-b-2 border-foreground pl-2 flex flex-col justify-center">
          <p className="text-xs font-bold text-foreground uppercase">{titulo}</p>
          <p className="text-[9px] text-muted-foreground italic">{fundamento}</p>
        </div>
      </div>
      <div className="pl-9 border-l-2 border-border ml-3.5">{children}</div>
    </div>
  );
}

function Campo({
  label,
  valor,
  className,
  isEditing,
  onEdit,
  multiline,
}: {
  label: string;
  valor: string;
  className?: string;
  isEditing?: boolean;
  onEdit?: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] font-bold text-muted-foreground mb-1">{label}</p>
      {isEditing && onEdit ? (
        multiline ? (
          <textarea
            value={valor}
            onChange={(e) => onEdit(e.target.value)}
            className="w-full bg-background border-2 border-blue-400 rounded p-2 text-xs min-h-[60px] resize-y focus:outline-none focus:border-blue-500"
          />
        ) : (
          <input
            type="text"
            value={valor}
            onChange={(e) => onEdit(e.target.value)}
            className="w-full bg-background border-2 border-blue-400 rounded p-2 text-xs focus:outline-none focus:border-blue-500"
          />
        )
      ) : (
        <div className="bg-muted border border-border rounded p-2 text-xs">{valor}</div>
      )}
    </div>
  );
}

function ChecklistItem({
  ok,
  pendente,
  text,
}: {
  ok?: boolean;
  pendente?: boolean;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div
        className={cn(
          "w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[8px] shrink-0 mt-0.5",
          ok && "bg-green-600 text-white",
          pendente && "bg-yellow-500 text-white",
          !ok && !pendente && "border border-muted-foreground"
        )}
      >
        {ok && "✓"}
        {pendente && "!"}
      </div>
      <span className="text-muted-foreground">{text}</span>
    </div>
  );
}

function TrilhaEtapa({
  codigo,
  concluida,
  atual,
}: {
  codigo: string;
  concluida?: boolean;
  atual?: boolean;
}) {
  return (
    <div className={cn("text-center", !concluida && !atual && "opacity-50")}>
      <div
        className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center mx-auto mb-1 text-[8px]",
          concluida && "bg-green-500",
          atual && "bg-yellow-400 text-foreground",
          !concluida && !atual && "bg-background/20"
        )}
      >
        {concluida && "✓"}
        {atual && "●"}
        {!concluida && !atual && "○"}
      </div>
      <span className={cn(atual && "font-bold")}>{codigo}</span>
    </div>
  );
}
