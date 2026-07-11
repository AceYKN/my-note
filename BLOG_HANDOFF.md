# Blog Project Handoff

> Last updated: 2026-07-12
>
> Purpose: preserve the decisions, research, rejected directions, and next steps from the blog-planning conversation so work can continue on another device.

## 1. Project intent

Create a **new, independent blog repository** that will eventually replace the current project as the public home for all content. The current repository is a VitePress knowledge base; its complete content must be migrated to the new blog project.

The final product is not a simple reverse-chronological blog. It should combine:

- long-form essays and personal reflections;
- evergreen learning notes and course material;
- project logs and retrospectives;
- practical discovery through a clear table of contents and search.

The user expects to review a small runnable prototype first, direct revisions, and only then decide whether to merge work or establish the final new repository.

## 2. Agreed product principles

- **Audience and content:** mixed technical writing, learning notes, personal essays, and project retrospectives.
- **Migration scope:** migrate all existing material, including course notes, homework, question banks, and past papers.
- **Visual character:** Taiwanese literary / fresh editorial feeling; simple, calm, efficient, and pleasant to read.
- **Interaction:** strong where it helps reading and finding content; avoid decorative or gimmicky effects.
- **Avoid:** blue-purple gradients, generic “AI” styling, glassmorphism, excessive motion, dashboard-like card walls, and visual spectacle that harms reading.
- **Priorities:** table of contents and search are essential. Other functions (RSS, comments, subscriptions, analytics, etc.) must earn their place through practical value.
- **Language:** both Traditional and Simplified Chinese are desired, but the exact bilingual authoring and translation workflow is still undecided.
- **Future hosting:** a custom domain and self-managed server are likely later. The first prototype does not need production hosting.

## 3. Recommended information architecture

Use a hybrid model rather than treating all content as either a blog or a wiki:

```text
Home — current editorial selection and current learning
├── Essays — dated writing with a personal argument or reflection
├── Notes — evergreen, revisable knowledge material
└── Logs — projects, experiments, process, and retrospectives
```

Articles should be the most approachable entry point. Each article can link to related notes and project logs; notes remain first-class, searchable, and maintainable rather than becoming hidden attachments.

Useful discovery dimensions:

- topic;
- content type (essay, note, log);
- learning stage / status;
- related-content path;
- full-text search.

## 4. Migration and repository strategy

Two strategies were considered:

1. **One-time migration** — migrate all content to the new blog repository; the new repository then becomes the single source of truth and this repository remains an archive.
2. **Continuous synchronization** — retain this repository as the source of truth and automatically import material into the blog repository.

The recommended default is **one-time full migration, then maintain only the new repository**. It avoids duplicated editing workflows, migration conflicts, and a blog that cannot develop its own content model. Continuous synchronization is only justified if this project must stay actively maintained as a separate documentation product.

This decision remains open until the prototype and authoring workflow have been tested.

## 5. Technology direction (provisional)

The working recommendation is **Astro with Content Collections and MDX**, instead of extending VitePress into a blog.

Reasons:

- better fit for a content-led editorial site while retaining static deployment;
- supports a structured model for essays, notes, and logs;
- allows selective interactive components without making the entire site app-like;
- suitable for future deployment on a custom domain and self-managed server.

VitePress is capable of blogs, but its default information architecture and UI are documentation-first. Next.js is a viable alternative if the final site needs account-based features, a CMS dashboard, or significant server-side behavior; it is probably heavier than needed for the initial content-led site.

No framework migration has been committed to this repository.

## 6. Visual benchmark research

The first three visual explorations were rejected. Their core failure was generic card-based layout and superficial “Taiwanese” colors rather than a credible editorial/content system.

Use the following benchmark set for the next prototype. Borrow structural lessons; do not copy visual assets or layouts.

| Benchmark | What to learn | What to avoid |
|---|---|---|
| [BIOS monthly](https://www.biosmonthly.com/) | Editorial selection, strong feature headlines, cultural tone, and a human-curated reading rhythm | High-frequency entertainment-media flow and image-first news treatment |
| [Shopping Design](https://www.shoppingdesign.com.tw/) | Taiwanese culture/design-media hierarchy and editorial pacing | Commercial portal density and conversion-oriented modules |
| [Maggie Appleton](https://maggieappleton.com/) | Essays, notes, and evolving ideas coexisting naturally in a personal knowledge garden | Turning the whole site into an illustration-led portfolio |
| [Gwern.net](https://gwern.net/) | Durable links, deep navigation, reader utilities, search, and long-term readability | Dense academic typography and old-fashioned visual weight |

The intended synthesis is: **BIOS’s editorial selection + Maggie Appleton’s garden model + Gwern’s utility and findability**.

## 7. Rejected first-round prototypes

Three local HTML-only concept pages were created outside this repository and rejected by the user:

1. warm-paper independent journal;
2. campus study notebook;
3. Taipei bookshop editorial.

They were intentionally not added to Git and are not portable to another device. Do not treat them as a base for further work.

A temporary starter project was initialized locally at a sibling path (`studiorum-prototype`) for prototype experimentation. It is not a finished product, is not connected to the current repository, and should not be treated as the final new blog repository.

## 8. Next prototype brief

Before implementation, collect one of the following from the user:

- a short statement of what they like and dislike in the four benchmark sites above; or
- two to three specific websites they consider genuinely attractive references.

Then build a second prototype around **real representative content** (6–10 migrated sample documents), not placeholder cards. It should include:

1. a home page that behaves like an editorial desk rather than an article feed;
2. a long-form article page with summary, readable typography, table of contents, marginal context, and related notes;
3. a note page designed for scanning, linking, and revision;
4. practical table-of-contents and search interaction;
5. clear visual differentiation between Essays, Notes, and Logs.

The home page should use a small number of deliberate editorial modules: one lead story, currently-learning material, and a compact themed route into the archive. Avoid a card grid as the dominant structure.

## 9. Current repository status

- No blog implementation, migration, or visual theme change remains in this repository.
- The only intended change in this branch is this handoff document.
- The original VitePress knowledge-base source remains intact.

## 10. Conversation checkpoints

- User explicitly asked that code not be changed without authorization. Treat planning questions as planning only.
- User subsequently authorized creating a small runnable prototype after requirements are established.
- User wants the blog to be independent of the current knowledge-base repository, with all existing content migrated.
- User rejected the first prototype visuals and requested competitor-led benchmarking before the next iteration.
