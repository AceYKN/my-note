---
name: math-note-formatter
description: "Format and structure math lecture notes or homework into well-organized Markdown with LaTeX. Use when: writing math notes, formatting lecture content, organizing homework solutions, structuring proofs, creating study summaries for algebra, analysis, ODE, or other math courses."
argument-hint: "Paste raw notes or describe the topic to format"
---

# Math Note Formatter

将原始数学课堂笔记、作业或草稿整理为结构化的 Markdown 文档，保持与本仓库一致的排版风格。

## When to Use

- 将课堂笔记整理成结构化文档
- 格式化数学作业解答
- 组织证明题的书写
- 创建复习总结笔记

## Output Format Convention

本仓库的数学笔记遵循以下统一格式，所有输出必须遵守：

### 1. 文档结构

```
# 主标题
## 1. 开篇总结 (Executive Summary)    ← 简述核心内容与关键洞察
## 2. 核心定义与公理体系              ← 定义、公理、分类表格
## 3. 核心概念深入分析                ← 重要概念的详细讨论
## 4. 定理与证明                      ← 定理陈述 + 完整证明
## 5. 例题与习题详解                  ← 分步解答
```

### 2. LaTeX 规范

- 行内公式用 `$...$`：如 $\mathbb{Z}_p$、$\forall a \in R$
- 独立公式用 `$$...$$` 并单独成行
- 常用符号集：`\mathbb{Z}, \mathbb{Q}, \mathbb{R}, \mathbb{C}`, `\forall, \exists`, `\implies, \iff`
- 集合运算：`\cap, \cup, \subseteq, \in, \setminus`

### 3. 排版元素

- **分类/对比** → 使用表格（参考环的分类层级表）
- **关键辨析** → 使用 blockquote `>`（如单位元 vs 单位的区分）
- **证明结构** → 目标 → 逻辑步骤（编号列表）→ 结论
- **题目解答** → 分析 → 步骤 → 答案，三段式
- 用 `---` 分隔主要章节

### 4. 语言与风格

- 中文为主，术语附英文原名：如 **整环 (Integral Domain)**
- 先给直观理解，再给严格定义
- 口语化难点解释放在严格内容之后

## Procedure

1. **识别内容类型**：判断输入是课堂笔记、作业、证明题还是复习总结
2. **提取核心结构**：找出定义、定理、证明、例题等元素
3. **按文档结构模板组织**：
   - 课堂笔记 → 完整的 Executive Summary + 定义 + 分析 + 例题
   - 作业解答 → 题目 + 分析 → 步骤 → 答案
   - 证明题 → 命题 → 证明目标 → 逻辑步骤 → 结论
   - 复习笔记 → 公式汇总表 + 方法论 + 易错点
4. **格式化所有数学表达式**为正确的 LaTeX
5. **添加关键辨析和易错点提示**（用 blockquote）
6. **输出完整格式化文档**

## Examples

### 输入：粗糙的课堂笔记

```
环就是有加法和乘法的集合，加法要是阿贝尔群，乘法要有结合律，还要有分配律
整环是没有零因子的交换幺环
域就是交换除环
```

### 输出格式预期

格式化为带表格分类、LaTeX 公理列表、关键辨析 blockquote 的完整文档，参考本仓库中 `docs/math/abstract_algebra/ring.md` 的风格。
