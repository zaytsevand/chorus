# Standing operator rulings and decisions (ruling lookup port)

Source: the operator's suite-review brief. These are operator answers; cite them by id (e.g. suite-review/R-3), never restate them as your own evidence.

## Rulings
- **R-1** — Q: Should the chorus integrate with the problem brief directly?
  Operator said: "The idea with problem brief is not to integrate with it but to have a common composite root"
- **R-2** — Q: How should the chorus be made reliable in its implementation? (Should personas keep returning prose?)
  Operator said: "Ненадёжность реализации используют подход брифа: персоны возвращают структурированные джисон вместо прозы, ядро проверяет этот json по схеме схема хранится отдельно в репозитории доступная обоим агентом"
- **R-3** — Q: Should the schema check be done by the language model or by code?
  Operator said: "Комментарии к улучшению через внедрение схемы ответов: это должен быть программный модуль, а не проверка через языковую модель"
- **R-4** — Q: Should the schema cover only persona replies, or all chorus data?
  Operator said: "Распространи схему ответов в целом на схему данных"
- **R-5** — Q: Should chorus records follow the brief's approach (JSON data validated by code and rendered into pages) rather than hand-written markdown?
  Operator said: "Подход брифа мне больше нравится"
- **R-6** — Q: Moving chorus records to validated JSON breaks existing markdown logs and reviews; is migrating them part of this work?
  Operator said: "Мы теряем обратную совместимость, Но это отдельный процесс миграции, сейчас вне скупа"
- **R-7** — Q: How should installed copies be kept current: tooling (links, drift checks) or process?
  Operator said: "Подумай немного. Докфудинг новые версии снимет проблемы с не обновлённой инсталляцией"
- **R-8** — Q: Should agent descriptions carry trigger phrases, and are the agents only for chorus and spec work?
  Operator said: "Верни триггерные фразы. Клод использует агентов активно, и не только для спецификации"
- **R-9** — Q: How should skills and components be named?
  Operator said: "Be more creative. This is not descriptive terms that says nothing about the substance and the place in the interaction this skill is intended to be us d in"
- **R-10** — Q: May chorus ports describe how an outside provider stores or delivers things?
  Operator said: "Isn't it a contamination of the chorus internals with an outside communication channel details?"

## Decided entries (the operator's choice per entry)
- **Q-1** The chorus and the problem brief both handle your decisions, and nothing composes them → chose: A small root skill owns the shared decision contract and the bindings (complete)
- **Q-2** Your rulings are kept in two records that never cite each other → chose: Split by kind: your rulings in the brief, vote counts in the chorus log (complete)
- **Q-3** Several rules seat or grade personas on the orchestrator's say, against self-selection → chose: Delete the mandates and orchestrator picks; put the triggers in the personas (complete)
- **Q-4** The canon cannot agree whether an orange severity level exists → chose: Drop orange everywhere (complete)
- **Q-5** Shared rules are stated in several files, and some are owned by a sibling skill → chose: One owner per rule; move seating into the core; fold the two unlisted files in (complete)
- **Q-6** The review round's procedure has holes an orchestrator can fall through → chose: Fix each hole in place; mark round-two findings as ungraded (complete)
- **Q-7** Persona files have drifted from what the skills expect of them → chose: One pass over all ten persona files (complete)
- **Q-8** The plugin manifest is invalid and the installed copies are three commits old → chose: A version is done once it is dogfooded through the real install channel (decided)
- **Q-9** The suite has two names → chose: Call the suite chorus everywhere (complete)
- **Q-10** The integrity check passes while every issue above exists → chose: Extend the script and run it in GitHub Actions (complete)
- **Q-11** About a quarter of the review skill's text can go without losing a rule → chose: Distil after the fixes land, and fold INTEGRATION-LAYER into the phase headers (complete)
- **Q-12** Where the shared schema for persona output and decisions lives → chose: In the root skill's own repository, which both skills depend on (complete)
- **Q-13** The root skill needs a permanent name → chose: coryphaeus: the chorus leader who speaks for the chorus to the protagonist (decided)
- **Q-14** The vote-count rules leave some cases undefined, and the validator had to pick → chose: Adopt the validator's choices and write them into GATE-PRIMITIVE (complete)
- **Q-15** How chorus decisions map onto the brief, and whether answers get their own port → chose: Keep seven chorus ports; the ruling sink becomes an internal detail of the root (complete)
- **Q-16** The constitution was bumped as a minor version, but the change may be major → chose: Make it 2.0.0 (complete)
- **Q-17** The short descriptions lost what sets neighbouring agents apart → chose: Restore the old descriptions and add several signature questions per agent (complete)
