## 关于构建流程的说明

工程是基于gulp、webpack、npm scripts脚本共同维护的构建任务。



#### 目录说明

所有的开发目录都在**src**目录下，

src目录下有三个子目录：static、components、pages

- static主要用来存放全局的js、css、img等资源
  - 里面包括js目录、css目录、img目录等。
- components暂时还没有内容，为以后考录用的
- pages目录是所有的业务逻辑都在这里。包含app和reflow两个目录
  - app目录主要是用来存放端内H5页面的
  - reflow主要是用来存放回流页H5页面的



app（reflow）目录详解

- 每个子文件夹都是具体的业务页面，比如说电影排行榜页面
  - components：可能没有内容
  - images：可能没有内容
  - *.less
  - *.js文件

其他同级目录里的内容类似。



src同级目录中又一个**routes**目录，当我们添加新的路径时，需要在其中的文件添加相应的路由内容。

目录里只有一个文件index.js，使用koa-router模块进行解析的。但是可能会有一些“坑”，暂时只发现了一条。

- 当路由有相同的前缀时，比如`/agreement`和`/agreement/test`路由，在上下位置不同时，匹配的结果不同。但是现在**好像没有这个问题**，但是如果以后发现路由对应的页面不对时，可以考虑这个问题。



服务端怎么查找资源决定了我们的构建工具怎么输出。现有的资源定位是html都需要放到**views**目录下，静态资源(js、css、img等)都需要放到**public**下。

我们做如下规定：

- public目录结构里只有static，static中包括一些静态的资源对应的目录：js、css、img(image)等
  - js目录里的结构
    - 共用的js结构跟src/static/js里的目录层次是一样的
    - page页面专用的js跟src/pages里的js文件层次是一样的
  - css里的结构
    - 共用的样式结构跟src/static/css里的目录层次是一样的
    - page页面专用的css样式跟src/pages里的样式层次是一样的
  - img里的结构：
  - 同上

- views目录里的结构跟src中html的层次是一样的，比如：

  - src中的html目录层次是： src/pages/app/agreement/index.html
  - views中相应的目录层次也是：views/pages/app/agreement/index.html

  当我们拷贝src目录下的html到views目录时，我们还需要处理引用的文件，比如说js、css、图片等的引用，都需要在这时处理。

  - 现在的处理方式时，当引用是`.`开头时，我们会进行路径替换，其他的路径我们不做处理。

    - 因为有绝对路径

    - 还有cdn静态路径



目录结构决定着我们如何打包。不同资源对应着不同的目录，决定着我们需要根据资源类型来做编译打包的工作。

1. less文件使用gulp的gulp-less插件进行转换，同时还进行转换后文件的目录迁移。

- 首先使用less进行转换，
- 然后使用autoprefix添加浏览器支持字段
- 组后经文件放到public目录下

2. html文件使用gulp和gulp-cheerios进行文件迁移和内容替换。

- 使用cheerio处理html，然后我们会在函数里进行img、css、js的路径的替换操作
  - 在run函数里我们可以使用 **$** 选择相应的DOM节点然后处理
  - 还需要添加parserOptions字段，同时将parserOptions.decodeEntities字段设置为false
- 然后将文件拷贝到views目录下

3. js文件使用webpack进行处理和文件拷贝

- webpack本身可以自己运行处理我们的内容，但是之前只是用来处理单页面应用里，没有处理过多页面应用，实际上也是可以的，我们这个工程就是使用webpack处理多页面应用的。
- 首先我们需要使用glob库来引入多页面入口
- 然后将我们的多页面入口合并到webpack.config.js中的entry字段。
- 然后决定输出目录output

还有其他的资源现在还没有添加，因为还没有用到，以后会用到。



最后就是将这些编译、构建、打包流程组织起来使用。我们使用npm scripts来组织这些流程。

基本是算是有3个主要流程

- 启动服务器：使用gulp-nodemon来启动服务器，
  - 当监听到js、css、less、html文件变化时重新启动服务
  - 但是不包括log、node_modules、src、public目录里的文件
- webpack监听js文件变化
  - 监听src/pages目录下js文件的变化，然后进行编译和打包
- 执行gulp各个流程
  - 监听less文件变化
  - 监听html文件变化
  - 监听js文件变化，这里的文件是指src/static/js里js文件的变化，然后拷贝到指定目录下



build

- 真时上线时，需要给相应的文件加上hash的也就是md5，这样当升级文件时就不会覆盖原来的文件了，虽然会占用硬盘空间，但是还可以忍受。
- 加md5时，需要知道md5是怎么得出来的，一般是根据文件内容做一次hash运算得出来的。也就是说当文件内容没有变化时，两次的md5值是相同的。
- 加md5的一般都是静态资源，比如说css、js、image等。所以加md5时会有先后顺序，比如说，css引入了image，如果图片名加了md5，则css中相应的文件也需要加上md5，这时css文件就发生了变化，所以需要在给css文件名加md5前，先给图片名加md5。然后替换css中图片为加过md5后的图片。
- 所以在给文件名加md5前，需要先分析__文件依赖__，这也是所有的打包工具关注的重点之一。因为web最初的设计就是找到相应的资源。知道文件依赖就是为了找到资源。
- 当前工程打包会打包出两种类型的文件，一种是html，一种是静态资源文件。所有的静态文件都会build到一个固定的目录下，html也会打包到一个目录下。
  - 因为开发时使用的是koa-generator工具创建的MVC框架，而线上服务使用的是egg.js框架。两个框架的目录安排不同，而开发时也有自己的目录结构。
  - 开发时主要在src目录中开发，然后将相应的文件移动到koa框架特定的目录下。（其它的开发框架也会默认开启一个server，使用某种框架，比如webpack启动热更新时，启动的是express服务框架。开发时会将不同的文件放到express特定的目录下。头条根据百度的fis开发的mya也是内置了一个python框架，然后开发时将文件移动到指定的目录下。
  - 打包主要是为上线做准备，所以线上的文件资源安排，决定了打包时的文件目录结构。
    - 分析文件依赖
      - html—>js、css、image
      - css—>image
    - 先给图片名添加md5，然后替换css文件中的图片名称
    - 然后给css、js文件名添加md5
    - 最后替换html文件中的静态资源文件名。
  - 上线只需要将文件移动到相应的目录就可以了





关于打包工具的一些理解：

- 所谓的打包工具就是将文件打包到指定的路径下，同时将文件里的路径替换为正确的路径
- 开发时可以运行，实际上都是起了一个本地的服务器，然后将我们刚才编译打包的文件放到我们起的服务指定的目录下（实际上还是需要分开的，静态资源和html一般还需要分开。html文件放到一些服务起上，而静态文件需要放到静态文件服务器上，比如说nginx上，或者cdn上）



> 说明：
- node：10.6.0
- gulp： "^3.9.1"
