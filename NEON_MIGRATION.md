# Migrating to Neon (Postgres) — what changed and how to cut over

## What changed in the code (already done, in this delivery)

| File | Change |
|---|---|
| `config/settings.py` | Loads `.env` via `python-dotenv` (already in `requirements.txt`, previously unused). `DATABASES` now reads `DATABASE_URL` from the environment via `dj_database_url.parse(...)` if it's set, and **automatically falls back to the original local `db.sqlite3` file if it's not set** — so a machine with no `.env` configured still works exactly as before. |
| `requirements.txt` | Added `dj-database-url==2.3.0` (parses a Postgres connection string into Django's config dict) and `psycopg[binary]==3.2.3` (the actual Postgres driver — SQLite needs no driver, Postgres does). |
| `.env.example` | New — template showing the expected `DATABASE_URL` format. Copy to `.env` and fill in real values. |
| `.gitignore` | New — this project had none at all. Excludes `.env` (so real credentials never get committed) and `db.sqlite3` (so your local fallback file doesn't get committed either). |

**Nothing else changed.** Every model (`UserProfile`, `CauseFeedback`), every migration file, every `.objects.create(...)`/`.filter(...)` call anywhere in the codebase is untouched — that's the entire point of Django's ORM: it doesn't know or care which database engine is underneath it.

---

## What you still need to do (I can't do this part from here — no live credentials or network access in this environment)

### 1. Create the Neon database
In the Neon dashboard: create a project, then open **Connection Details** and copy the connection string. It looks like:
```
postgresql://user:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### 2. Install the two new dependencies
```
pip install -r requirements.txt
```

### 3. Set up your `.env`
```
cp .env.example .env
```
Then paste your real connection string into `.env`'s `DATABASE_URL=` line. **Never commit this file** — `.gitignore` already excludes it.

### 4. Create the schema on Neon
```
python manage.py migrate
```
This runs every migration in `parser/migrations/` (including `0001_initial`, `0002_causefeedback`, `0003_causefeedback_raw_stats` from our earlier work) against the **new, empty** Neon database — creating `UserProfile`, `CauseFeedback`, and everything else fresh.

### 5. (Only if you have real data in `db.sqlite3` you want to keep)
`migrate` only creates empty tables — it does **not** copy existing rows over. If you have real users or feedback in your local SQLite file already, move the data explicitly:

```
# Step A — with .env NOT yet pointing at Neon (or DATABASE_URL unset),
# export everything from your current SQLite file:
python manage.py dumpdata --natural-foreign --natural-primary \
  -e contenttypes -e auth.permission \
  > data.json

# Step B — now point DATABASE_URL at Neon (step 3 above) and create
# the schema there:
python manage.py migrate

# Step C — load your old data into the now-empty Neon database:
python manage.py loaddata data.json
```
`-e contenttypes -e auth.permission` is excluded deliberately — Django recreates those automatically during `migrate`, and reloading them from a dump can collide with what migrate already created. Everything else (your actual users, `UserProfile` rows, any `CauseFeedback` you've collected) comes across fine — Django's dump/load format is plain JSON and doesn't care which database engine is on either end.

### 6. Verify
```
python manage.py shell -c "from django.db import connection; print(connection.vendor)"
```
Should print `postgresql`. If `DATABASE_URL` wasn't picked up correctly, this would print `sqlite` instead — that's your signal something in step 3 is wrong (typo in `.env`, or `.env` not in the same directory as `manage.py`), not a signal anything in the code is broken.

---

## Rolling back

Delete or comment out `DATABASE_URL` in `.env` (or delete `.env` entirely) — `settings.py`'s fallback means the app immediately goes back to using the local `db.sqlite3` file, no code change needed.
