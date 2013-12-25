---
layout: tutorial
title: SmartParam Tutorial - Introduction
---

# Step 0: Introduction

Common problem faced by many developers is: "how to parameterize?". Actually, it's really good if
developers are aware of this problem and have some idea of how complex and crucial part of application
this is. Most often people struggle with maintaining custom implementations, which tend to produce a lot
hard to test code.

This tutorial will guide you through building an application based on SmartParam, which has to follow
some business requirements.

## Problem domain

Problem domain is close to a lot of insurance and e-commerce companies - discounting. How to build a dynamic,
elastic discounting system? For use of this tutorial, following business requirements have been defined:

* 2 discounts - loyalty discount and targeted, dynamic per-user discount
* 2 different policies of joining discounts - choosing higher and summing them
* policy should be chosen based on date and user

## Base implementation

Central place of our application is **User**:

```java
public class User {

    private final UserLogin login;

    private final LocalDate registrationDate;

    private final UserAccountType accountType;

    /*...*/
}
```

**UserAccountType** is crucial for parametrisation (different users have different discounts):

```java
public enum UserAccountType {

    REGULAR, PREMIUM;

}
```

Class responsible for calculating discounts is **DiscountCalculator**:

```java
public class DiscountCalculator {

    public Discount calculateForUser(User user) {
        throw new UnsupportedOperationException("Please implement me using SmartParam!");
    }

}
```

This is the place where all the magic will take place. We also defined interface for discount combination 
policy which shall have two implementations later on:

```java
public interface MultiDiscountPolicy {

    Discount combine(Discount discountA, Discount discountB);

}
```


## Code samples

All code can be found in branch `step-0-introduction` of [tutorial project](https://github.com/smartparam/smartparam-tutorial).