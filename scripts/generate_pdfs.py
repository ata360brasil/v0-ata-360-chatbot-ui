#!/usr/bin/env python3
"""
Gera versões PDF de todos os templates HTML v8 usando WeasyPrint.
Saída: templates/pdf/<categoria>/<nome>.pdf
"""

import os
import sys
from pathlib import Path

try:
    from weasyprint import HTML
except ImportError:
    print("Erro: instale weasyprint → pip install weasyprint")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent / "templates"
PDF_ROOT = ROOT / "pdf"

def find_v8_templates():
    """Encontra todos os templates v8 HTML."""
    templates = []
    for html_file in sorted(ROOT.rglob("*_v8.html")):
        # Skip the base template
        if html_file.name == "documento_base_v8.html":
            continue
        rel = html_file.relative_to(ROOT)
        templates.append((html_file, rel))
    return templates

def convert_to_pdf(html_path: Path, rel_path: Path):
    """Converte um HTML para PDF."""
    # Determine output path
    pdf_rel = rel_path.with_suffix(".pdf")
    pdf_path = PDF_ROOT / pdf_rel
    pdf_path.parent.mkdir(parents=True, exist_ok=True)

    html = HTML(filename=str(html_path))
    html.write_pdf(str(pdf_path))
    return pdf_path

def main():
    templates = find_v8_templates()
    print(f"Encontrados {len(templates)} templates v8 para converter.\n")

    success = 0
    errors = []

    for html_path, rel_path in templates:
        name = rel_path.stem.replace("_template_v8", "")
        cat = rel_path.parent.name or "root"
        print(f"  [{cat}] {name}...", end=" ", flush=True)
        try:
            pdf_path = convert_to_pdf(html_path, rel_path)
            size_kb = pdf_path.stat().st_size / 1024
            print(f"OK ({size_kb:.1f} KB)")
            success += 1
        except Exception as e:
            print(f"ERRO: {e}")
            errors.append((rel_path, str(e)))

    print(f"\n{'='*50}")
    print(f"Convertidos: {success}/{len(templates)}")
    if errors:
        print(f"Erros: {len(errors)}")
        for path, err in errors:
            print(f"  - {path}: {err}")

    return 0 if not errors else 1

if __name__ == "__main__":
    sys.exit(main())
