#!/bin/sh
cd E:\\_Coding\\my-projects\\Node.js\\node-todo\\logs
cp access.log $(date +%Y-%m-%d).access.log # 复制 acces log 的内容到 指定的文件中
echo "" > access.log # 清空原始 log的文件内容