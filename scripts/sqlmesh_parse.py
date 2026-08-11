from typing import List
from sqlmesh.core.context import Context
import time
from sqlglot import  parse, ParseError

from sqlmesh.utils.errors import (
    ConfigError,
)
from sqlmesh.utils.dag import DAG
from sqlmesh.core.linter.rules import BUILTIN_RULES
from sqlmesh.core.linter.definition import Linter

def parse_sqlmesh(paths:List[str]):
    context = Context(paths=paths, load=False)

    parsed_trees = {}
    load(context)

    for [key, model] in context._models.items():
       # expression = context.render(model, expand=True)
        expression = model.render_query()
        #expression = model.render_definition()

        parsed_trees[str(model._path)] = [expression]


    return parsed_trees

def parse_files(paths: List[str]):
        parsed_trees = {}

        for path in paths:
                try:
                    with open(path, 'r', encoding='utf-8') as file:
                        sql_content = file.read()

                    expressions = parse(sql_content) 
                    parsed_trees[path] = expressions
                        

                except ParseError as e:
                    print(f"❌ Syntax error while parsing {path}: {e}")
                except Exception as e:
                    print(f"⚠️ Failed to read file {path}: {e}")

        return parsed_trees


def load(context: Context):
        """Load all files in the context's path."""
        load_start_ts = time.perf_counter()

        loaded_projects = [loader.load() for loader in context._loaders]

        context.dag = DAG()
        context._standalone_audits.clear()
        context._audits.clear()
        context._macros.clear()
        context._models.clear()
        context._metrics.clear()
        context._requirements.clear()
        context._excluded_requirements.clear()
        context._linters.clear()
        context._environment_statements = []
        context._model_test_metadata.clear()
        context._model_test_metadata_path_index.clear()
        context._model_test_metadata_fully_qualified_name_index.clear()
        context._models_with_tests.clear()

        for loader, project in zip(context._loaders, loaded_projects):
            context._jinja_macros = context._jinja_macros.merge(project.jinja_macros)
            context._macros.update(project.macros)
            context._models.update(project.models)
            context._metrics.update(project.metrics)
            context._audits.update(project.audits)
            context._standalone_audits.update(project.standalone_audits)
            context._requirements.update(project.requirements)
            context._excluded_requirements.update(project.excluded_requirements)
            context._environment_statements.extend(project.environment_statements)

            context._model_test_metadata.extend(project.model_test_metadata)
            for metadata in project.model_test_metadata:
                if metadata.path not in context._model_test_metadata_path_index:
                    context._model_test_metadata_path_index[metadata.path] = []
                context._model_test_metadata_path_index[metadata.path].append(metadata)
                context._model_test_metadata_fully_qualified_name_index[
                    metadata.fully_qualified_test_name
                ] = metadata
                context._models_with_tests.add(metadata.model_name)

            config = loader.config
            context._linters[config.project] = Linter.from_rules(
                BUILTIN_RULES.union(project.user_rules), config.linter
            )

        duplicates = set(context._models) & set(context._standalone_audits)
        if duplicates:
            raise ConfigError(
                f"Models and Standalone audits cannot have the same name: {duplicates}"
            )

        context._all_dialects = {m.dialect for m in context._models.values() if m.dialect} | {
            context.default_dialect or ""
        }

        context._loaded = True
        return context