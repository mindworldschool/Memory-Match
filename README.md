# MindWorld Memory — игра «Знайди пару»

Простая браузерная игра на внимательность (HTML/CSS/JS, без сборщиков и библиотек).

## Локальный запуск
Откройте `index.html` в браузере.

## Публикация на GitHub Pages
1. Создайте репозиторий, например `mws-memory`.
2. Загрузите файлы `index.html`, `styles.css`, `script.js` в корень репозитория.
3. В настройках репозитория **Settings → Pages** выберите Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)` и сохраните.
4. Через минуту сайт будет доступен по адресу `https://<ваш-логин>.github.io/mws-memory/`.

Если у вас нет опции «root», создайте папку `docs/`, переместите туда файлы и укажите **Folder: /docs**.

## Встраивание на сайт (Tilda и др.)
Добавьте HTML-блок со строкой:
```html
<iframe src="https://<ваш-логин>.github.io/mws-memory/" width="100%" height="760" style="border:0;max-width:920px;margin:auto;display:block;border-radius:16px;overflow:hidden;"></iframe>
```
