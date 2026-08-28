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
 * @callback transformPropertyFn
 * @param textContent textContent элемента
 */
/**
 * Функция для поиска элемента по селектору и возвращение преобразованного значения по указанному property
 * @param selector
 * @param {string} property // Указывает свойство которое обработает transformProperty, например: textContetn, className, classList, innerHTML
 * @param { transformPropertyFn } callback // Если не указать, то функция вернёт значение по указанному porperty
 * @param container // По умолчанию document
 * @returns результат коллбэка
 */
function transformBySelcetor(selector, property, transformPropertyFn, container=document) {
    const tag = container.querySelector(selector);
    if (!tag[property]) {
        throw new Error("Указанного свойства не существует")
    }

    if (transformPropertyFn === undefined) {
        return tag[property].trim();
    }
    return transformPropertyFn(tag[property].trim());
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
        "title": transformBySelcetor("title", "textContent", text => text.split("—")[0].trim()),
        "keywords": transformByName("keywords", keywords => keywords.split(", ")),
        "description": transformByName("description"),
        "opengraph": {
            "title": getContentByProperty("title").split("—")[0].trim(),
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

    const imageTags = product.querySelectorAll(".preview > nav img");
    const images = [];
    imageTags.forEach(img => images.push({
        "preview": img.src,
        "full": img.dataset.src,
        "alt": img.alt
    }));

    const [currentPrice, oldPrice] = transformBySelcetor(".price", "textContent", text => text.split("\n"))
        .map(price => +price.trim().slice(1));
    const discount = oldPrice - currentPrice;
    const discountPercent = `${(discount / (oldPrice / 100)).toFixed(2)}%`;

    const tags = {
        "category" : [],
        "discount" : [],
        "label" : []
    }

    product.querySelectorAll(".tags > *").forEach(tag => {
        if (tag.className === "green") {
            tags["category"].push(tag.textContent);
        }
        if (tag.className === "red") {
            tags["discount"].push(tag.textContent);
        }
        if (tag.className === "blue") {
            tags["label"].push(tag.textContent);
        }
    })

    const propertiesTags = product.querySelectorAll(".properties > li");
    const properties = {};
    propertiesTags.forEach(li => {
        const [key, value] = li.textContent.trim().split("\n");
        properties[key] = value.trim();
    });

    return {
        "id": product.dataset.id,
        "name": product.querySelector("h1").textContent,
        "isLiked": Array(product.querySelector(".like").classList).includes("active"),
        "tags": tags,
        "price": currentPrice,
        "oldPrice": oldPrice,
        "discount": discount,
        "discountPercent": discountPercent,
        "currency": transformBySelcetor(".price", "textContent", text => {
            if (text.includes("₽")) {
                return "RUB";
            } else if (text.includes("€")) {
                return "EUR";
            } else if (text.includes("$")) {
                return "USD";
            }
        }),
        "description": transformBySelcetor(".description", "innerHTML", desc => desc.replace(' class="unused"', '')),
        "images": images,
        "properties": properties
    }
}

/**
 * Получить объект suggested
 * @param suggested
 * @returns {array}
 */
function parseSuggested(suggested) {
    const items = suggested.querySelectorAll(".items > article");
    const result = [];

    items.forEach(article => {
        result.push({
            "name": article.querySelector("h3").textContent,
            "description": article.querySelector("p").textContent,
            "image": article.querySelector("img").src,
            "price": article.querySelector("b").textContent.trim().slice(1),
            "currency": transformBySelcetor("b", "textContent", text => {
                if (text.includes("₽")) {
                    return "RUB";
                } else if (text.includes("€")) {
                    return "EUR";
                } else if (text.includes("$")) {
                    return "USD";
                }
            }, article)
        })
    })

    return result;
}

/**
 * Получить объект reviews
 * @param reviews
 * @returns {array}
 */
function parseReviews(reviews) {
    // @todo: Пройтись циклом по items
    const items = reviews.querySelectorAll(".items > article");
    const result = [];

    items.forEach(article => {
        let rating = 0;
        const stars = article.querySelectorAll(".rating > span");
        stars.forEach(star => {
            if (star.className === "filled") {
            rating += 1;
            }
        });

        const [DD, MM, YYYY] = article.querySelector("i").textContent.trim().split("/");

        result.push({
            "rating": rating,
            "author": {
                "avatar": article.querySelector(".author > img").src,
                "name": article.querySelector(".author > span").textContent
            },
            "title": article.querySelector(".title").textContent,
            "description": article.querySelector("p").textContent,
            "date": `${DD}.${MM}.${YYYY}`
        })
    })
    return result;
}

function parsePage() {
    const product = document.querySelector(".product");
    const suggested  =  document.querySelector(".suggested");
    const reviews = document.querySelector(".reviews");

    return {
        "meta": parseMeta(),
        "product": parseProduct(product),
        "suggested": parseSuggested(suggested),
        "reviews": parseReviews(reviews)
    };
}

window.parsePage = parsePage;