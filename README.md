
# usage

```sh
node index.js README.md
```

![img](test_graph.png)

<details><summary>code</summary>

```dot test_graph.png
  digraph {
    rankdir=LR;
    node [fontname=monospace shape=box color=white]
    nodesep=0.3;
    subgraph {
      node [shape=box style="filled" fillcolor="#00ff0025" ]
      AppMetricsProbe
      GrapqlProbe
      HttpProbe
    }
    subgraph {
      node [shape=box style="filled" fillcolor="#ff000025" ]
      ConsoleSink
      InfluxdbSink
    }
    subgraph {
      node [shape=box style="filled" fillcolor="#0000ff25" ]
      BasicTagger
      SomeFilter
    }

    AppMetricsProbe -> SomeFilter -> BasicTagger
    HttpProbe -> BasicTagger
    GrapqlProbe -> BasicTagger
    BasicTagger -> ConsoleSink
    BasicTagger -> InfluxdbSink
  }
```

</details>
