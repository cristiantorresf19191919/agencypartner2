"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { HighlightedCode } from "./HighlightedCode";

/**
 * Renders a markdown string (question answer) into styled React nodes.
 * Fenced code blocks are highlighted with the project's HighlightedCode.
 * GFM extensions (tables, strikethrough, task lists) are enabled.
 * Raw HTML in the source (e.g. <details><summary>) is preserved via rehype-raw.
 */
export function MarkdownAnswer({ children }: { children: string }) {
  return (
    <div className="markdown-answer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ inline, className, children: kids, ...props }: any) {
            const match = /language-([\w-]+)/.exec(className ?? "");
            const raw = String(kids ?? "").replace(/\n$/, "");
            if (inline) {
              return (
                <code
                  style={{
                    background: "rgba(124, 244, 255, 0.08)",
                    border: "1px solid rgba(124, 244, 255, 0.18)",
                    borderRadius: 4,
                    padding: "1px 6px",
                    fontSize: "0.9em",
                    color: "#a7f3ff",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
                  }}
                  {...props}
                >
                  {kids}
                </code>
              );
            }
            const lang = (match?.[1] ?? "tsx").split(/\s+/)[0];
            return (
              <HighlightedCode
                code={raw}
                language={lang}
                style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(124, 244, 255, 0.18)",
                  overflowX: "auto",
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              />
            );
          },
          table({ children: kids }) {
            return (
              <div style={{ overflowX: "auto", margin: "12px 0" }}>
                <table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    fontSize: 14,
                  }}
                >
                  {kids}
                </table>
              </div>
            );
          },
          th({ children: kids }) {
            return (
              <th
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  padding: "8px 12px",
                  textAlign: "left",
                  background: "rgba(124, 244, 255, 0.06)",
                  color: "#e5edff",
                  fontWeight: 600,
                }}
              >
                {kids}
              </th>
            );
          },
          td({ children: kids }) {
            return (
              <td
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "8px 12px",
                  color: "#c6d5ff",
                }}
              >
                {kids}
              </td>
            );
          },
          a({ children: kids, href }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#7cf4ff", textDecoration: "underline" }}
              >
                {kids}
              </a>
            );
          },
          blockquote({ children: kids }) {
            return (
              <blockquote
                style={{
                  borderLeft: "3px solid rgba(124, 244, 255, 0.4)",
                  margin: "12px 0",
                  padding: "4px 14px",
                  color: "#c6d5ff",
                  background: "rgba(124, 244, 255, 0.04)",
                  borderRadius: "0 8px 8px 0",
                }}
              >
                {kids}
              </blockquote>
            );
          },
          p({ children: kids }) {
            return (
              <p style={{ margin: "10px 0", lineHeight: 1.65, color: "#c6d5ff" }}>{kids}</p>
            );
          },
          ul({ children: kids }) {
            return (
              <ul style={{ margin: "10px 0", paddingLeft: 22, color: "#c6d5ff", lineHeight: 1.65 }}>
                {kids}
              </ul>
            );
          },
          ol({ children: kids }) {
            return (
              <ol style={{ margin: "10px 0", paddingLeft: 22, color: "#c6d5ff", lineHeight: 1.65 }}>
                {kids}
              </ol>
            );
          },
          h1({ children: kids }) {
            return (
              <h2 style={{ marginTop: 24, marginBottom: 10, color: "#e5edff", fontSize: "1.4rem" }}>
                {kids}
              </h2>
            );
          },
          h2({ children: kids }) {
            return (
              <h3 style={{ marginTop: 20, marginBottom: 8, color: "#e5edff", fontSize: "1.2rem" }}>
                {kids}
              </h3>
            );
          },
          h3({ children: kids }) {
            return (
              <h4 style={{ marginTop: 16, marginBottom: 6, color: "#e5edff", fontSize: "1.05rem" }}>
                {kids}
              </h4>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
