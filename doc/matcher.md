---
layout: doc
title: SmartParam Matcher
---

# Matcher

Matcher is responsible for evaluating if query value matches the pattern held in parameter entry column. Most basic
matcher compares string equality, but more sophisticated matchers can act differently depending on values type.

## Custom implementation

To create own matcher implement `org.smartparam.core.matcher.Matcher` interface and annotate it with
`org.smartparam.core.annotated.annotations.ParamMatcher` or register it manually on [ParamEngine](/doc/engine.html) creation.

## Bundled matchers

#### Type matchers

Compares two objects decoded using level type. If type is comparable, uses `compareTo` method, else determines equality
using `equals` method.

#### String matcher

Compares two strings case insensitive. Name: `equals/string`.

#### Between matcher

Checks if value is in between range defined by pattern. For this, pattern has to supply two values to mark range beginning
and ending. Range ends have to be separated using one of defined separators, by default these are **: (colon)**, **- (dash)**
and **, (comma)**. To define open range (*from infinity till X* or *from X till infinity*) either don't define any value or
use **\* (star)** symbol.

Between matcher uses level Type to differentiate behavior. It uses `compareTo` method on decoded object, so any type
used with between matcher has to implement `Comparable` interface.

Examples:

| pattern | meaning                  |
|---------|--------------------------|
| 12-25   | from 12 till 25          |
| *-25    | anything lower than 25   |
| ,25     | anything lower than 25   |
| 12:*    | anything greater than 12 |

You can also define behavior of range ends by using one of 4 specialized instances. Between matcher implementation names are:

* **between/ie** - lower end inclusive, greater end exclusive
* **between/ei** - lower end exclusive, greater end inclusive
* **between/ii** - lower and greater end inclusive
* **between/ee** - lower and greater end exclusive

For example:

| behavior | pattern | value | matches? |
|----------|---------|-------|----------|
| ie       | 12-25   | 12    | true     |
| ie       | 12-25   | 25    | false    |
| ei       | 12-25   | 12    | false    |
| ei       | 12-25   | 25    | true     |

