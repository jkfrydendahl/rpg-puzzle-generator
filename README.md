# RPG Puzzle Generator

This project implements a **logic-first puzzle generator** for tabletop RPGs.

The generator creates **structured puzzle packets** that GMs can use at the table.

The system is intentionally designed so that **puzzle logic is generated before flavor text**. AI tools may later decorate puzzles with descriptions or riddles, but the core generator focuses on solvable puzzle structure.

## Core Design Principles

1. Puzzle logic must always be **solvable**.
2. Every required step must be **supported by clues**.
3. Archetype compatibility determines valid puzzle structures.
4. Difficulty must constrain complexity.
5. Generated output should be **GM-usable without modification**.

## Puzzle Structure

Every generated puzzle contains:

- archetype
- interface components
- solution steps
- clue sources
- optional twist
- consequence
- hint ladder
- validation metadata

## Development Approach

The generator is built in stages:

1. Define **types**
2. Define **seed data**
3. Generate **solution logic**
4. Generate **clues**
5. Generate **hints**
6. Validate puzzle structure
7. Export optional AI prompt

The generator should prioritize **correct puzzle logic over creative flavor**.