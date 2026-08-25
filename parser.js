// @todo: напишите здесь код парсера

/**
 * @callback transformContent
 * @param content значение атрибута тега
 */
/**
 * Функция для поиска метатега по атрибуту name и возвращение преобразованного content
 * @param name атрибут метатега
 * @param { transformContent } callback 
 * @returns результат коллбэка
 */
function transforContentByName(name, transformContent) {
    
}

/**
 * Ищет метатег по атрибуту property, возвращает content
 * @param property
 * @returns {string} content без "og:"
 */
function getContentByProperty(property) {

}

/**
 * @callback transformText
 * @param textContent textContent элемента
 */
/**
 * Функция для поиска элемента по селектору и возвращение преобразованного textContent
 * @param selector
 * @param { transformText } callback 
 * @returns результат коллбэка
 */
function transformTextBySelector(name, transformText) {
    
}

/**
 * Получить объект meta
 * @param page
 * @returns {object} 
 */
function parseMeta(page) {
    // @todo: Проверка входных данных

    // @todo: Получить язык страницы

    // @todo: Получить заголовок страницы без названия сайта

    // @todo: Поулчить ключевые слова
    
    // @todo: Получить описание из мета-тега

    // @todo: Получить opengraph-описание 
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

    return {
        "meta": {},
        "product": {},
        "suggested": [],
        "reviews": []
    };
}

window.parsePage = parsePage;