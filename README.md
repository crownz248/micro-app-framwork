# micro-app-framwork

## 使用方法

安装apache、node

```shell
yum install httpd nodejs
apt-get install httpd nodejs
```

将该仓库git clone至/var/www/html目录下（或指定的apache目录下）

```shell
cd /var/www/html
git clone https://github.com/crownz248/micro-app-framwork.git
```

安装nodejs依赖

```shell
cd micro-app-framwork
npm install
```

编译源码，编译后的源码在dist文件夹下，若未对源码进行修改，可忽略该步骤

```shell
npm run build
```

通过apache服务直接访问index.html即可

详细用法请见[使用说明](https://github.com/crownz248/micro-app-framwork/edit/main/doc/使用说明.md)

设计思路请见[设计文档](https://github.com/crownz248/micro-app-framwork/edit/main/doc/设计文档.md)


成果展示请见[成果展示.docx](https://github.com/crownz248/micro-app-framwork/edit/main/doc/成果展示.docx)、[成果展示.pdf](https://github.com/crownz248/micro-app-framwork/edit/main/doc/成果展示.pdf)











