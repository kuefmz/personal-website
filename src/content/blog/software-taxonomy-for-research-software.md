---
title: "Software Taxonomy for Research Software: Why Classification Is Hard"
description: "A practical look at software taxonomy design, GitHub metadata, scientific categories, and the challenges of classifying research software."
publishedAt: 2026-09-16
tags: ["Software Taxonomy", "Research Software", "GitHub", "Machine Learning", "Knowledge Graphs"]
category: "Research Software"
draft: false
---

A **software taxonomy** sounds simple until you try to apply one consistently to real repositories. A taxonomy is a structured way to group software into meaningful categories, but research software rarely fits neatly into a single label. A repository can implement an algorithm, provide a library, visualize data, support a scientific workflow, expose an API, or do several of those things at once.

This is one of the central problems in my research on [research software classification](/projects/research-software-classification/): how can we use repository and publication metadata to classify scientific software in a way that is useful, explainable, and reproducible?

## What is a software taxonomy?

A software taxonomy is an organized system of categories used to describe what software does, where it belongs, or how it is used. Depending on the goal, categories can describe:

- a scientific domain, such as bioinformatics or climate science;
- a technical function, such as visualization, simulation, data processing, or machine learning;
- a software role, such as library, framework, command-line tool, web application, or workflow component;
- a research task, method, or lifecycle stage.

The difficult part is not creating category names. The difficult part is deciding what the categories mean, how they relate to one another, and how a real repository should be mapped to them.

## Why software taxonomies become difficult on GitHub

GitHub repositories contain useful signals, but they were not created for scientific classification. Repository names can be opaque. Descriptions can be one sentence long. Topics are optional. README files vary enormously in quality. A repository may also describe implementation details while the associated paper describes the scientific purpose.

That means a classifier may see very different evidence depending on which attribute it uses.

For example, a README may strongly indicate that a project is a visualization tool, while the associated publication abstract focuses on the scientific analysis enabled by that visualization. Both descriptions are correct, but they answer different classification questions.

This is why I treat **taxonomy design and attribute selection as separate experimental decisions**.

## The metadata I look at

For research software, useful textual signals can include:

- repository name;
- repository description;
- README text;
- GitHub topics;
- software metadata extracted from the repository;
- publication title;
- publication abstract;
- source-specific category labels.

Each source has advantages and weaknesses. Short repository descriptions are clean but sparse. README files are rich but noisy. Publication abstracts contain scientific context but may describe the paper more than the software itself.

A robust classification experiment should therefore ask not only *which model works best*, but also *which representation contains the information needed for the taxonomy*.

## Functional taxonomy vs scientific taxonomy

One recurring source of confusion is the difference between a **functional taxonomy** and a **scientific taxonomy**.

A functional taxonomy asks what the software does: data cleaning, visualization, simulation, annotation, model training, workflow orchestration, and so on.

A scientific taxonomy asks what field or research topic the software belongs to: genomics, materials science, astronomy, natural language processing, or another domain.

Those are not interchangeable. A visualization library can be used in many scientific domains, and two genomics tools can have completely different functional roles.

For research software discovery, it is often useful to preserve both views rather than forcing everything into one hierarchy.

## Why taxonomy alignment matters

Different platforms use different category systems. That creates a second problem after classification: even if two sources categorize software well, their labels may not be directly comparable.

Semantic alignment can help identify equivalent, broader, narrower, or related concepts across taxonomies and scientific knowledge graphs. This is where my work in knowledge graphs and ontology engineering intersects with machine learning.

Instead of treating category labels as arbitrary strings, we can inspect their meaning and relationships.

## What I have learned from classification experiments

Three lessons have become especially important in my work.

First, **the taxonomy defines the task**. A model cannot compensate for ambiguous or inconsistent category definitions.

Second, **the representation matters as much as the model**. The same classifier can behave very differently on an abstract, README, repository description, or combined representation.

Third, **evaluation needs to reflect the real vocabulary**. Rare categories, label imbalance, and inconsistent source taxonomies can make headline accuracy misleading.

That is why I prefer transparent baselines and explicit evaluation choices before adding more complex models.

## How this connects to my current research

My PhD work studies research software classification across repository metadata, publication metadata, semantic attributes, and scientific knowledge systems. I am particularly interested in which attributes are actually useful for classification and how taxonomies from different sources can be compared systematically.

You can read the broader project page on [Research Software Classification](/projects/research-software-classification/) or the publication page for [Automated Research Software Classification](/publications/automated-research-software-classification/).

The goal is not just to predict a category. It is to make research software easier to discover, compare, and connect to the scientific context in which it is used.
