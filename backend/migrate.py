import sqlite3

conn = sqlite3.connect('forma.db')
c = conn.cursor()

c.execute("PRAGMA table_info(forms)")
existing_cols = [col[1] for col in c.fetchall()]
print("Existing columns:", existing_cols)

if 'language' not in existing_cols:
    c.execute('ALTER TABLE forms ADD COLUMN language VARCHAR(10) DEFAULT "en"')
    print("Added column 'language'")

if 'settings' not in existing_cols:
    c.execute('ALTER TABLE forms ADD COLUMN settings JSON DEFAULT "{}"')
    print("Added column 'settings'")

if 'theme' not in existing_cols:
    c.execute('ALTER TABLE forms ADD COLUMN theme JSON DEFAULT "{}"')
    print("Added column 'theme'")

conn.commit()
conn.close()
print("Migration complete!")
