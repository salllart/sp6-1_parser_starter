// @todo: напишите здесь код парсера

/**
 * @callback transformContentFn
 * @param content значение атрибута тега
 */
/**
 * Функция для поиска метатега по атрибуту name и возвращение преобразованного content
 * @param name атрибут метатега
 * @param { transformContentFn } callback 
 * @returns результат коллбэка
 */
function transformByName(name, transformContentFn) {
    const metaTag = document.querySelector(`meta[name="${name}"]`);
    return transformContentFn(metaTag.content);
}

/**
 * Ищет метатег по атрибуту property, возвращает content
 * @param property без префикса "og:"
 * @returns {string}
 */
function getContentByProperty(property) {
    const metaTag = document.querySelector(`meta[property="og:${property}"]`);
    return metaTag.content;
}

/**
 * @callback transformTextFn
 * @param textContent textContent элемента
 */
/**
 * Функция для поиска элемента по селектору и возвращение преобразованного textContent
 * @param selector
 * @param { transformTextFn } callback 
 * @returns результат коллбэка
 */
function transformTextBySelector(selector, transformTextFn) {
    const tag = document.querySelector(selector);
    return transformTextFn(tag.textContent.trim());
}

/**
 * Получить объект meta
 * @param head
 * @returns {object} 
 */
function parseMeta() {
    if (!document ) {
        throw new Error('Некоректные входные данные');
    }

    return {
        "language": document.querySelector("html").lang,
        // из заголовка ввида "{заголовок самой страницы} - {название сайта}" берём только первую часть
        "title": transformTextBySelector("title", text => text.split("—")[0].trim()),
        "keywords": transformByName("keywords", keywords => keywords.split(", ")),
        "description": transformByName("description", description => description),
        "opengraph": {
            "title": getContentByProperty("title"),
            "image": getContentByProperty("image"),
            "type": getContentByProperty("type")
            }
        }
}

/**
 * Получить объект product
 * @param container
 * @returns {object}
 */
function parseProduct(container) {
    // @todo: Проверка входных данных

    // @todo: Получить идентификатор товара в дата-атрибуте

    // @todo: Получить массив фотографий, пройтись циклом по <nav>

    // @todo: Получить название товара, статус лайка, цену, прошлую цену, скидку, валюту

    // @todo: Создать массивы бирок, категорий и скидок

    // @todo: Пройтись циклом по списку properties, получить объект {key: value}

    // @todo: Получить полное описание без лишних атрибутов
}

/**
 * Получить объект suggested
 * @param container
 * @returns {object}
 */
function parseSuggested(container) {
    // @todo: Пройтись циклом по items

        // @todo: Получить дочерние элементы карточки товара

        // @todo: Получить ссылку на изображение из атрибута

        // @todo: Получить название, цену, валюту, описание
}

/**
 * Получить объект reviews
 * @param container
 * @returns {object}
 */
function parseReviews(container) {
    // @todo: Пройтись циклом по items

        // @todo: Получить дочерние элементы отзыва

        // @todo: Посчитать количество звёзд с filled

        // @todo: Получить заголовк и последующие описание

        // @todo: Получить дочерние элементы author: получить аватар, имя, дату (DD.MM.YYYY)
    
}

function parsePage() {
    // @todo: Объявить перменные контейнеры по селекторам .product, .suggested, .reviews

    // @todo: Каждому контейнеру использовать соотвествующию функцию

    const product = document.querySelector(".product");
    const suggested  =  document.querySelector(".suggested");
    const reviews = document.querySelector(".reviews");

    return {
        "meta": parseMeta(),
        "product": parseProduct(product),
        "suggested": [],
        "reviews": []
    };
}

window.parsePage = parsePage;