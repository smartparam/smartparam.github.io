---
layout: main
title: SmartParam
---

# What is it?

SmartParam is efficient and lightweight Java library for handling application parametrization and decision making.
SmartParam helps you to:

* separate all business parameters from application logic using single, optimized tool
* write clean code, free from overgrown `switch` and `if` statements
* create extensible designs using builtin plugins
* stop worrying about versioning - with SmartParam it's for free

SmartParam takes away the pain of writing new, custom "framework" each time you need to create parameter.
SmartParam is ideal for serving business parameters, but can be applied to solve other decision making problems.
There are plenty of unwanted `if` and `switch` statements, database entities and properties files which try to deal
with mappings, dispatching or feature switches. All of these are parameters and so can be managed by SmartParam.

SmartParam comes with rich set of filtering tools to control what value is returned by parameter - price range, date,
query type.. all depends on usage scenario. SmartParam allows for including custom, project specific filters that
operate in business domain.

SmartParam also bundles plugins invoker, which can be used to create dynamic, pluggable policies or algorithm
implementations. Plugins can be written in any language that can be run in JVM. Core distribution contains
support for Java functions, but plugins could be written in Groovy, JavaScript or Clojure as well.

### So what is a parameter?

In layman terms - combination of `if` statements that returns value (primitive or object). For example `if` chain
written in pseudocode:

```
/*...*/
if ( date < 2013-02-01 ) {
    if ( customer_type == 'BUSINESS' ) {
        return 10;
    }
    else if( customer_type == 'STANDARD' ) {
        return 5;
    }
}
else if ( date >= 2013-02-01 && date < 2013-03-01 ) {
    if ( customer_type == 'BUSINESS' ) {
        return 25;
    }
    else if( customer_type == 'STANDARD' ) {
        return 10;
    }
}
// else
return 0;
```

Is equivalent to parameter described as:

| date                  | customer_type | discount |
|-----------------------|---------------|----------|
| \*:2013-02-01         | BUSINESS      | 10       |
| \*:2013-02-01         | STANDARD      | 5        |
| 2013-02-01:2013-03-01 | BUSINESS      | 25       |
| 2013-02-01:2013-03-01 | STANDARD      | 10       |
| \*                    | \*            | 0        |

Query that would return value 25 can be expressed as `date = 2013-02-15, customer_type = BUSINESS`.

Last row uses **\* (star)** operator to denote *default value* returned, when no match was found.

----

More general, term **parameter** in SmartParam domain stands for any data that can be expressed as a **M x N** matrix,
where M, N >= 1. It can be anything from single value, through simple mapping to spreadsheet data.

Parameter matrix columns can be divided into two groups:

* input columns, which specify criteria
* output columns, which specify value returned if criteria are matched

Example above specifies parameter with 2 input columns and 1 output column. Query is a vector of values, which length
is equal to input columns count, that is used to perform lookup in parameter matrix. It is possible to assign
filtering (matching) function to each input column of parameter.

### I want to get started now!

* [Getting started with first parameter (step 1 of tutorial)](/tutorial/step-1-first-parameter.html)
* [Tutorial](/tutorial/tutorial.html)
* [Documentation](/doc/domain.html)


### Contact

Use [SmartParam Github profile](https://github.com/smartparam/) to submit bugs, issues and feature
requests, or simply email us: **smartparamorg at gmail dot com**.

### Authors

Idea to build SmartParam came from **Przemek Hertel** who created first version and brought core concepts to life.
**Adam Dubiel** helped him smooth things a bit before releasing SmartParam as an Open Source.

### License

SmartParam is published under [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).
