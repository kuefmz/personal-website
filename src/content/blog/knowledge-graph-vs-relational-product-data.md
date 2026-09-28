---
title: "When to Use a Knowledge Graph Instead of Only a Relational Database"
description: "How to decide when RDF and knowledge graphs add value for complex product, research, metadata, or multi-source data systems."
publishedAt: 2026-09-27
tags: ["Knowledge Graph", "RDF", "PostgreSQL", "Data Modeling", "Semantic Web"]
category: "Knowledge Graphs"
draft: false
---

Relational databases are excellent.

A knowledge graph should not be introduced simply because the data contains relationships.

The useful question is:

> When does the meaning and connectivity of the data become difficult to manage with only tables and application-specific joins?

That is where graph and semantic models become interesting.

## Start with the relational model

For many applications, PostgreSQL is the right default.

A normal product system might have:

- products;
- brands;
- categories;
- offers;
- shops;
- countries;
- attributes.

Foreign keys represent the important relationships clearly.

This model is efficient, familiar, and easy to operate.

A knowledge graph becomes valuable when the system needs to express relationships that are **heterogeneous, evolving, or shared across several domains**.

## The challenge of multi-source meaning

Different sources may use different terms for the same concept.

One dataset might use:

`manufacturer`

another:

`brand`

and another:

`madeBy`

A relational ETL pipeline can normalize those fields.

But when many sources have partially overlapping concepts, it can become useful to represent the mapping itself as data.

Semantic models make relationships explicit:

`Product -> hasBrand -> Brand`

`Offer -> offeredBy -> Shop`

`Product -> hasCategory -> Category`

The vocabulary becomes a shared contract.

## Graph models handle evolving relationships well

Relational schemas work best when the shape of the data is relatively stable.

Graph models can be useful when new relationships are frequently introduced.

For example, a system might later need to connect:

- products to materials;
- products to safety information;
- categories to broader concepts;
- brands to organizations;
- offers to geographic regions;
- entities to external identifiers.

RDF allows these relationships to be added without redesigning a large join structure every time.

## Identity is a first-class concern

Multi-source systems often need to decide whether two records describe the same entity.

A graph can represent:

- canonical entities;
- source-specific records;
- identifiers;
- equivalence links;
- provenance.

This is useful when the system must preserve where each claim came from rather than flattening everything into one row.

Product matching is one example. See [Product Matching Across Stores and Languages](/blog/ecommerce-product-matching-across-stores-languages/).

## Provenance can become easier to express

Suppose two sources disagree about an attribute.

A simple flattened table often stores only one value.

A provenance-aware model can represent:

- source A claims value X;
- source B claims value Y;
- the normalized application currently prefers X.

This distinction can matter in research, catalog aggregation, regulatory data, and metadata integration.

## Knowledge graphs do not remove the need for operational databases

A common architecture uses both.

For example:

`Sources -> normalization -> semantic model -> application projection`

The graph may be useful for:

- integration;
- reasoning;
- linking;
- semantic search;
- metadata exploration.

PostgreSQL may still serve:

- user accounts;
- transactions;
- application filters;
- operational APIs.

The right architecture does not need to choose one storage model for every job.

## RDF adds costs too

Knowledge graphs introduce complexity.

Teams need to understand:

- URIs;
- vocabularies;
- RDF serialization;
- SPARQL;
- ontology design;
- validation;
- graph storage.

If the application has a stable schema and straightforward queries, adding RDF may be unnecessary.

This is why "graph-shaped data" alone is not a sufficient reason.

## Validation still matters

Flexible data models can become inconsistent without constraints.

Useful approaches include:

- SHACL;
- controlled vocabularies;
- required-property rules;
- datatype validation;
- identifier conventions;
- provenance requirements.

Flexibility should not mean accepting arbitrary data.

## A practical decision checklist

A knowledge graph is more likely to help when several of these are true:

- many sources use different schemas;
- entity identity must be reconciled;
- provenance matters;
- relationships evolve frequently;
- external vocabularies should be reused;
- cross-domain queries are important;
- semantic interoperability is a goal.

A relational model is often enough when:

- the schema is stable;
- the data is operational;
- relationships are known;
- queries are predictable;
- the team does not need semantic interoperability.

## The best model may be hybrid

The useful question is rarely "graph or SQL?"

It is:

> Which representation makes each part of the system easier to reason about and maintain?

A graph can act as the semantic integration layer while a relational database remains the operational serving layer.

For a research-oriented example of structured concepts, see [Software Taxonomy for Research Software](/blog/software-taxonomy-for-research-software/).

Need to model data that is becoming difficult to connect across sources? [Describe the entities and relationships here](/contact/#project-request).
