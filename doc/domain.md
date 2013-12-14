---
layout: doc
title: SmartParam Domain
---

# SmartParam Domain

Core building blocks of ParamEngine are:

* parameter
* level
* parameter entry
* function (plugin)

**Parameter** domain object can be divided into two logical parts: **metadata** and **content**. Content is a set of entries.
Metadata is description of parameter, defines its behavior and how parameter content should be accessed when queried.
Metadata consists of parameter header and level definitions.

## Parameter metadata

#### Name

Name must be unique repository-wide. It is also the only identifier of parameter. If parameters from different repositories
share the same name, repository registration order matters (first in, first out). This can be used to create
server/environment-specific parameters with sensible defaults.

#### Input levels

How many levels are used to evaluate query. Equivalent to query vector length. Rest of the levels are treated as parameter
output. For more on levels see *Level* section below.

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

## Level

Parameter level describes single dimension/column of parameter. Parameter can have unlimited number of levels. Levels are
logically separated into two groups: input and output. Input levels are matched against query vector to determine parameter
output value. Output levels are returned after finding matching entry. Number of input levels is defined in parameter metadata.

#### Name

Name of level makes sense only for output levels, as it allows to get value of specific level by its name instead of index.
However it might be a good practice to name input levels as well and treat it as documentation.

#### Array

Flag which specifies if this level holds single value or array of values, i.e. `A,B,C,D` can be treated as a String
`A,B,C,D` or `String[] { "A", "B", "C", "D" }`. Distinct values separator is declared in parameter metadata.

#### Type

Name of type of values held in level. Type defines how value is decoded and encoded from/to string. Type has to be
registered in current instance of ParamEngine. By default column has `string` type. For more on types read [this](/doc/type.html).

#### Matcher

Name of matcher that should be used to match query value with pattern held in level. Matchers might have different effects depending
on level type. Default matcher compares two raw string values. For more on matchers read [this](/doc/matcher.html).

#### Level creator

Level creator is name of function that has to be run in order to extract value from parameter evaluation context. Extracted value will
matched with pattern held in level. Dynamic nature of level creators enables user to create flexible and easy to use 
parameters. For more on level creators and parameter evaluation context read [this](/doc/context.html).

## Parameter entry

Parameter entry is a single row of parameter matrix. Its length is equal to number of levels. It holds only raw data,
has no other properties.

## Function

Functions play really important role in SmartParam and exist in a parallel domain. Thats why there is a separate entry
about them [here](/doc/function.html).