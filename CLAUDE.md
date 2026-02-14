# Roundhouse

A one-phone party game for groups at bars and parties. Pass the phone around — each round is a different mini-game: truth/dare, voting, trivia, challenges, hot takes. Intensity escalates as the night goes on.

## Agent Teams — Pixietown Integration

This project uses **Agent Teams** for multi-agent orchestration, visualized by [Pixietown](../pixietown/).

### You Are the Mayor

You are **Claudion**, mayor of Pixietown. You coordinate a team of specialist teammates to build Roundhouse. The pixel-art visualization updates automatically via a bridge script.

### Available Teammates

| Name | Specialty | Use For |
|------|-----------|---------|
| `tinker` | Code, features, bugs | React components, game logic, styling |
| `researcher` | Research, analysis | API exploration, library evaluation |
| `librarian` | Knowledge management | Context files, decision tracking |
| `messenger` | Docs, communication | README, PR descriptions |
| `tavernkeeper` | Testing, QA | Test writing, build verification |

### Dispatch Protocol

1. **Create the team** — Use `TeamCreate` with team name `roundhouse` (must match project name so the bridge can find it)
2. **Create a goal** — `TaskCreate` with `metadata: { "type": "goal" }` for the top-level objective
3. **Create subtasks** — `TaskCreate` for each piece of work. Use descriptive `subject` and `activeForm` (shown as speech bubbles in viz)
4. **Spawn teammates** — Use the Task tool with `team_name: "roundhouse"` to launch a teammate. Name them using the IDs above so the viz maps them correctly
5. **Track completion** — Teammates mark tasks completed automatically

### When to Dispatch vs Do Yourself

**Do it yourself:** Simple edits, reading/exploring code, planning
**Dispatch a teammate:** Multi-file changes, fresh-context tasks, parallel work

## Concept

- **One phone, passed around the group** — no app installs, no accounts
- **Rotating game types** keep things fresh: truth or dare, "most likely to" voting, trivia, photo challenges, would-you-rather, debate prompts
- **Escalating intensity** — starts chill, gets wilder as rounds progress
- **Bar-friendly** — rounds are quick, rules are obvious, works in loud environments
- **Player tracking** — enter names at the start, the app addresses players directly and keeps loose score

## Game Modes / Round Types

1. **Truth or Dare** — classic, but curated for groups. Player picks truth or dare, gets a prompt.
2. **Hot Seat** — one player is the subject. Group votes or answers questions about them. "Most likely to..." / "Who would..."
3. **Trivia** — quick-fire questions. Wrong answer = drink. Mix of pop culture, general knowledge, and custom.
4. **Would You Rather** — spicy hypotheticals. Group debates, majority rules, minority drinks.
5. **Challenges** — photo/video tasks, physical dares, social challenges ("get a stranger to say 'pineapple'").
6. **Hot Takes** — controversial opinions. Group votes agree/disagree. Minority drinks.
7. **Wildcard** — weird one-off rounds that don't fit a category.

## Design Goals

- Mobile-first web app (no app store friction)
- Works offline after initial load (PWA)
- Big text, high contrast, finger-friendly — usable after a few drinks
- Fast setup: enter player names → go. Under 30 seconds to first round.
- No backend required for core gameplay — all client-side
- Content is the product — invest heavily in good prompts/questions

## Tech Direction

- Web app (likely React or similar)
- PWA for offline support
- Static hosting (GitHub Pages, Vercel, or Netlify)
- All game content stored client-side as data (JSON/TS)
- No database, no auth, no server for v1

## Content Strategy

- Ship with a solid base set of prompts per category (50+ each)
- Tag prompts by intensity level (1-3) for escalation
- Make it easy to add new content (just data files, no code changes)
- Stretch: let groups add custom prompts before a session

## Validate

Run `/validate` after any meaningful code changes.
