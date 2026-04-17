# NL-to-SQL Engine

## What It Is
A personal project — a production-ready natural language to SQL pipeline built out of curiosity about making NL-to-SQL actually reliable. Converts plain English queries into executable SQL and runs them against a DuckDB database.

## Why I Built It
Naive NL-to-SQL (just "prompt the LLM with the query and schema") fails in practice:
- LLMs hallucinate table/column names
- Generated SQL often has subtle logical errors
- Large schemas overwhelm the context window
- No recovery when SQL fails to execute

I wanted to build something that handled all of these properly.

## Architecture — Four Core Modules

### 1. Schema Extractor
- Reads the database schema programmatically
- Structures table definitions, column types, and relationships

### 2. Keyword-Based Schema Retriever
Instead of sending the full schema to the LLM:
- Extracts keywords from the user's natural language query
- Matches keywords against table and column names
- Returns only the relevant subset of the schema
- Reduces token usage and improves accuracy on large schemas

### 3. SQL Generator with Chain-of-Thought Planner
- **Planning step**: LLM first reasons through what SQL constructs are needed before generating
- **Generation step**: Using the plan + filtered schema, generates the SQL query
- Chain-of-thought planning catches logical errors before they become bad SQL

### 4. LLM-Based PASS/FAIL Validator with Retry
- Generated SQL is sent to a validator LLM that checks for syntax errors, logical inconsistencies, and intent alignment
- If FAIL: error context is fed back with a retry prompt
- Up to 3 retries before returning a graceful error message

### 5. Executor
- Runs validated SQL against DuckDB
- Returns results as structured data

## Stack
- **Python** — core engine
- **DuckDB** — in-process analytical SQL database
- **Claude API** — planning, generation, and validation calls
- **FastAPI** — API layer for the pipeline
- **SQLAlchemy** — database abstraction

## Key Design Decision
The retry-with-context loop was the most important engineering decision. Instead of giving up on bad SQL, the validator explains *why* the SQL is wrong, and the generator gets that context to try again. This is a personal project built to explore the full complexity of reliable NL-to-SQL.
