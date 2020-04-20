# js_resize_img
Create new image size by means of Java Script Native (Изменение размера картинок на нативном java script)
This code working mobile to android, ios (Скрипт работает в мобильных браузерах на android и ios)

This complete front app for resizing image size before upload file to server by means of Java Script Native.

Готовое приложение клиентской части (без обработки на сервере) для изменения размера картинок при загрузке до отправки на сервер

### How Use (Как пользоваться)

Entry point is file index.html (Запуск демо версии через открытие файла index.html)

Input files to insert dynamic. If you want only one input, you can set it in params

Поля для выбора файлов добавляются динамически. Количество полей можно задать в параметре

```sh
const filesLimit = 3;
```

App containt function preview images. If you need just resize image functional, please drop or comment function
Приложение содержит функционал для вывода превью картинки, который можно отключить удалив либо закомментировава функцию

```sh
setPreview(img, id);
```