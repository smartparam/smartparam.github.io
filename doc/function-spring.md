---
layout: doc
title: SmartParam Spring Function
---

# Spring Function

Support for invoking methods in context of initialized Spring beans is implemented
in Spring integration module.

## Dependencies

```xml
<dependency>
    <groupId>org.smartparam</groupId>
    <artifactId>smartparam-spring</artifactId>
    <version>{{site.data.version.current}}</version>
</dependency>
```

## Usage

`org.smartparam.spring.SpringModule` needs to be registered in configuration builder
when creating ParamEngine:

```java
ParamEngineConfig engineConfig = ParamEngineConfigBuilder.paramEngineConfig()
                .withAnnotationScanEnabled("com.example.plugins")
                .registerModule(new SpringModule(applicationContext))
                .build();
```

To register function, annotate it with `@SpringPlugin`, i.e:

```java
@Component
public void SpringPluginClass {

    private final DateProvider dateProvider;

    @Autowired
    public SpringPluginClass(DateProvider dateProvider) {
        this.dateProvider = dateProvider;
    }

    @SpringPlugin("currentDate")
    public Date currentDate() {
        return dateProvider.today();
    }

}
```

Remember that `com.example.plugins` has to be added to [scanned paths](/doc/engine.html).

## Behavior

On function creation, name of bean is extracted using `org.springframework.context.annotation.AnnotationBeanNameGenerator`.
Later when function is invoked bean with given name is extracted from ApplicationContext
and function is invoked on this bean.