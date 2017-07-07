## 配置
```
|-安装yo
  |-- npm install -g yo
|-安装 generator-react-webpack  
  |-- npm install -g generator-react-webpack
  |-- 版本查询： npm ls -g --depth=1 2>/dev/null | grep generator-
```

## 创建项目
```
yo react-webpack gallery-by-react(项目名)
```

##插件 
```
npm install postcss-loader autoprefixer --save-dev
npm install json-loader --save-dev
```

##编辑打包
```
npm start
npm run dist
```
##发布
```
git add dist
git commit -m 'add dist'
git subtree push --prefix=dist origin gh-pages
```