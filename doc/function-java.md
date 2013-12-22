---
layout: doc
title: SmartParam Java Function
---

# Java Function

By default ParamEngine is capable of invoking Java methods defined in objects.

## Usage

To register function, annotate it with `@JavaPlugin`, i.e:

```java
package com.example.plugins;

public class PluginClass {

    private PluginClass() {
        // we need a no-arg constructor
    }

    @JavaPlugin("myPluginName")
    public String sayHello(String name) {
        return "Hello " + name + "!";
    }

}
```

Remember that `com.example.plugins` has to be added to [scanned paths](/doc/engine.html).
Containing class needs to have a non-arg constructor defined.


## Behavior

On function invocation, `JavaFunctionInvoker` looks for an instance of host class
in its instance cache. If none found, a new one is created using no-arg constructor
(does not need to be public). Afterwards method is invoked on this object instance.