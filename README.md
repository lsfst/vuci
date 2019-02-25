# vuci

This project is from https://github.com/zhaojh329/vuci.

![](https://img.shields.io/badge/license-LGPL2-brightgreen.svg?style=plastic "License")

![](/screen-be6656a.gif)

# [Comparison between vuejs and other frameworks](https://vuejs.org/v2/guide/comparison.html)

# How to use
Add new feed into "feeds.conf.default":
    
    src-git vuci https://github.com/zhaojh329/vuci.git

Install vuci packages:
    
    ./scripts/feeds update
    ./scripts/feeds install -a -p vuci

Select package vuci in menuconfig and compile new image.

    VUCI  --->
        <*>  vuci-ui-base. VUCI Web Interface</*>

Compile

    make V=s

# How to develop and debug
First, clone the code to your desktop system.

	cd vuci/vuci-ui-base/src

Then modify the configuration file according to your own environment.
You may need to modify proxy.

	vi vue.config.js

Then execute the following command to start the debug server

	npm run serve

