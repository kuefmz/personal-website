---
title: "SHACL Validation in Python: Check RDF Data Before Publishing"
description: "Validate RDF data with SHACL and Python using a runnable product example, explicit datatype rules, useful reports, and a staged publishing workflow."
seoTitle: "SHACL Validation in Python"
publishedAt: 2026-10-12
tags: ["SHACL", "RDF", "Python", "Knowledge Graphs", "Data Quality"]
category: "Knowledge Graphs"
draft: false
---

Use SHACL to express the RDF constraints your application requires, then validate a staged graph before publishing it. In Python, pySHACL can return both a conformance result and an RDF validation report. Treat that report as a pipeline artifact that helps explain and repair bad data.

RDF's flexible model is useful for integrating sources, but flexibility does not remove data-quality requirements. A product without an identifier, an amount stored with the wrong datatype, or a link to the wrong entity class can still break a consuming application.

The [knowledge graph versus relational database guide](/blog/knowledge-graph-vs-relational-product-data/) explains when a semantic layer helps. This article shows how to validate that layer without claiming that a graph automatically makes the data correct.

## Separate ontology meaning from validation rules

An ontology describes concepts and relationships. A shape describes conditions that selected nodes must satisfy for a particular use. Keep these responsibilities explicit.

A shared vocabulary might allow several kinds of identifiers, while your catalog export requires exactly one local SKU. That export requirement belongs in a versioned validation profile. Another consuming application may legitimately have a different profile.

SHACL validation is not a test that every real-world statement is true. A price can have the correct datatype and still be factually wrong. A referenced brand can exist in the graph while being incorrectly assigned. Use source reconciliation and review for those errors.

