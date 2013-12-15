---
layout: doc
title: SmartParam Function
---

# Function/plugin

SmartParam comes with bulitin dynamic function invokers. Function is a pluggable piece of code that can be invoked
with any arguments and return any type of data. Functions are ideal tool to model and store policies or algorithms
that either have to be versioned or are applied differently depending on circumstances.

## Usage

To invoke function use ParamEngine `callFunction` or `callEvaluatedFunction`. Former simply calls function of given name
with given arguments. Second one first evaluates parameter and interpres parameter output value as a name of
function to call.

## Custom implementation

To create custom implementation of function you need to implement:

#### Function

`org.smartparam.engine.code.function.Function` is an interface representing function. It implementations can define as 
many custom properties as necessary. Function object is loaded from repository and passed on to invoker. Function interface
requires function to have a name (which is unique repository-wide) and type (which determines repository and invoker).

#### Function repository

Function repository (`org.smartparam.engine.core.function.FunctionRepository`) is responsible for function discovery 
and loading. Function repository does not have a name, instead it is registered with name of functions type that it stores.
To automatically register function repository, annotate it with `org.smartparam.engine.annotated.annotations.ParamFunctionRepository`.

#### Function invoker

Function invoker (`org.smartparam.engine.core.function.FunctionInvoker`) is responsible for running the function based
on information it got from implementation of `Function` interface. This is the place where all type-specific magic takes
place (like evaluating Groovy script or retrieving Spring bean to call method on it). Function invoker is identified
by type of functions it is able to invoke. To automatically register function invoker, annotate it with
`org.smartparam.engine.annotated.annotations.ParamFunctionInvoker`.

## Usecase

As an example let's assume we have two categories of customers. Premium customers pay a lot for their status and so 
have other discounting algorithm. Second category is all the rest.  Discounting policies have already been
coded (ignore `@JavaPlugin` for now):

```java
public class DiscountingPolicies() {

    @JavaPlugin("policy.premium")
    public long premium(long discountA, long discountB) {
        return discountA + discountB;
    }
    
    @JavaPlugin("policy.other")
    public long other(long discountA, long discountB) {
        // take lower
        return discountA > discountB ? discountB : discountA;
    }
    
    @JavaPlugin("policy.otherPromotion")
    public long otherPromotion(long discountA, long discountB) {
        // take higher
        return discountA > discountB ? discountA : discountAB;
    }
}
```

Business also wants to introduce special offer periods, when discounts are calculated differently. 
This would be quite complicated if not for SmartParam. Notice the `@JavaPlugin` annotation - this registers annotated method
as Java function under given name. If we already registered functions, let's construct parameter `discountPolicy` that 
will encapsulate this business logic.

| date                  | type    | policy                |
|-----------------------|---------|-----------------------|
| *                     | PREMIUM | policy.premium        |
| *:2013-10-31          | OTHER   | policy.other          |
| 2013-11-01:2013-11-30 | OTHER   | policy.otherPromotion |
| 2013-12-01:*          | OTHER   | policy.other          |

And use it:

```java
long calculateFinalDiscount(Date currentDate, Customer customer, long discountA, long discountB) {
    return (long) paramEngine.callEvaluatedFunction("discountPolicy",
            new LevelValues(currentDate, customer.type()), discountA, discountB);
}

```

What just happened? ParamEngine function `callEvaluatedFunction` first evaluates given parameter using provided context.
Parameter should return single string value, being function name. It is immediately called with arguments provided and
function invocation value is returned.

This example purposely avoids using parameter evaluation context with level creators. To see how to implement it in 
more robust way read about [level creators](/dev/level-creator.html) and [evaluation context](/doc/param-context.html).