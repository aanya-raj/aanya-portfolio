# backend

a small flask + sqlite api i run locally to edit the site's content
through the admin panel. not deployed anywhere. the live site doesn't
need it.

```bash
pip install -r requirements.txt
python setup_admin.py
python app.py
```

copy `.env.example` to `.env` first and set your own secrets.