The [W3C SHACL Recommendation](https://www.w3.org/TR/shacl/) defines shapes, targets, constraints, and validation results. The following example uses a small subset of SHACL Core rather than custom rules or JavaScript extensions.

## Select the validation boundary

Choose whether you are validating incoming source records, a normalized integration graph, or a published application projection. Each boundary has different completeness expectations.

An incoming record may be allowed to omit a brand until entity resolution finishes. The final catalog may require a resolved brand IRI. Applying the final shape too early can reject data that is valid for its current stage.

Document the graph scope. A shape requiring a linked node to have class `Brand` needs the relevant type information in the validation graph. If it lives in another graph or store, decide how it is included rather than assuming the validator can see it.

## Define a small product shape

Save the following as `shapes.ttl`. It targets nodes explicitly typed as products and requires one string SKU, one nonnegative decimal price, and one IRI referring to a brand.

```turtle
@prefix ex: <https://example.org/catalog/> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ex:ProductShape a sh:NodeShape ;
    sh:targetClass ex:Product ;
    sh:property [
        sh:path ex:sku ;
        sh:minCount 1 ;
        sh:maxCount 1 ;
        sh:datatype xsd:string ;
        sh:minLength 1
    ] ;
    sh:property [
        sh:path ex:price ;
        sh:minCount 1 ;
        sh:maxCount 1 ;
        sh:datatype xsd:decimal ;
        sh:minInclusive 0
    ] ;
    sh:property [
        sh:path ex:brand ;
        sh:minCount 1 ;
        sh:maxCount 1 ;
        sh:nodeKind sh:IRI ;
        sh:class ex:Brand
    ] .
```

This is an illustrative application profile, not a universal retail ontology. Prices often belong to offers with currencies, markets, and validity periods; a single product-level price is only sufficient for this demonstration.

The shape also does not establish SKU uniqueness across products. Cardinality applies to each focus node, not to the dataset as a whole. Add an explicit cross-entity uniqueness check if your system requires it.

## Prepare data with a deliberate error

Save this as `data.ttl`. The price is a quoted string, so it should fail the decimal constraint.

```turtle
@prefix ex: <https://example.org/catalog/> .

ex:brand-7 a ex:Brand .
ex:product-42 a ex:Product ;
    ex:sku "SKU-42" ;
    ex:price "12.50" ;
    ex:brand ex:brand-7 .
```

A visually plausible value is not enough. In RDF, `"12.50"` and a decimal-typed literal have different datatypes. Decide how source values are parsed and normalized before creating RDF statements.

Do not fix this by converting every numeric-looking string. Postal codes and identifiers can contain digits while still being strings. Use field-specific transformations and keep the original source value for auditability.

## Run validation and inspect the report

Create a virtual environment, install the example dependencies with `python -m pip install pyshacl rdflib`, and save the following as `validate_catalog.py`. Run it from the directory containing the two Turtle files.

```python
from pathlib import Path
from rdflib import Graph, Literal, Namespace
from rdflib.namespace import XSD
from pyshacl import validate

EX = Namespace("https://example.org/catalog/")
data = Graph().parse("data.ttl", format="turtle")
shapes = Graph().parse("shapes.ttl", format="turtle")


def check(graph):
    return validate(
        graph,
        shacl_graph=shapes,
        inference="none",
        meta_shacl=True,
        advanced=False,
        js=False,
    )


conforms, report, text = check(data)
assert not conforms
Path("validation-report.ttl").write_text(
    report.serialize(format="turtle"), encoding="utf-8"
)
print(text)

# Demonstration repair after checking the source field's meaning.
data.remove((EX["product-42"], EX.price, None))
data.add((EX["product-42"], EX.price, Literal("12.50", datatype=XSD.decimal)))
conforms, _, _ = check(data)
assert conforms
print("repaired example conforms")
```

The [pySHACL project documentation](https://github.com/RDFLib/pySHACL) describes the validator interface and configuration. Pin tested dependency versions in your pipeline rather than relying on an unrecorded environment.

The first report should identify the product, price path, and failed constraint. The repaired graph should conform. A malformed shape or parser failure is an operational error, not an ordinary nonconforming data result; handle those separately in production.

## Be deliberate about targeting and inference

Data can evade a target-class shape if it lacks the type statement that would select it. Check ingestion requirements and report how many nodes were targeted. Zero violations with zero intended focus nodes is not useful evidence of quality.

Inference settings can alter what type information the validator sees. Keep them fixed and documented. If a profile relies on subclass relationships or inferred types, include the ontology and test those cases explicitly.

The example permits additional properties. A closed shape can reject properties outside an allowlist, but can also obstruct interoperability when sources legitimately add information. Use strict closure only where the application contract requires it.

## Publish only a completed validated generation

Keep incoming data in staging. Validate the complete graph or a carefully defined affected subgraph, inspect the report, and publish a new generation only when required conditions pass.

For incremental changes, deleting a relationship can invalidate another node, and global constraints may require wider checks. Do not assume that validating only newly added triples is equivalent to validating the resulting dataset.

Record the dataset checksum, source versions, shape version, validator version, inference mode, and report. Keep the previous published generation available for rollback. This connects validation to the recovery practices in [incremental API synchronization](/blog/incremental-api-sync-cursors-checkpoints/).

Need a validation profile for a multi-source graph? [Describe the entities, consuming applications, and required constraints](/contact/#project-request).

## Make reports actionable

Group results by source, focus node, property path, and constraint. Link each item to source evidence so someone can repair the mapping or input rather than editing generated RDF without understanding why it failed.

Separate blocking violations from warnings according to the publication policy. If warnings are allowed, record that decision and monitor their trend. Avoid silently weakening shapes just to make a pipeline pass.

For research metadata, connect the validation profile to the categories discussed in [software taxonomy design](/blog/software-taxonomy-for-research-software/). A vocabulary's category structure and the completeness of each metadata record are related but distinct concerns.

## Next step

Start with a few constraints that protect an actual consuming application. Add valid, invalid, and missing-type fixtures, then put validation before publication. [Send an inquiry about your RDF data workflow](/contact/#project-request) if you need help designing shapes and a recovery process around them.
