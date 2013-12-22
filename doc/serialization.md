---
layout: doc
title: SmartParam Serialization
---

# Serialization

SmartParam comes with bundled parameter serializer (and deserializer) in `smartparam-serializer` project. Serialization
can be used by [repositories](/doc/repository-fs.html) as way to store parameters. It can also be used to transfer
parameters between environments using `smartparam-transferer`.

## Dependencies

```xml
<dependency>
    <groupId>org.smartparam</groupId>
    <artifactId>smartparam-serializer</artifactId>
    <version>{{site.data.version.current}}</version>
</dependency>
```

## Usage

```java
SerializationConfig serializationConfig = SerializationConfigBuilder.serializationConfig().build();

ParamSerializer serializer = ParamSerializerFactory.paramSerializer(serializationConfig);
ParamSerializer deserializer = ParamSerializerFactory.paramDeserializer(serializationConfig);

/* ... */

try {
    serializer.serialize(parameter, writer);
}
catch(ParamSerializationException serializationException) {
    // handle exception
}
```

## Format

Default format used by serializer and deserializer is a mix of JSON and CSV.

* JSON describes parameter metadata, it is descriptive and well established
* parameter entries is stored in CSV, spreadsheet-friendly format understood by analytics with very small overhead

Parameter metadata is a simple JSON object, definition does not have to adhere to strict JSON rules.
Under the hood [gson](https://code.google.com/p/google-gson/) is responsible for serialization and deserialization.

```
{
    name: "parameterName",
    inputLevels: 1,
    cacheable: true,
    nullable: false,
    arraySeparator: ",",
    levels: [
        {name: "level0", type: "type", matcher: "matcher", levelCreator: "levelCreator"}
        {name: "level1", type: "string", array: true}
    ]
}
```

Allowed fields and their names map one-to-one with parameter properties described in [domain documentation](/doc/domain.md).

Parameter content is kept in CSV format **with header**. Applying header might look like repetition of level
names defined in metadata, but it makes content easier to edit and understand. Since each column has a header, maintainer
does not need to know JSON to figure out what is the purpose of value.

```
level0;level1
Hello;Goodbye
```

Content declaration comes right after JSON:

```
{
    name: "parameterName",
    inputLevels: 1,
    cacheable: true,
    nullable: false,
    arraySeparator: ",",
    levels: [
        {name: "level0", type: "type", matcher: "matcher", levelCreator: "levelCreator"},
        {name: "level1", type: "string", array: true}
    ]
}
level0;level1
Hello;Goodbye
```

## Configuration

| option               | description                                                                                          | default value   |
|----------------------|------------------------------------------------------------------------------------------------------|-----------------|
| endOfLine            | what is the end of line character, used by CSV parser                                                | \n              |
| charset              | files charset                                                                                        | UTF-8           |
| csvDelimiter         | delimiter of CSV values                                                                              | ;               |
| csvQuote             | which character serves as quotation mark in CSV, content inside quote is not searched for delimiters | "               |