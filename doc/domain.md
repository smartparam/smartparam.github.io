---
layout: doc
title: SmartParam Domain
---

# SmartParam Domain

Core building blocks of ParamEngine are:

* parameter
* level
* parameter entry

**Parameter** domain object can be divided into two logical parts: **metadata** and **content**. Content is a set of entries.
Metadata is description of parameter, defines its behavior and how parameter content should be accessed when queried.
Metadata consists of parameter header and level definitions.

