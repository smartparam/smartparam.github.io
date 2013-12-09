---
layout: page
title: SmartParam
---

# SmartParam demonstration

Along with SmartParam we published [demo application](https://github.com/smartparam/smartparam-demo).
It is a set of demos that showcase main features of SmartParam in action. Each demonstration starts with
creating and configuring ParamEngine instance and ends with showing result of action.

Under the hood, each demonstration is a test method run by **TestNG**. They all adhere to *given, when, then*
convention for clarity.

## Running demos

First, fetch demo app sources

```
    git clone https://github.com/smartparam/smartparam-demo.git
```

Navigate to demo case, for example **SimpleParameterUsageDemo** and run it as a unit test in your IDE.
Logging is configured so that you should see all debug messages in console output.

## Why tests?

Before this approach, we tried building real-life app that would demonstrate real-life usage. In the end it turned out
that building real app:

* is time consuming and slow
* generates lots of code that hides SmartParam
* is hard to follow when you just want to see how it should be done

This is actually feedback from one of our early-adopters Pawel (check out his [project](http://javers.org)). He also suggested
that we try somethng lighter. Something like tests, which are:

* self-explainatory (using given, when, then and proper test naming)
* compact - feature is demonstrated using few lines of code
* tests! meaning we get extra layer of integration tests when writing docs :)
