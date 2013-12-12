---
layout: doc
title: SmartParam Types
---

# Type

SmartParam operates with own types to provide decoding and encoding logic for Java classes. When query vector is formed,
provided objects are translated encoded to string using type specification from level. On parameter evaluation, two
string values are passed to matcher (if defined) - encoded query value and string pattern from parameter entry. Third
argument is type of these values. This allows on writing matchers that compare decoded values or operate on specific type.

When match has been found and output submatrix is returned, types are used to encoded submatrix values to Java object 
instances so they can be returned using one of many output submatrix helper methods.

## Type and holder

Each type implementation consists of two parts. One is Type itself, other is AbstractHolder. Type specifies encoding/decoding
routines and actualy operates on holder, not raw value. Holder is a null-safe wrapper around raw value with multiple
converting methods that, if implemented, allow to get contained value as Date, Number, String etc. This can be utilized to
transparently assign different meanings/representations of held object class (ex. date can be represented as number of milliseconds).

## Custom implementation

Extend `org.smartparam.engine.core.type.AbstractHolder` class to create raw value holder. Implement 
`org.smartparam.core.type.Type` interface and annotate the implementation using `org.smartparam.engine.annotated.annotations.Type`
annotation to enable automatic discovery or register type on engine creation.

## Bundled types

#### Boolean

Stores boolean value. Decodes any value understood by `Boolean.valueOf(str)`.

#### Integer

Stores Long value, which can be interpreted as long, String, Integer or BigDecimal.

#### Number

Stores BigDecimal value, which can be interpreted as BigDecimal, long, int, double or String. Can decode numbers with
either **. (dot)** or **, (comma)** decimal separators.

#### Date

Stores Date object. When decoding, tries to guess format of date using following patterns:

* dd-MM-yyyy
* dd.MM.yyyy
* dd/MM/yyyy
* yyyy-MM-dd
* yyyy.MM.dd
* yyyy/MM/dd

#### String

Default type, stores plain string.