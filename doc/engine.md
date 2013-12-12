---
layout: doc
title: SmartParam Engine
---

# ParamEngine

`ParamEngine` is central class of SmartParam and serves as single point of entry for parameter evaluation.

## Dependencies

```xml
<dependency>
    <groupId>org.smartparam</groupId>
    <artifactId>smartparam-engine</artifactId>
    <version>{{site.data.version.current}}</version>
</dependency>
```

## Usage

Quickest way to get ParamEngine up and running assuming you already have parameter repositories defined:

```java
ParamEngineConfig engineConfig = ParamEngineConfigBuilder.paramEngineConfig()
    .withAnnotationScanEnabled()
    .withParameterRepositories(/* insert repositories */).build();

ParamEngine engine = ParamEngineFactory.paramEngine(engineConfig);
```

ParamEngine must have at least one parameter repository, there is no default repository defined.

### Annotation scanning

SmartParam uses annotation scanning to register default and user defined entities. Annotation scanning is
enabled by using `.withAnnotationScanEnabled()` method on configuration builder. This method takes varargs `String...`
argument that should be used to specify custom package prefixes that should be scanned on ParamEngine creation in
search of SmartParam annotations, i.e.:

```java
.withAnnotationScanEnabled("com.mysoftware.param", "org.smartparamextensions")
```

First user provided packages are scanned, then default package `org.smartparam.engine`. Custom entities override defaults
registered under the same name/code, so it is possible to cherry-pick default implementations if needed.

### Customizing configuration

Configuration builder exposes methods for registering all domain entities and services in instance of ParamEngine. If
options exposed by builder are not enough, it is possible to construct own ParamEngine dependency tree and replace any
part of it.

### Accessing runtime configuration

ParamEngine exposes `runtimeConfiguration()` method which returns immutable snapshot of all important services and repositories.
This is recommended way of accessing parameter and function cache to invalidate their contents when needed.