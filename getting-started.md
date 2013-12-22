---
layout: page
title: SmartParam
---

# Getting started

## Dependencies

SmartParam releases can be fetched from [Maven Central](http://maven.org) by adding following dependency to pom.xml:

```xml
<dependency>
    <groupId>org.smartparam</groupId>
    <artifactId>smartparam-engine</artifactId>
    <version>{{site.data.version.current}}</version>
</dependency>
```

This will fetch only core engine module. In order to utilize SmartParam, you need to choose parameter repository.
Easiest way to integrate your application with SmartParam is to choose [classpath repository](/doc/repository-classpath.html)
(but we have a [JDBC](/doc/repository-jdbc.html) repo too):

```xml
<dependency>
    <groupId>org.smartparam</groupId>
    <artifactId>smartparam-repository-fs</artifactId>
    <version>{{site.data.version.current}}</version>
</dependency>
```

If you do not use Maven or prefer to include raw *.jar files, just download them from [Maven Central](http://maven.org).

## Configuring SmartParam

Lets head on to creating instance of parameter engine - the heart of SmartParam. Examples below assume creation of
param engine that uses classpath repository and has annotation scanning enabled.

**Attention!** Classpath repository needs [reflections](https://code.google.com/p/reflections/) jar in
classpath to work.

### Raw

SmartParam was built with independence in mind. It means that SmartParam does not depend on any framework and can
be deployed with any app - J2SE, J2EE or any other JVM platform. Use `ParamEngineFactory` to create new instance of param
engine:

```java
/*...*/
import static org.smartparam.engine.config.pico.ParamEngineConfigBuilder.paramEngineConfig;
import static org.smartparam.engine.config.pico.PicoParamEngineFactory.paramEngine;
/*...*/

ParamRepository classpathRepository = new ClasspathParamRepository("/param/", ".*\\.param$");
PicoParamEngineConfig config = paramEngineConfig()
    .withAnnotationScanEnabled()
    .withParameterRepositories(classpathRepository).build();
ParamEngine paramEngine = paramEngine(config);
```

### Spring

Nevermind independence, lots of people use Spring Framework and want libraries to fit in nicely. Thats why SmartParam
comes with [Spring integration module](/doc/function-spring.html):

```xml
<dependency>
    <groupId>org.smartparam</groupId>
    <artifactId>smartparam-spring</artifactId>
    <version>{{site.data.version.current}}</version>
</dependency>
```

which, among other extensions, contains Spring-compatible param engine factory. Sample XML configuration:

```xml
<bean id="paramEngine" class="org.smartparam.spring.SpringParamEngineFactory">
    <property name="paramRepository">
        <bean class="org.smartparam.repository.fs.ClasspathParamRepository">
            <constructor-arg index="0" value="/param/"/>
            <constructor-arg index="1" value=".*\\.param$"/>
        </bean>
    </property>
    <property name="scanAnnotations" value="true"/>
    <property name="packagesToScan">
        <list>
            <value>org.smartparam.spring</value>
        </list>
    </property>
</bean>
```

Still, since Spring XML is not fit to creating complex beans, consider implementing **FactoryBean** to inject SmartParam into
Spring context.

## Defining parameter

Create **param** directory in classpath root (in Maven projects preferably in *other sources*). This will be the root
directory for classpath-based repository. To define new parameter, simply create new **.param** file. Sample content of
*customerDiscount.param*:

```
{
    name: "customerDiscount",
    inputLevels: 2,
    levels: [
        {name: "date", type: "date", matcher: "between/ie"},
        {name: "customerType", type: "string"},
        {name: "discount", type: "integer"}
    ]
}
date;customerType;discount
*:2013-02-01;BUSINESS;10
*:2013-02-01;STANDARD:5
2013-02-01:2013-03-01;BUSINESS;25
2013-02-01:2013-03-01;STANDARD;10
 *;*;0
```

Sample parameter is one-to-one SmartParam representation of parameter presented on [home page](/).

First part of a SmartParam serialized parameter file is parameter **metadata** (header), written in JSON.
Quick explanation of metadata fields:

* name - repository-wide unique identifier of parameter, used to access it from application
* inputLevels - number of levels, that should be matched against queries
* levels - array of level definitions, only **type** field is mandatory
* level matcher - custom filter, in this case it matches values that are contained in given range

Second part, **parameter entries**, is stored in CSV format which uses semicolon (**;**) as delimiter. CSV format was chosen because
of very small overhead (parameters might contain millions of entries) and because it is easily understandable by non-programmers.
Each CSV column is mapped to respective level defined in metadata. CSV header has no functional impact and is
included only for readability concerns (it can't be omitted though, as parser strips off first row). You can read more
about serialization [here](/doc/serialization.html).

### Getting parameter value

```java
private ParamEngine paramEngine;

/* ... */

public int discount(Date date, String customerType) {
    return paramEngine.get("customerDiscount", date, customerType).get();
}
```

## What just happened?

During param engine creation classpath repository scanned all resources in given directory matching files against
provided pattern and searching for parameters. Only the name of parameter specified in metadata
matters when calling `paramEngine.get(...)`. Parameter engine takes query vector `[date, customerType]` and finds any
parameter entries that match. As a result, part of a parameter matrix wrapped in **ParamValue** object is returned.
**ParamValue** contains few convenience methods, one of them being **get()**, which returns single value
(first value from first row).

## More info

This is the most basic way of getting parameter value out, but there is a lot more. Check out documentation
to learn more about [domain](/doc/domain.html) and to find out how to use [ParamContext](/doc/param-context.html)
and [level creators](/doc/level-creator.html).
