---
layout: doc
title: SmartParam Level Creator
---

# Level creator

Level creator is a special type of [function](/doc/function.html), which is used to extract values from
[ParamContext](/doc/param-context.html). For a function to be used as a level creator, it has to follow
level creator convention:

* accept only one argument - subclass of ParamContext
* return object of type compatible with level type that it will be used on

```java
<level type> levelCreator(ParamContext context) {
    /*...*/
}
```

Level creator does not have to be Java function. It can be written in any language supported by ParamEngine instance.
It also does not have to be a simple find&return function. Level creator might apply some preprocessing or
perform a database lookup. However be careful with *fat* level creators as complexity of these functions directly affects
parameter evaluation time.

## Usage

Lets define parameter with single input level that will be using level creator:

```xml
{
    name: "paramtereWithLevelCreator",
    inputLevels: 1,
    levels: [
        {name: "userLogin", type: "string", levelCreator: "user.login"},
        {name: "someOutput", type: "string"}
    ]
}
userLogin;someOutput
nial;Hello Nial!
```

Level `userLogin` uses `user.login` function as its level creator. Assuming this function is defined in Java:

```java
public class LevelCreators {

    @JavaPlugin("user.login")
    public String userLogin(DefaultContext context) {
        User user = context.get(User.class).login();
    }
}
```

`user.login` level creator looks for `User` class object in context and returns user login.