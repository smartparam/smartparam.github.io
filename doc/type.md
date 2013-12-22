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

Depending on type, there are 3 different ways to create custom type. When total
control is needed, you might need to implement it from scratch. For simple types,
it's enough to implement decoding/encoding features.

All custom types should be annotated with `org.smartparam.engine.annotated.annotations.Type`
to enable automatic discovery.

### Implementing from scratch

Implement `org.smartparam.engine.core.type.ValueHolder` class to create raw value holder.
Holder is responsible for containing and performing operations on raw value,
encapsulating any information about value state (is it null? is it comparable?).
It also has accessor methods that might return different representations of value,
for example Date can be represented as long by returning number of milliseconds.
You can extend `org.smartparam.engine.core.type.AbstractValueHolder` to get
default implementation for most of methods.

Implement `org.smartparam.core.type.Type`, interface responsible for encoding
and decoding string representation from/to concrete ValueHolder.

### Implementing with AbstractType

Type has some methods that are very important performance-wise, but you might
not need to customize them. If you need a solid, default implementation extend
`org.smartparam.engine.core.type.AbstractType`. Using this method is preferred if
you want to keep control over ValueHolder.

### Simple implementation

Most of the times you will need Type to contain a simple value object used widely
across the application. If so, extend `org.smartparam.engine.core.type.SimpleType`
which already provides default ValueHolder implementation.

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