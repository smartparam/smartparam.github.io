---
layout: doc
title: SmartParam ParamContext
---

# ParamContext

Parameter evaluation is always associated with some context, which code manifestation is a subclass of `ParamContext` class.
Every time parameter is evaluated, a context instance is created. Either it is passed in by user, or created by ParamEngine
based on user input. Context role is to generate query vector that is used to evaluate parameter output value.

## Direct query

Simplest implementation of context is an array of values that map one-to-one onto query vector. This is behavior of
`ParamEngine.get(String parameterName, Object... values)`. This is also most intuitive way of querying parameter at first.
It has a major flaw, which is forcing user to know the exact definition of parameter - what are the levels, what is
exact order, what are their types. It is also not very flexible, as each change in parameter requires passing on new
list of query values.

Example of direct query approach:

```xml
{
    name: "user.magicFactor",
    inputLevels: 2,
    levels: [
        {name: "userLogin", type: "string"}
        {name: "userAge", type: "integer"}
        {name: "factor", type: "integer"}
    ]
}
userLogin;userAge;factor
adam;23;125
```

```java
public int evaluateMagicFactor(User user) {
    String login = user.login();
    int age = user.age();

    return paramEngine.get("user.magicFactor", login, age).getInteger();
}
```


## Query with level creators

More sophisticated and preferred approach is to use [level creators](/doc/level-creator.html) to compose query vector
based on content of bag-like context (`DefaultContext` is a default implementation of this type of context). User can
put domain objects into context and it is be level creators role to extract lower level properties out of it.

Example of level creator based approach:

```xml
{
    name: "user.magicFactor",
    inputLevels: 2,
    levels: [
        {name: "userLogin", type: "string", levelCrator: "user.login"}
        {name: "userAge", type: "integer", levelCrator: "user.age"}
        {name: "factor", type: "integer"}
    ]
}
userLogin;userAge;factor
adam;23;125
```

```java
public class UserLevelCreators {

    @JavaPlugin("user.login")
    public String userLogin(DefaultCOntext context) {
        return context.get(User.class).login();
    }

    @JavaPlugin("user.age")
    public int userAge(DefaultCOntext context) {
        return context.get(User.class).age();
    }
}
```

```java
public int evaluateMagicFactor(User user) {
    return paramEngine.get("user.magicFactor", new DefaultCOntext(user)).getInteger();
}
```

Notice, that parameter definition changes - levels have an associated level creator. Now if we ever need to add another
input level to parameter (another dimension), there is no need to change code in `evaluateMagicFactor`. It becomes a matter
of adding new level in parameter definition with proper level creator.

Using level creators with contexts helps avoiding code duplication and boilerplate. Level creator that was once defined
can be reused in other parameters. It encapsulate extraction of lower level properties, so user does not need to repeat
`user.login()` nor `user.age()` all over the code.