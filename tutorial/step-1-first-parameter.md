---
layout: tutorial
title: SmartParam Tutorial - First Parameter
---

# Step 1: First parameter

After this step you should know how to:

* add SmartParam dependencies to the project
* initialize ParamEngine with classpath repository
* create serialized parameter in classpath file
* call ParamEngine to evaluate parameter value

## Importing SmartParam

SmartParam is distributed via [Maven Central](http://maven.org), so all you need to do is
add dependencies to project `pom.xml` (sorry, only Maven is covered here).

First, engine:

```xml
<dependency>
    <groupId>org.smartparam</groupId>
    <artifactId>smartparam-engine</artifactId>
    <version>{{site.data.version.current}}</version>
</dependency>
```

Secondly, repository (FS repository contains both filesystem and classpath implementations):

```xml
<dependency>
    <groupId>org.smartparam</groupId>
    <artifactId>smartparam-repository-fs</artifactId>
    <version>{{site.data.version.current}}</version>
</dependency>
```

[Classpath repository](/doc/repository-classpath.html) requires [relfections](https://code.google.com/p/reflections/)
to be present in classpath, so we need to add this dependency as well:

```xml
<dependency>
    <groupId>org.reflections</groupId>
    <artifactId>reflections</artifactId>
    <version>0.9.9-RC1</version>
</dependency>
```

Rebuild the project and all dependencies should be fetched. Now it's time to make use of freshly imported dependencies.

## Creating ParamEngine instance

**RootContext** class in tutorial application is responsible for instantiating Spring and it is the place where
SmartParam initialization will be defined. Creating ParamEngine is of course a generic piece of code that can be
used in any other place in your real application.

First step is creating the repository. For sake of simplicity for first few tutorial steps we will be using
[Classpath repository](/doc/repository-classpath.html), which accepts serialized parameters defined in text files.

```java
ClasspathParamRepository repository = new ClasspathParamRepository("/param", ".*\\.param$");
```

Repository constructor accepts two arguments: path prefix and regular expression for filtering parameter files.
If you need more information, please read [classpath repository documentation](/doc/repository-classpath.html).

Now we need the ParamEngine itself. Common convention shared among SmartParam modules that have many configuration
options is to define immutable **Config** object and **ConfigBuilder** to construct it. ParamEngine follows this
convention:

```java
ParamEngineConfig config = ParamEngineConfigBuilder.paramEngineConfig()
        .withParameterRepositories(repository)
        .build();
ParamEngine paramEngine = ParamEngineFactory.paramEngine(config);
```

To read more about ParamEngine options see its [documentation](/doc/engine.html).

## Creating first parameter

Now that we have ParamEngine, we need some parameters that make use of it. From business requirements described in
[step 0](/tutorial/step-0-introduction.html) we need two parameters. First one is loyalty discount.

Loyalty discount varies depending on registration date and account type. It will be defined in `/param/discount-loyalty.param`
file located in Maven *other resources*. Serialized parameter has two parts: metadata that describe behavior and
content ([serialization documentation](/doc/serialization.html)). Metadata for loyalty discount is defined in JSON:

```json
{
    name: "discount.loyalty",
    inputLevels: 2,
    levels: [
        {name: "registrationDate", type: "date", matcher: "between/ie"},
        {name: "accountType", type: "string"},
        {name: "value", type: "integer"}
    ]
}
```

This tells ParamEngine, that:

* parameter name is `discount.loyalty`
* it has two input levels
* level definitions are:
    * registration date of type `date`, which is going to use `between/ie` matcher
    * account type of type `string`
    * value of type `integer`

Levels are dimensions (or "columns") of parameter. Input levels tells how many levels define the input
criterias - in this case there are two input levels: registration date and account type. This covers business
requirements ( *Loyalty discount varies depending on registration date and account type.* ). All other levels
are returned by ParamEngine. See [domain](/doc/domain.html) to read about other parameter options.

Now we should define contents of parameter. This contains all conditions that business requires and is defined
in CSV format (with header). By default semicolon is used as value separator. CSV columns map to parameter levels.
Example content of loyalty discount parameter:

```
registrationDate;accountType;value
*:2013-12-01;PREMIUM;20
*:2013-12-01;REGULAR;5
2013-12-01:*;PREMIUM;5
2013-12-01:*;REGULAR;0
```

First row says, that for any user registered in period **between infinity and 2013-12-01, excluding the end date**
with account type **PREMIUM** should get **20%** discount. On the other hand, **REGULAR** account registered during same
period will get only 5% discount (and so on).

To wrap it up, whole parameter definition looks like this:

```
{
    name: "discount.loyalty",
    inputLevels: 2,
    levels: [
        {name: "registrationDate", type: "date", matcher: "between/ie"},
        {name: "accountType", type: "string"},
        {name: "value", type: "integer"}
    ]
}
registrationDate;accountType;value
*:2013-12-01;PREMIUM;20
*:2013-12-01;REGULAR;5
2013-12-01:*;PREMIUM;5
2013-12-01:*;REGULAR;0
```

## Evaluating parameter

Now we can combine ParamEngine and parameter definition to evaluate the output. This should be done
in `DiscountCalculator` class.

```java
public Discount calculateForUser(User user) {
    long discountValue = paramEngine.get("discount.loyalty",
	    user.registrationDate().toDate(),
            user.accountType().name()).getLong();
    return new Discount(discountValue);
}
```

We ask `paramEngine` to get value from parameter `discount.loyalty`. Value to match against patterns of
first input level is user registration date: `user.registrationDate().toDate()`. Second level value is
account type: `user.accountType().name()`. After evaluating the parameter ParamEngine always returns a
submatrix of parameter, which means that it can have multiple columns and rows. In our case we expect only one
integer value. Call `getLong()` to get this value as long and construct `Discount` value object.

This is the most basic method of parameter value evaluation. You have to explicitly define each input level
value. It might be useful, but is also very fragile. Imagine change of requirements, you would have to find
all usages of `discount.loyalty` parameter and change the invocation. In next tutorial step I will show how to use
SmartParam features to avoid this.

## Second parameter

Second parameter, the targeted discount depends on current date and user login. Since the implementation
is more or less the same as of first parameter, treat it as homework. You might want to use `DateProvider`
to get current date.

[Step 2](/tutorial/step-2-first-function.html) source code has the implementation in place.

## Code samples

All code can be found in branch `step-1-first-parameter` of [tutorial project](https://github.com/smartparam/smartparam-tutorial).