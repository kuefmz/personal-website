"""Exercise the runnable Python examples embedded in the SEO articles.

Run with Python 3.11+ and pyshacl/rdflib installed in an isolated environment:
    python scripts/check-article-examples.py
The website itself does not depend on these Python packages.
"""
from concurrent.futures import ThreadPoolExecutor
from contextlib import redirect_stdout
import csv
import io
import os
from pathlib import Path
import re
import sqlite3
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "src/content/blog"


def blocks(slug, language):
    text = (BLOG / f"{slug}.md").read_text()
    return re.findall(rf"```{language}\n(.*?)```", text, flags=re.S)


def load_example(slug):
    namespace = {"__name__": "__main__"}
    with redirect_stdout(io.StringIO()):
        exec(compile(blocks(slug, "python")[0], slug, "exec"), namespace)
    return namespace


class ArticleExamples(unittest.TestCase):
    def test_job_rollback_and_concurrent_replay(self):
        ex = load_example("idempotent-python-scheduled-jobs")
        with tempfile.TemporaryDirectory() as directory:
            filename = str(Path(directory) / "job.sqlite")
            with sqlite3.connect(filename, isolation_level=None) as db:
                ex["initialize"](db)
                with self.assertRaises(RuntimeError):
                    ex["store_report"](db, "run-1", 7, fail=True)
                self.assertEqual(db.execute("SELECT COUNT(*) FROM report_results").fetchone()[0], 0)

            def attempt(_):
                with sqlite3.connect(filename, isolation_level=None) as db:
                    return ex["store_report"](db, "run-1", 7)

            with ThreadPoolExecutor(max_workers=2) as pool:
                self.assertEqual(sorted(pool.map(attempt, range(2))), [False, True])

    def test_inbox_scope_and_conflicting_payload(self):
        ex = load_example("webhook-idempotency-durable-inbox")
        with sqlite3.connect(":memory:") as db:
            ex["initialize"](db)
            self.assertTrue(ex["accept"](db, "p", "a", "e", {"x": 1}))
            self.assertFalse(ex["accept"](db, "p", "a", "e", {"x": 1}))
            self.assertTrue(ex["accept"](db, "p", "b", "e", {"x": 1}))
            with self.assertRaises(ValueError):
                ex["accept"](db, "p", "a", "e", {"x": 2})
            self.assertEqual(db.execute("SELECT COUNT(*) FROM inbox").fetchone()[0], 2)

    def test_page_rollback_empty_page_stale_replay_and_deletion(self):
        ex = load_example("incremental-api-sync-cursors-checkpoints")
        with sqlite3.connect(":memory:", isolation_level=None) as db:
            ex["initialize"](db)
            with self.assertRaises(RuntimeError):
                ex["commit_page"](db, "start", "p2", [{"id": "a", "revision": 2}], fail=True)
            self.assertEqual(db.execute("SELECT token FROM sync_state").fetchone()[0], "start")
            self.assertEqual(db.execute("SELECT COUNT(*) FROM entities").fetchone()[0], 0)
            ex["commit_page"](db, "start", "p2", [{"id": "a", "revision": 3, "deleted": True}])
            ex["commit_page"](db, "p2", "p3", [{"id": "a", "revision": 2}])
            self.assertEqual(db.execute("SELECT deleted FROM entities").fetchone()[0], 1)
            ex["commit_page"](db, "p3", "delta", [])
            self.assertEqual(db.execute("SELECT token FROM sync_state").fetchone()[0], "delta")
            with self.assertRaises(ValueError):
                ex["commit_page"](db, "p3", "other", [])

    def test_field_missing_wrong_optional_and_identifier_rules(self):
        ex = load_example("evaluate-pdf-extraction-accuracy-python")
        labels = {"a": {"id": "001", "total": "10.00", "optional": None}}
        scores = ex["score"](labels, {"a": {"id": "1", "optional": "invented"}}, list(labels["a"]))
        self.assertEqual((scores["id"]["fp"], scores["id"]["fn"]), (1, 1))
        self.assertEqual(scores["total"]["fn"], 1)
        self.assertIsNone(scores["optional"]["recall"])
        self.assertEqual(scores["optional"]["fp"], 1)
        self.assertEqual(ex["normalize"]("total", "10.0"), ex["normalize"]("total", "10.00"))
        with self.assertRaises(ValueError):
            ex["score"](labels, {"unknown": {}}, ["id"])

    def test_shacl_invalid_valid_and_missing_identifier(self):
        with tempfile.TemporaryDirectory() as directory:
            previous = Path.cwd()
            os.chdir(directory)
            try:
                shapes, data = blocks("shacl-validation-python-rdf-data", "turtle")
                Path("shapes.ttl").write_text(shapes)
                Path("data.ttl").write_text(data)
                ex = load_example("shacl-validation-python-rdf-data")
                self.assertTrue(Path("validation-report.ttl").is_file())
                ex["data"].remove((ex["EX"]["product-42"], ex["EX"].sku, None))
                self.assertFalse(ex["check"](ex["data"])[0])
            finally:
                os.chdir(previous)

    def test_sqlite_export_quoting_boolean_and_invalid_data(self):
        with tempfile.TemporaryDirectory() as directory:
            previous = Path.cwd()
            os.chdir(directory)
            try:
                with sqlite3.connect("source.sqlite") as db:
                    db.execute("CREATE TABLE accounts(id, name, active)")
                    db.execute("INSERT INTO accounts VALUES (42, ?, 1)", ('Name, with "quotes"',))
                load_example("sqlite-to-postgresql-production-migration")
                with Path("accounts.csv").open(newline="") as file:
                    rows = list(csv.DictReader(file))
                self.assertEqual(rows, [{"id": "42", "name": 'Name, with "quotes"', "active": "true"}])
                with sqlite3.connect("source.sqlite") as db:
                    db.execute("INSERT INTO accounts VALUES (43, 'Bad boolean', 2)")
                with self.assertRaises(ValueError):
                    load_example("sqlite-to-postgresql-production-migration")
            finally:
                os.chdir(previous)


if __name__ == "__main__":
    unittest.main()
