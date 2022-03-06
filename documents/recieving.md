
``` plantuml
title recieving

left to right direction

usecase "新規作成" as create
usecase "一覧参照" as list
usecase "編集" as edit
usecase "削除" as delete
User --> create
User --> list

list ..> edit : extend
list ..> delete : extend
 
```


