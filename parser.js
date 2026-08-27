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
    if (transformContentFn === undefined) {
        return metaTag.content;
    }
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
 * Функция для поиска элемента по селектору и возвращение преобразованного указанного property
 * @param selector
 * @param {string} property // Указывает свойство которое обработает transformTextFn, например: textContetn, className, classList, innerHTML
 * @param { transformTextFn } callback // Если не указать, то функция вернёт значение по указанному porperty
 * @returns результат коллбэка
 */
function transformPropertyBySelector(selector, property, transformTextFn) {
    const tag = document.querySelector(selector);
    if (transformTextFn === undefined) {
        return tag[property].trim();
    }
    return transformTextFn(tag[property].trim());
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
        "title": transformPropertyBySelector("title", "textContent", text => text.split("—")[0].trim()),
        "keywords": transformByName("keywords", keywords => keywords.split(", ")),
        "description": transformByName("description"),
        "opengraph": {
            "title": getContentByProperty("title"),
            "image": getContentByProperty("image"),
            "type": getContentByProperty("type")
            }
        }
}

/**
 * Получить объект product
 * @param product
 * @returns {object}
 */
function parseProduct(product) {
    if (!product || product.innerHTML === "") {
        throw new Error("Некоректные входные данные товара");
    }

    // @todo: Получить массив фотографий, пройтись циклом по <nav>

    const [currentPrice, oldPrice] = transformPropertyBySelector(".price", "textContent", textContent => textContent.split("\n"))
        .map(price => +price.trim().slice(1));
    const discount = oldPrice - currentPrice;
    const discountPercent = `${discount / (oldPrice / 100)}%`;

    const tags = {
        "category" : [],
        "discount" : [],
        "label" : []
    }
    product.querySelectorAll(".tags > *").forEach(tag => {
        if (tag.className === "green") {
            tags["category"].push(tag.textContent);
        }
        if (tag.className === "blue") {
            tags["discount"].push(tag.textContent);
        }
        if (tag.className === "red") {
            tags["label"].push(tag.textContent);
        }
    })

    // @todo: Пройтись циклом по списку properties, получить объект {key: value}

    // @todo: Получить полное описание без лишних атрибутов

    return {
        "id": product.dataset.id,
        "name": product.querySelector("h1").textContent,
        "isLiked": Array(product.querySelector(".like").classList).includes("active"),
        "tags": tags,
        "price": currentPrice,
        "oldPrice": oldPrice,
        "discount": discount,
        "discountPercent": discountPercent,
        "currency": transformPropertyBySelector(".price", "textContent", text => {
            if (text.includes("₽")) {
                return "RUB";
            } else if (text.includes("€")) {
                return "EUR";
            } else if (text.includes("$")) {
                return "USD";
            }
        }),
    }
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