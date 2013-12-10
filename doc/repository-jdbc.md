---
layout: doc
title: SmartParam JDBC Repository
---

# JDBC repository

JDBC repository allows to use relational database as parameter storage. It is powered by 
[PolyJDBC](http://polyjdbc.org) - lightweight, poly-dialect JDBC wrapper that came to life by moving parts of low-level
JDBC code from JDBC repository to separate project.

JDBC repository is fully dependent on PolyJDBC and shares it's capabilities, the most important being supported dialects.
Currently supported dialects are:

* H2
* PostreSQL
* MySQL

## Dependencies

```xml
<dependency>
    <groupId>org.smartparam</groupId>
    <artifactId>smartparam-repository-jdbc</artifactId>
    <version>{{site.data.version.current}}</version>
</dependency>
```

## Usage

```java
import static org.smartparam.repository.jdbc.config.JdbcConfigBuilder.jdbcConfig;
import static org.smartparam.repository.jdbc.JdbcParamRepositoryFactory.jdbcRepository;

/*...*/

DataSource dataSource = /* you should have one somewhere.. */

JdbcConfig jdbcConfig = jdbcConfig().withDialect(DialectRegistry.H2.getDialect()).build();
JdbcParamRepository jdbcRepository = jdbcRepository(dataSource, jdbcConfig);
```

## Behavior

When ParamEngine is created, JDBC repository checks connected database for existence of it's tables. If none detected,
they are created along with indexes, foreign keys and sequences. Database entities naming can be configured.

When using JDBC repository as a standalone repository (i.e. with transferer) you need to call `jdbcRepository.initialize()`
to trigger database schema checking.

### Database structure

JDBC repository uses 3 entities (plus sequences, if applicable) to store parameter data. Two of them, storing parameter metadata
(parameter and levels) are basic, self-explanatory tables. Third, storing parameter entries is denormalized for
performance reasons.

All parameter entries are stored in single table with N columns (where by default N = 8). Each column
represents value of a single parameter level. If there are more than N levels defined, all excess level values are
concatenated and stored in Nth column. As an example, parameter entry table for N = 2:

| entry levels | level0 | level1 |
|--------------|--------|--------|
| [1, 2]       | 1      | 2      |
| [1, 2, 3]    | 1      | 2;3    |

N = 8 is a sensible default coming from analysis of SmartParam usage in real-life production software. However this setting can
be tuned to better reflect nature of specific application. For cached parameters this setting has (almost) no effect.

When using JDBC repository be careful with characters used in high-numbered levels. Since by default **;** (semicolon) is
used as excess level separator, it can not be present in high-numbered level values. If you need to use semicolon a lot,
consider changing default separator value.

## Configuration

When constructing `JdbcConfig` object using `JdbcConfigBuilder` you must specify **dialect**, which has no default value.
If no dialect specified, JDBC repository will throw an exception on initialization. Additional configuration options:

| option               | description                                                                                         | default value   |
|----------------------|-----------------------------------------------------------------------------------------------------|-----------------|
| entityPrefix         | prefix added when creating database entities names                                                  | sp_             |
| sequencePrefix       | prefix added when creating database sequence names (if appropriate for database)                    | seq_            |
| parameterSufix       | sufix appended to prefixes when creating parameter-related entities                                 | parameter       |
| levelSufix           | sufix appended to prefixes when creating level-related entities                                     | level           |
| parameterEntrySufix  | sufix appended to prefixes when creating entry-related entities                                     | parameter_entry |
| levelColumnCount     | number of explicit columns in parameter entry entity                                                | 8               |
| excessLevelSeparator | separator symbol used when concatenating values of levels with index higher than level column count | ;               |
