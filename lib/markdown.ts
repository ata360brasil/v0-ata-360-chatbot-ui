/**
 * Markdown Renderer — remark/rehype pipeline
 *
 * Substitui o parsing com regex por pipeline robusto:
 * remark-parse → remark-rehype → rehype-sanitize → rehype-stringify
 *
 * Sanitiza HTML por padrao (XSS safe).
 */

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeStringify)

export async function renderMarkdown(markdown: string): Promise<string> {
  const result = await processor.process(markdown)
  return String(result)
}

/**
 * Synchronous version for build-time rendering (generateStaticParams).
 * Usa processSync que bloqueia — OK para SSG/ISR.
 */
export function renderMarkdownSync(markdown: string): string {
  const result = processor.processSync(markdown)
  return String(result)
}
