---
layout: tutorial
title: SmartParam Tutorial - First Function
---

# Step 2: First Function

After this step you should know how to:

* define Java and Spring function
* call function using ParamEngine
* call function directly after parameter evaluation

Among business requirements listed in [step 0](/tutorial/step-0-introduction.html) one says about implementing different
policies for joining two discounts. We are going to implement those policies as SmartParam functions.

## Functions

SmartParam supports calling isolated functions and using them as plugins. Function can be defined in any JVM language
as long as there is an implementation of invoker capable of calling it. For more technical details on functions read
[documentation](/doc/function.html). In this tutorial step I am going to show how to use bundled function implementations
in practice.

## Defining Java function

Tutorial project has an interface `MultiDiscountPolicy` for combining values of 2 discounts. Let's implement first policy,
that returns sum of two discounts:

```java
public class SumDiscountsPolicy implements MultiDiscountPolicy {

    @Override
    @JavaPlugin("discount.policy.sum")
    public Discount combine(Discount discountA, Discount discountB) {
        return new Discount(discountA.value() + discountB.value());
    }

}

```

You probably noticed, that overriden function has a new annotation on top of it: `@JavaPlugin`. By placing this annotation
on a method, you tell function repository to register this method under `discount.policy.sum` name. And thats it! If you
wonder what happens under the hood, check out [Java function documentation](/doc/function-java.html).

## Defining Spring function

Second policy, choosing higher discount, is going to be implemented as Spring function. Before starting with implementation, we
need to add Spring integration module to dependencies:

```xml
<dependency>
    <groupId>org.smartparam</groupId>
    <artifactId>smartparam-spring</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

And configure Spring in ParamEngine (in `RootContext.java`):

```java
ParamEngineConfig config = ParamEngineConfigBuilder.paramEngineConfig()
                .registerModule(new SpringModule(applicationContext))
                .withParameterRepositories(repository)
                .build();
```

ParamEngine configuration has a concept of **modules** that are helpful in encapsulating registration steps for more
sophisticated modules. Spring module needs to have *applicationContext* to extract Spring beans from it.

Now let's implement the *choose higher* policy:

```java
@Service
public class ChooseHigherDiscountPolicy implements MultiDiscountPolicy {

    @Override
    @SpringPlugin("discount.policy.chooseHigher")
    public Discount combine(Discount discountA, Discount discountB) {
        return discountA.value() >= discountB.value() ? discountA : discountB;
    }

}

```

Just as with Java function, all you need to do to register a Spring function is annotate Spring bean method with `@SpringPlugin`.
[Documentation](/doc/function-spring.html) describes Spring functions in more details.

## Spring vs Java

What is the difference between Spring and Java function? Spring function invokes annotated method in context of Spring bean
extracted from `ApplicationContext`. This is initialized bean with all autowired dependencies in place. On the other hand,
Java function is invoked on new instance of parent class, so this class needs to have a no-arg constructor (doesn't have
to be public). Pseudocode below shows function invocation logic:

```java
// Java:
(new SumDiscountsPolicy()).combine(...);

// Spring:
(applicationContext.getBean(ChooseHigherDiscountPolicy)).combine(...);
```

## Using functions

ParamEngine exposes a method to call any function:

```java
Object functionReturnValue = paramEngine.callFunction("functionName", Object... args);
```

Let's use it in `DiscountCalculator` to combine two discounts using *choose higher* policy:

```java
public Discount calculateForUser(User user) {
    long loyaltyDiscountValue = paramEngine.get("discount.loyalty",
                user.registrationDate().toDate(),
                user.accountType().name()
            ).getLong();
    Discount loyaltyDiscount = new Discount(loyaltyDiscountValue);

    long targetedDiscountValue = paramEngine.get("discount.targeted",
                dateProvider.currentDate().toDate(),
                user.login().value()
            ).getLong();
    Discount targetedDiscount = new Discount(targetedDiscountValue);

    Discount combinedDiscount = (Discount) paramEngine.callFunction("discount.policy.chooseHigher",
            loyaltyDiscount, targetedDiscount);
    return combinedDiscount;
}

```

## Parameterizing policies

Business requirements also mention using different policies depending on current date and account type. Let's define
new parameter, **discount-policy.param**:

```
{
    name: "discount.policy",
    inputLevels: 2,
    levels: [
        {name: "date", type: "date", matcher: "between/ie"},
        {name: "accountType", type: "string"},
        {name: "policy", type: "string"}
    ]
}
date;accountType;policy
2013-06-01:2013-06-23;*;discount.policy.sum
*;PREMIUM;discount.policy.sum
*;*;discount.policy.chooseHigher
```

Content of this parameter is not so important (all in all premium users get better policy). Let's see it in action:

```java
String policyFunction = paramEngine.get("discount.policy",
            dateProvider.currentDate().toDate(),
            user.accountType().name()
        ).getString();
Discount combinedDiscount = (Discount) paramEngine.callFunction(policyFunction,
        loyaltyDiscount, targetedDiscount);
```

1. Get function name from newly defined `discount.policy` parameter.
1. Call this function to combine two discounts.

This is really flexible. Discount calculator doesn't need to know about any specific implementations, just policy
function contract (take two discounts and return one). We could change policies in runtime without reloading the app.

## Evaluate & call function

ParamEngine has a convenience method `callEvaluatedFunction` to avoid boilerplate code when calling functions that come 
from evaluation of parameter:

```java
Discount combinedDiscount = (Discount) paramEngine.callEvaluatedFunction("discount.policy",
        new LevelValues(dateProvider.currentDate().toDate(), user.accountType().name()),
        loyaltyDiscount, targetedDiscount);
```

It evaluates parameter of given name using [ParamContext](/doc/param-context.html) (step 3 of tutorial covers contexts)
and interprets the output value as name of function to call.

## Code samples

All code can be found in branch `step-2-first-function` of [tutorial project](https://github.com/smartparam/smartparam-tutorial).