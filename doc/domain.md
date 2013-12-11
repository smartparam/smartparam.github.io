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


## Parameter metadata

#### Name

Name must be unique repository-wide. It is also the only identifier of parameter. If parameters from different repositories
share the same name, repository registration order matters (first in, first out). This can be used to create
server/environment-specific parameters with sensible defaults.

#### Cacheable

Should ParamEngine compile parameter and store it in prepared parameter cache. Parameter is compiled only on first usage,
further invocations use prepared parameter stored in cache. Prepared parameter is memory efficient tree-like structure
that makes ParamEngine fast and flexible. Only prepared parameters can use advanced features of SmartParam like 
**star notation** to provide default values.

In some cases it is impossible to prepare parameter and load it into cache (most often its because of parameter size). If so,
each parameter query is delegated to parameter repository and it becomes repository responsibility to retrieve entry that
matches the query. Not all parameter repositories have this capability. It they do, they might not support all features prepared
parameters support. Please refer to specific repository documentation for details.

#### Nullable

Should ParamEngine allow parameter to return null value. By default parameters are not nullable, which means that if
no match for query vector is found `ParameterValueNotFoundException` is thrown.

#### Array separator

If level stores arrays of values (see level description below), this property defines separator that is used to separate
distinct values. By default **,** (comma) is used. This only affects array levels!



