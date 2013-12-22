---
layout: doc
title: SmartParam Classpath Repository
---

# Classpath repository

Classpath repository scans resources in classpath in search of parameters. Useful
in first stage of development or to keep default values for server-specific
parameters.

## Dependencies

```xml
<dependency>
    <groupId>org.smartparam</groupId>
    <artifactId>smartparam-repository-fs</artifactId>
    <version>{{site.data.version.current}}</version>
</dependency>
```

Except for that, classpath repository needs [relfections](https://code.google.com/p/reflections/)
to be present in classpath ([Maven Central page](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22org.reflections%22)).

## Usage

```java
ClasspathParamRepository classpathRepository = new ClasspathParamRepository("/param/", ".*\\.param$");
```

First constructor argument is a base path of parameter resources, second argument
is a regular expression filter. Only resources which name matches will be interpreted.

## Behavior

Classpath repository performs a recurrent scan on given base path. If resource
matches, it is treated as parameter and deserializer from `smartparam-serializer`
is used to read it.

Resource name is not important, only parameter name matters. [Serialization format](/doc/serialization-format.html).