---
layout: doc
title: SmartParam Filesystem Repository
---

# Filesystem repository

Filesystem repository reads parameters from files in given path. This read-only
repository might be used to keep server-specific parameters that override
defaults.

## Dependencies

```xml
<dependency>
    <groupId>org.smartparam</groupId>
    <artifactId>smartparam-repository-fs</artifactId>
    <version>{{site.data.version.current}}</version>
</dependency>
```

## Usage

```
FSParamRepository fsRepository = new FSParamRepository("~/.server/param/", ".*\\.param$");
```

Note, that second argument of filesystem repository constructor is Java Regexp,
not Ant path.

## Behavior

Filesystem repository performs recurrent scan of provided directory, reading all
files that match the regular expression and deserializing them into parameters.
It is possible to use overloaded constructor to pass own implementation of
deserializer, by default deserializer from `smartparam-serializer` is used.

File name is not important, only parameter name matters. [Serialization format](/doc/serialization-format.html).