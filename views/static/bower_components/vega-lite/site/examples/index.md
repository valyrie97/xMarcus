---
layout: page
menu: examples
title: Example Gallery
permalink: /examples/
---

This page shows example specifications for different types of graphics.
To see example code for embedding visualizations in a webpage, please read the [embed documentation](../usage/embed.html).


* TOC
{:toc}

{% for group in site.data.examples %}
## {{ group[0] }}
<span class="gallery">{% for spec in group[1] %}{% include preview.html spec=spec.name title=spec.title style=spec.style png=spec.png %}{% endfor %}</span>
{% endfor %}

## Community Examples

Here we list great examples of Vega-Lite visualizations that were created by the community. Please help us expand this gallery by [forking our example block](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9) and sending us a [pull request](https://github.com/vega/vega-lite/edit/master/site/examples/index.md) with your example added to this list.

* Many visualizations in the book [Making Data Visual](https://makingdatavisual.github.io/figurelist.html) by Danyel Fisher and Miriah Meyer are made with Vega-Lite
* [Grouped Bar Chart](https://bl.ocks.org/domoritz/f5abc519dd990bfcbc3f20f634658364) by @churtado
* [Bar Chart with Negative Values](https://bl.ocks.org/digi0ps/3691287ab4033509e988d67c932fca47) by @digi0ps
* [Multi Line Highlight](https://bl.ocks.org/amitkaps/fe4238e716db53930b2f1a70d3401701) by @amitkaps
* [Slope graph](https://bl.ocks.org/g3o2/a6c539eacfb0b99eaf01e4f20b9f2897) by @g3o2
* [Scatter Nearest Rule](https://bl.ocks.org/amitkaps/abfa7157d4366cc43cbbba55353d35d8) by @amitkaps
* [Scatter Brush Rule](https://bl.ocks.org/amitkaps/a484b94a7e1e0705c5ec865ba31f463c) by @amitkaps
* [Unit Chart Rectangular](https://bl.ocks.org/amitkaps/d6648bd8ddb1c1e3706d7530126d1e2b) by @amitkaps
* [Unit Chart Stacked](https://bl.ocks.org/amitkaps/cdc7dacd8f7d9f2a9cff4b10d3279b86) by @amitkaps
* [Unit Chart Small Multiple](https://bl.ocks.org/amitkaps/67bd6dcb2af300a2b76f1e2351c1afdc) by @amitkaps
* [Dot-dash plot](https://bl.ocks.org/g3o2/bd4362574137061c243a2994ba648fb8) by @g3o2
* [Cumulative Wikipedia Donations](https://bl.ocks.org/domoritz/bef687de0e2dba1f522f674c260ac17f) by @domoritz
* [CO2 Concentration in the Atmosphere](https://bl.ocks.org/domoritz/4e3289f9266fb3ef7e9baa201060361b) by @domoritz
* [Horizontal Stacked Bar Chart with Labels](https://bl.ocks.org/pratapvardhan/00800a4981d43a84efdba0c4cf8ee2e1) by @pratapvardhan
* [Interactive stacked time-series](https://bl.ocks.org/jakevdp/1643ebb6853e76c32e47a969f415f3ea) by @jakevdp
* [Bicycle Count Time-series with Dynamic Scale](https://bl.ocks.org/jakevdp/b511d09ed4e2797234bd6236d7b428f7) by @jakevdp
* [Vega-Lite downloads](https://bl.ocks.org/domoritz/81008b55ae2e2649eb42f600440f87d2) by @domoritz
* [Interactive Exploration of Seattle Weather](https://bl.ocks.org/jakevdp/5d1915d808d3d91ce86f0bc3ca066d48) by @jakevdp